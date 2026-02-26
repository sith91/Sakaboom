'use client';

import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Plus, Search, User, X, Zap } from 'lucide-react';
import { initialPosts } from '@/lib/data';
import type { Post, Submission } from '@/lib/types';
import AppHeader from '@/components/app/header';
import PostCard from '@/components/app/post-card';
import SubmitPostDialog from '@/components/app/submit-post-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Facebook as FacebookIcon } from '@/components/icons';
import AdvancedFilterDialog from '@/components/app/advanced-filter-dialog';


export default function TrendifyHomePage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMethod, setSortMethod] = useState('trending');
  const [isSubmitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isFilterDialogOpen, setFilterDialogOpen] = useState(false);
  const [advancedTags, setAdvancedTags] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<any>(null); // Placeholder for user state
  const [viewingSubmissionsFor, setViewingSubmissionsFor] = useState<Post | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleGoogleSignIn = () => {
    toast({ title: 'Sign in functionality to be implemented' });
  };
  const handleFacebookSignIn = () => {
    toast({ title: 'Sign in functionality to be implemented' });
  };
  
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [posts]);

  const handleBoomersClick = (post: Post) => {
    setViewingSubmissionsFor(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFeed = () => {
      setViewingSubmissionsFor(null);
  };

  const displayedPosts = useMemo(() => {
    if (viewingSubmissionsFor) {
        const parentPost = posts.find(p => p.id === viewingSubmissionsFor.id) || viewingSubmissionsFor;
        return parentPost.submissions.map((submission, index) => ({
            ...parentPost,
            id: parentPost.id * 1000 + index, // Create a unique ID for the key
            caption: submission.description,
            timestamp: submission.timestamp,
            submitter: submission.submitter,
            submissions: [submission], // The "submission" for this card is just itself
        })).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    let filteredPosts = [...posts];
    
    // Advanced Tag Search (All tags must match)
    if (advancedTags.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        advancedTags.every(advTag => 
          post.tags.some(postTag => postTag.toLowerCase().includes(advTag.toLowerCase()))
        )
      );
    }

    // Simple Search (Any field can match)
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.text.toLowerCase().includes(lowercasedQuery) ||
        (post.caption && post.caption.toLowerCase().includes(lowercasedQuery)) ||
        post.submitter.toLowerCase().includes(lowercasedQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
      );
    }

    return filteredPosts.sort((a, b) => {
      switch (sortMethod) {
        case 'newest': return b.timestamp.getTime() - a.timestamp.getTime();
        case 'booms': return b.booms - a.booms;
        case 'trending':
        default:
          const scoreA = a.booms;
          const scoreB = b.booms;
          return scoreB - scoreA;
      }
    });
  }, [posts, searchQuery, sortMethod, advancedTags, viewingSubmissionsFor]);
  
  const handleApplyAdvancedFilter = (tags: string[]) => {
    setAdvancedTags(tags);
    setFilterDialogOpen(false);
    if(tags.length > 0) {
        toast({
            title: "Filter Applied",
            description: `Showing posts with tags: ${tags.join(', ')}`
        })
    } else {
        toast({
            title: "Filter Cleared",
            description: "Advanced tag filter has been removed."
        })
    }
  };

  const handleTagClick = (tag: string) => {
    if (viewingSubmissionsFor) {
        handleBackToFeed();
    }
    setAdvancedTags([tag]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({
        title: "Filter Applied",
        description: `Showing posts with tag: ${tag}`
    });
  };
  
  const handleBoom = (postId: number) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId && !p.isBoomed
          ? { ...p, booms: p.booms + 1, isBoomed: true }
          : p
      )
    );
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
  
  if (!hydrated) {
    return null;
  }

  const pageTitle = viewingSubmissionsFor ? `Submissions for Link` : "What's Trending Now";
  const pageSubtitle = viewingSubmissionsFor ? `${viewingSubmissionsFor.submissions.length} perspectives on the same story.` : "The latest posts, powered by people like you.";

  return (
    <div className="bg-background min-h-screen text-foreground">
      <AppHeader
        onSearchChange={setSearchQuery}
        posts={posts}
        sortMethod={sortMethod}
        onSortChange={setSortMethod}
        onFilterClick={() => setFilterDialogOpen(true)}
        advancedTagsCount={advancedTags.length}
      />
      
      <div className="container mx-auto flex max-w-[1400px] flex-col gap-5 p-4 lg:py-5">
        <main className="flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-y-2">
            <div>
              <h1 className="text-2xl font-headline font-bold">{pageTitle}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><Zap className="w-4 h-4 text-primary"/> {pageSubtitle}</p>
            </div>
             {viewingSubmissionsFor && (
                <Button onClick={handleBackToFeed} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2"/> Back to Main Feed
                </Button>
            )}
          </div>
          
          {advancedTags.length > 0 && !viewingSubmissionsFor && (
             <div className="mb-4 flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-medium">Active Filters:</h3>
                {advancedTags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => handleApplyAdvancedFilter([])}>
                    <X className="w-4 h-4 mr-1"/> Clear All
                </Button>
            </div>
          )}

          {displayedPosts.length > 0 ? (
            <div className="masonry-grid">
              {displayedPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onTagClick={handleTagClick}
                  onBoom={() => handleBoom(viewingSubmissionsFor ? viewingSubmissionsFor.id : post.id)}
                  onBoomersClick={!viewingSubmissionsFor ? handleBoomersClick : undefined}
                />
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center text-center py-20 bg-card rounded-lg">
                {user ? (
                  <>
                    <Search className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-bold">No Posts Found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filter settings.</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <User className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-bold">Welcome to Trendify!</h3>
                    <p className="text-muted-foreground mt-2">Log in to see the hottest trends and boom your favorite posts.</p>
                    <div className="flex gap-4 mt-4">
                        <Button onClick={handleGoogleSignIn} variant="secondary">
                          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 12.5 244 12.5c72.6 0 134.3 29.3 179.9 74.5L356.1 154.3c-34.4-33.4-85.3-54.3-138.2-54.3-109.1 0-198.3 88.3-198.3 197.8s89.2 197.8 198.3 197.8c114.9 0 181.7-83.3 185.5-161.4H244V261.8h244z"></path></svg>
                          Sign Up with Google
                        </Button>
                        <Button onClick={handleFacebookSignIn} variant="secondary">
                            <FacebookIcon className="mr-2 h-4 w-4" />
                            Sign Up with Facebook
                        </Button>
                    </div>
                </div>
                )}
            </div>
          )}
        </main>
      </div>

      <Button
        variant="secondary"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        onClick={() => setSubmitDialogOpen(true)}
      >
        <Plus className="h-7 w-7" />
      </Button>

      <SubmitPostDialog
        open={isSubmitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        onPostSubmit={handleAddPost}
      />
      <AdvancedFilterDialog 
        open={isFilterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        onApplyFilter={handleApplyAdvancedFilter}
        initialTags={advancedTags}
        allTags={allTags}
      />
    </div>
  );
}
