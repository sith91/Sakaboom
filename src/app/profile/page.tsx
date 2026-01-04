'use client';

import { useState, useEffect } from 'react';
import AppHeader from '@/components/app/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/app/post-card';
import { mockUserProfile } from '@/lib/data';
import { initialPosts } from '@/lib/data';
import type { Post, UserProfileData } from '@/lib/types';
import { Mail, CalendarDays, Edit, LogOut, Award, DollarSign, Database, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you'd fetch this data based on the logged-in user
    setProfileData(mockUserProfile);
  }, []);

  const handleDataSharingToggle = (isShared: boolean) => {
    if (profileData) {
        // This would typically be an API call to update user preferences
        const updatedUser = { ...profileData.user, sharesData: isShared, points: isShared ? profileData.user.points + 5 : profileData.user.points - 5 };
        setProfileData({ ...profileData, user: updatedUser });
        toast({
            title: 'Privacy settings updated',
            description: `You are now ${isShared ? 'sharing' : 'not sharing'} anonymized data.`,
        });
    }
  };
  
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
  const earnings = (user.points / 100).toFixed(2);


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
      <main className="container mx-auto max-w-6xl py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-1 space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="w-24 h-24 text-4xl border-2 border-primary">
                        <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'User'} />
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h1 className="text-2xl font-headline font-bold">{user.displayName}</h1>
                        <div className="text-muted-foreground flex items-center gap-2 mt-1 justify-center">
                          <Mail className="w-4 h-4"/> <span>{user.email}</span>
                        </div>
                         <div className="text-muted-foreground flex items-center gap-2 mt-1 justify-center">
                          <CalendarDays className="w-4 h-4"/> <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex w-full gap-2">
                        <Button variant="outline" className="flex-1"><Edit className="w-4 h-4 mr-2"/> Edit</Button>
                        <Button variant="ghost" onClick={handleSignOut} className="flex-1"><LogOut className="w-4 h-4 mr-2"/> Sign Out</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg"><Award className="w-5 h-5 mr-2 text-primary"/> Points & Rewards</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <p className="text-4xl font-bold">{user.points}</p>
                            <p className="text-sm text-muted-foreground">Total Points</p>
                        </div>
                        <div className="flex items-center justify-center text-lg gap-2 p-3 bg-secondary rounded-md">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            <span className="font-semibold">USD ${earnings}</span>
                        </div>
                        <CardDescription className="text-xs text-center">
                            Earn 1 point for every 1000 clicks on your shared posts. 100 points = $1 USD.
                        </CardDescription>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg"><Database className="w-5 h-5 mr-2 text-primary"/> Data & Privacy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between space-x-2 p-3 bg-secondary/50 rounded-lg">
                          <Label htmlFor="data-sharing" className="flex-1 text-sm pr-4">
                            Share anonymized data with researchers to earn 5 bonus points.
                          </Label>
                          <Switch
                            id="data-sharing"
                            checked={user.sharesData}
                            onCheckedChange={handleDataSharingToggle}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3"/> Your personal information is never shared.</p>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2">
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
            </div>
        </div>
      </main>
    </div>
  );
}
