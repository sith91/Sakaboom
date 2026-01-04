'use client';

import { useState, useEffect } from 'react';
import AppHeader from '@/components/app/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/app/post-card';
import { mockUserProfile } from '@/lib/data';
import { initialPosts } from '@/lib/data';
import type { Post, UserProfileData } from '@/lib/types';
import { Mail, CalendarDays, Edit, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you'd fetch this data based on the logged-in user
    setProfileData(mockUserProfile);
  }, []);
  
  const handleBoom = (postId: number) => {
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;

    if (!post.isBoomed) {
      setAllPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === postId ? { ...p, booms: p.booms + 1, isBoomed: true } : p
        )
      );
      toast({
        title: 'Post Boomed!',
        description: "You've boomed this post."
      });
    }
  };
  
  const handleTagClick = (tag: string) => {
    // This could navigate back to the home page with a filter
    toast({
        title: "Tag Clicked",
        description: `Navigating to see more posts about ${tag}.`
    });
  };

  const handleSignOut = () => {
    toast({ title: 'Sign out functionality to be implemented' });
  };
  
  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  const { user, sharedPosts, viewedPosts } = profileData;

  return (
    <div className="bg-background min-h-screen text-foreground">
      <AppHeader
        onSearchChange={() => {}}
        posts={allPosts}
        sortMethod="trending"
        onSortChange={() => {}}
        onFilterClick={() => {}}
        advancedTagsCount={0}
      />
      <main className="container mx-auto max-w-5xl py-8 px-4">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 text-4xl border-2 border-primary">
                <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'User'} />
                <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-grow text-center sm:text-left">
                <h1 className="text-3xl font-headline font-bold">{user.displayName}</h1>
                <div className="text-muted-foreground flex items-center gap-4 mt-2 justify-center sm:justify-start">
                  <span className="flex items-center gap-2"><Mail className="w-4 h-4"/> {user.email}</span>
                  <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4"/> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <Button variant="outline"><Edit className="w-4 h-4 mr-2"/> Edit Profile</Button>
                <Button variant="ghost" onClick={handleSignOut}><LogOut className="w-4 h-4 mr-2"/> Sign Out</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="shared">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shared">Shared by You ({sharedPosts.length})</TabsTrigger>
            <TabsTrigger value="viewed">Recently Viewed ({viewedPosts.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="shared" className="mt-6">
            {sharedPosts.length > 0 ? (
                <div className="masonry-grid">
                {sharedPosts.map(post => (
                    <PostCard key={`shared-${post.id}`} post={post} onBoom={handleBoom} onTagClick={handleTagClick} />
                ))}
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground">You haven't shared any posts yet.</div>
            )}
          </TabsContent>
          <TabsContent value="viewed" className="mt-6">
            {viewedPosts.length > 0 ? (
                <div className="masonry-grid">
                {viewedPosts.map(post => (
                    <PostCard key={`viewed-${post.id}`} post={post} onBoom={handleBoom} onTagClick={handleTagClick} />
                ))}
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground">You haven't viewed any posts yet.</div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
