'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, Filter, ArrowDownUp, Flame, Zap, Search } from 'lucide-react';
import { initialPosts, categories, trendingTags, filterTagGroups } from '@/lib/data';
import type { Post } from '@/lib/types';
import AppHeader from '@/components/app/header';
import PostCard from '@/components/app/post-card';
import AppSidebar from '@/components/app/sidebar';
import SubmitPostDialog from '@/components/app/submit-post-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function TrendifyPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [sortMethod, setSortMethod] = useState('trending');
  const [isSubmitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    categories.slice(1).forEach(cat => {
      counts[cat.name] = posts.filter(p => p.tags.some(t => t.toLowerCase().includes(cat.name.toLowerCase()))).length;
    });
    return counts;
  }, [posts]);

  const displayedPosts = useMemo(() => {
    let filteredPosts = [...posts];

    if (activeCategory !== 'All') {
      filteredPosts = filteredPosts.filter(post =>
        post.tags.some(tag => tag.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.text.toLowerCase().includes(lowercasedQuery) ||
        (post.caption && post.caption.toLowerCase().includes(lowercasedQuery)) ||
        post.submitter.toLowerCase().includes(lowercasedQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
      );
    }

    if (activeTags.size > 0) {
      const requiredTags = Array.from(activeTags);
      filteredPosts = filteredPosts.filter(post =>
        requiredTags.every(tag => post.tags.includes(tag))
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
  }, [posts, activeCategory, searchQuery, activeTags, sortMethod]);

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

  const handleToggleTag = (tag: string) => {
    setActiveTags(prev => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  const clearAllFilters = () => {
    setActiveTags(new Set());
    toast({ title: 'All filters cleared' });
  };
  
  const handleSelectTrendingTag = (tag: string) => {
    clearAllFilters();
    setActiveTags(new Set([tag]));
    toast({ title: `Filtered by: ${tag}` });
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

  const pageTitle = activeTags.size > 0 
    ? activeTags.size === 1 
      ? `Filtered by: ${Array.from(activeTags)[0]}` 
      : 'Multiple Filters Applied'
    : "Discover What's Booming";
    
  const pageSubtitle = activeTags.size > 0
    ? `Showing ${displayedPosts.length} posts`
    : "Fresh posts glow for easy spotting";

  return (
    <div className="bg-background min-h-screen text-foreground">
      <AppHeader onSearchChange={setSearchQuery} />

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
      
      {activeTags.size > 0 && (
        <div className="bg-card border-b py-3">
          <div className="container mx-auto px-4 flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Filter className="w-4 h-4"/> Active Filters:</h3>
            {Array.from(activeTags).map(tag => (
              <Badge key={tag} variant="default" className="gap-1">
                {tag}
                <button onClick={() => handleToggleTag(tag)} className="rounded-full hover:bg-primary-foreground/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="ml-auto">Clear All</Button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2">
        <div className="container mx-auto px-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <h3 className="text-sm font-bold shrink-0 flex items-center gap-2"><Flame className="w-4 h-4"/> Booming Now:</h3>
          {trendingTags.map(tag => (
            <Button key={tag.name} variant="ghost" size="sm" className="rounded-full shrink-0 bg-white/20 hover:bg-white/30 text-white" onClick={() => handleSelectTrendingTag(tag.name)}>
              {tag.icon} {tag.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="container mx-auto flex max-w-[1400px] flex-col gap-5 p-4 lg:flex-row lg:py-5">
        <AppSidebar
          activeTags={activeTags}
          onToggleTag={handleToggleTag}
          posts={posts}
          tagGroups={filterTagGroups}
        />
        <main className="flex-1">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-headline font-bold text-gray-800">{pageTitle}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><Zap className="w-4 h-4 text-primary"/> {pageSubtitle}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="hidden sm:flex">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>
              <Button variant="outline" onClick={handleSortChange}>
                <ArrowDownUp className="w-4 h-4 mr-2" />
                {sortLabels[sortMethod]}
              </Button>
            </div>
          </div>
          
          {displayedPosts.length > 0 ? (
            <div className="masonry-grid">
              {displayedPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onBoom={handleBoom} 
                  onTagClick={handleToggleTag}
                  activeTags={activeTags}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-card rounded-lg shadow-sm">
                <Search className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-bold">No Posts Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filter settings.</p>
                {activeTags.size > 0 && <Button onClick={clearAllFilters} className="mt-4">Clear Filters</Button>}
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
    </div>
  );
}
