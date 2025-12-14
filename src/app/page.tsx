'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, Filter, ArrowDownUp, Flame, Zap, Search, LogIn, User, X } from 'lucide-react';
import { initialPosts, categories, trendingTags } from '@/lib/data';
import type { Post } from '@/lib/types';
import AppHeader from '@/components/app/header';
import PostCard from '@/components/app/post-card';
import AppSidebar from '@/components/app/sidebar';
import SubmitPostDialog from '@/components/app/submit-post-dialog';
import AdvancedFilterDialog from '@/components/app/advanced-filter-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Facebook as FacebookIcon } from '@/components/icons';

export default function TrendifyPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMethod, setSortMethod] = useState('trending');
  const [isSubmitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isFilterDialogOpen, setFilterDialogOpen] = useState(false);
  const [advancedTags, setAdvancedTags] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<any>(null); // Placeholder for user state

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


  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialPosts.length };
    categories.slice(1).forEach(cat => {
      counts[cat.name] = initialPosts.filter(p => p.tags.some(t => t.toLowerCase().includes(cat.name.toLowerCase()))).length;
    });
    return counts;
  }, []);

  const displayedPosts = useMemo(() => {
    let filteredPosts = [...posts];

    if (activeCategory !== 'All') {
      filteredPosts = filteredPosts.filter(post =>
        post.tags.some(tag => tag.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }
    
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
        case 'comments': return b.comments - a.comments;
        case 'trending':
        default:
          const scoreA = a.booms + a.comments * 2 + a.shares * 3;
          const scoreB = b.booms + b.comments * 2 + b.shares * 3;
          return scoreB - scoreA;
      }
    });
  }, [posts, activeCategory, searchQuery, sortMethod, advancedTags]);
  
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

  const handleBoom = (postId: number) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId
          ? { ...p, isBoomed: !p.isBoomed, booms: p.isBoomed ? p.booms - 1 : p.booms + 1 }
          : p
      )
    );
    const post = posts.find(p => p.id === postId);
    if(post) {
      toast({
        title: post.isBoomed ? 'Boom removed' : 'Post Boomed!',
        description: `You've ${post.isBoomed ? 'unboomed' : 'boomed'} the post.`,
      });
    }
  };

  const handleAddPost = (newPostData: Omit<Post, 'id'>) => {
    const newPost: Post = {
      ...newPostData,
      id: posts.length + 1,
    };
    setPosts(prev => [newPost, ...prev]);
  };
  
  if (!hydrated) {
    return null;
  }
  
  const sortOptions = ['trending', 'newest', 'booms', 'comments'];
  const sortLabels: Record<string, string> = { trending: 'Trending', newest: 'Newest', booms: 'Most Booms', comments: 'Most Comments' };

  const handleSortChange = () => {
    const currentIndex = sortOptions.indexOf(sortMethod);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortMethod(sortOptions[nextIndex]);
  };

  const pageTitle = "Discover What's Booming";
  const pageSubtitle = "Fresh posts glow for easy spotting";

  return (
    <div className="bg-background min-h-screen text-foreground">
      <AppHeader onSearchChange={setSearchQuery} posts={posts} />

      <div className="bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-2 overflow-x-auto py-3 scrollbar-hide">
            {categories.map(cat => (
              <Button
                key={cat.name}
                variant={activeCategory === cat.name ? 'default' : 'ghost'}
                size="sm"
                className="rounded-full shrink-0"
                onClick={() => setActiveCategory(cat.name)}
              >
                {cat.icon && <cat.icon className="mr-2 h-4 w-4" />}
                {cat.name}
                <Badge variant="secondary" className="ml-2">{categoryCounts[cat.name] || 0}</Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2">
        <div className="container mx-auto px-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <h3 className="text-sm font-bold shrink-0 flex items-center gap-2"><Flame className="w-4 h-4"/> Booming Now:</h3>
          {trendingTags.map(tag => (
            <Button key={tag.name} variant="ghost" size="sm" className="rounded-full shrink-0 bg-white/20 hover:bg-white/30 text-white">
              {tag.icon} {tag.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="container mx-auto flex max-w-[1400px] flex-col gap-5 p-4 lg:flex-row lg:py-5">
        <AppSidebar
          posts={posts}
        />
        <main className="flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-y-2">
            <div>
              <h1 className="text-2xl font-headline font-bold text-gray-800">{pageTitle}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><Zap className="w-4 h-4 text-primary"/> {pageSubtitle}</p>
            </div>
            <div className="flex gap-2">
              <Button variant={advancedTags.length > 0 ? "default" : "outline"} className="hidden sm:flex" onClick={() => setFilterDialogOpen(true)}>
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
                {advancedTags.length > 0 && <Badge variant="secondary" className="ml-2">{advancedTags.length}</Badge>}
              </Button>
              <Button variant="outline" onClick={handleSortChange}>
                <ArrowDownUp className="w-4 h-4 mr-2" />
                {sortLabels[sortMethod]}
              </Button>
            </div>
          </div>
          
          {advancedTags.length > 0 && (
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
                  onBoom={handleBoom} 
                />
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center text-center py-20 bg-card rounded-lg shadow-sm">
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
                        <Button onClick={handleGoogleSignIn}>
                          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 12.5 244 12.5c72.6 0 134.3 29.3 179.9 74.5L356.1 154.3c-34.4-33.4-85.3-54.3-138.2-54.3-109.1 0-198.3 88.3-198.3 197.8s89.2 197.8 198.3 197.8c114.9 0 181.7-83.3 185.5-161.4H244V261.8h244z"></path></svg>
                          Log in with Google
                        </Button>
                        <Button onClick={handleFacebookSignIn} variant="outline">
                            <FacebookIcon className="mr-2 h-4 w-4" />
                            Log in with Facebook
                        </Button>
                    </div>
                </div>
                )}
            </div>
          )}
        </main>
      </div>

      <Button
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
      />
    </div>
  );
}
