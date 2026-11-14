'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { initialPosts } from '@/lib/data';
import type { Post, Submission } from '@/lib/types';
import AppHeader from '@/components/app/header';
import PostCard from '@/components/app/post-card';
import PostDetailDialog from '@/components/app/post-detail-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Globe } from 'lucide-react';
import AddContentDialog from '@/components/app/add-content-dialog';
import { useToast } from '@/hooks/use-toast';

export default function ExplorePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setSubmitDialogOpen] = useState(false);

  const [visiblePostsCount, setVisiblePostsCount] = useState(12);
  const allPostsSorted = useMemo(() => 
    [...posts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [posts]
  );

  const handleTagClick = (tag: string) => {
    router.push(`/home?tags=${encodeURIComponent(tag)}`);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setDetailDialogOpen(true);
  };
  
  const handleBoomersClick = (post: Post) => {
    router.push(`/home?viewSubmissions=${post.id}`);
  };

  const handleAddPost = (newPostData: Omit<Post, 'id' | 'boomers' | 'submissions'>) => {
    const existingPost = posts.find(p => p.url === newPostData.url);

    if (existingPost) {
        setPosts(prevPosts =>
          prevPosts.map(p => {
            if (p.id === existingPost.id) {
                const newSubmission: Submission = {
                    submitter: newPostData.submitter,
                    description: newPostData.caption,
                    timestamp: new Date()
                };
                return {
                  ...p,
                  boomers: p.submissions.length + 1,
                  submissions: [...p.submissions, newSubmission],
                };
            }
            return p;
          })
        );
        toast({
            title: 'Link Already Shared!',
            description: "Your perspective has been added to the existing post!",
        });
    } else {
        const newSubmission: Submission = {
            submitter: newPostData.submitter,
            description: newPostData.caption,
            timestamp: newPostData.timestamp,
        };
        const newPost: Post = {
            ...newPostData,
            id: posts.length + 1,
            boomers: 1,
            submissions: [newSubmission],
        };
        setPosts(prev => [newPost, ...prev]);
    }
  };

  const handleSearch = (query: string) => {
      router.push(`/home?q=${query}`);
  };

  const handleSortChange = (method: string) => {
      router.push(`/home?sort=${method}`);
  };
  
  const handleFilterClick = () => {
      router.push('/home?showFilter=true');
  };

  useEffect(() => {
    const onScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && visiblePostsCount < allPostsSorted.length) {
        setVisiblePostsCount(count => count + 8);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [allPostsSorted.length, visiblePostsCount]);

  return (
    <div className="bg-background min-h-screen text-foreground">
      <AppHeader
        onSearchChange={handleSearch}
        posts={posts}
        sortMethod="newest"
        onSortChange={handleSortChange}
        onFilterClick={handleFilterClick}
        advancedTagsCount={0}
      />
      
      <div className="container mx-auto flex max-w-[1400px] flex-col gap-5 p-4 lg:py-5">
        <main className="flex-1">
          <div className="mb-5">
            <h1 className="text-2xl font-headline font-bold">Explore Feed</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary"/> All posts from the community, continuously updated.
            </p>
          </div>
          
          <div className="masonry-grid">
            {allPostsSorted.slice(0, visiblePostsCount).map(post => (
              <PostCard 
                key={post.id} 
                post={post}
                onTagClick={handleTagClick}
                onPostClick={handlePostClick}
                onBoomersClick={handleBoomersClick}
              />
            ))}
          </div>
        </main>
      </div>

      <Button
        variant="secondary"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        onClick={() => setSubmitDialogOpen(true)}
      >
        <Plus className="h-7 w-7" />
      </Button>

      <AddContentDialog
        open={isSubmitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        onPostSubmit={handleAddPost}
      />
      <PostDetailDialog
        post={selectedPost}
        open={isDetailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onTagClick={handleTagClick}
      />
    </div>
  );
}
