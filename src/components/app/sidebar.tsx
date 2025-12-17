'use client';

import { useMemo } from 'react';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { platforms, trendingTags } from '@/lib/data.tsx';
import { LineChart, Tag, Flame, Filter, ArrowDownUp } from 'lucide-react';
import AITrendPredictor from './ai-trend-predictor';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface AppSidebarProps {
  posts: Post[];
  isPopover?: boolean;
  sortMethod: string;
  onSortChange: (method: string) => void;
  onFilterClick: () => void;
  advancedTagsCount: number;
}

export default function AppSidebar({ 
  posts, 
  isPopover = false,
  sortMethod,
  onSortChange,
  onFilterClick,
  advancedTagsCount
}: AppSidebarProps) {

  const platformStats = useMemo(() => {
    const stats: Record<string, number> = {};
    posts.forEach(post => {
      stats[post.platform] = (stats[post.platform] || 0) + 1;
    });
    const total = posts.length;
    return Object.entries(stats)
      .map(([platform, count]) => ({
        platform,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  const popularTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [posts]);

  const sortOptions = ['trending', 'newest', 'booms', 'comments'];
  const sortLabels: Record<string, string> = { trending: 'Trending', newest: 'Newest', booms: 'Most Booms', comments: 'Most Comments' };

  const handleSortChange = () => {
    const currentIndex = sortOptions.indexOf(sortMethod);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    onSortChange(sortOptions[nextIndex]);
  };

  const SidebarContent = () => (
    <div className="space-y-4">
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base"><Flame className="w-5 h-5 mr-2" /> Booming Now</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {trendingTags.map(tag => (
            <Button key={tag.name} variant="ghost" size="sm" className="rounded-full bg-secondary hover:bg-secondary/80 h-auto py-1 px-3">
              {tag.icon} {tag.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">Content Tools</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
           <Button variant="outline" onClick={handleSortChange}>
              <ArrowDownUp className="w-4 h-4 mr-2" />
              Sort by: {sortLabels[sortMethod]}
            </Button>
            <Button variant={advancedTagsCount > 0 ? "default" : "outline"} onClick={onFilterClick}>
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filter
              {advancedTagsCount > 0 && <Badge variant="secondary" className="ml-2">{advancedTagsCount}</Badge>}
            </Button>
        </CardContent>
      </Card>

      <AITrendPredictor posts={posts} />

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base"><LineChart className="w-5 h-5 mr-2" /> Trending Platforms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {platformStats.map(({ platform, count, percentage }) => {
            const platformInfo = platforms[platform];
            return (
              <div key={platform}>
                <div className="flex items-center justify-between mb-1 text-sm">
                  <div className="flex items-center gap-2 font-medium" style={{color: platformInfo?.color}}>
                    {platformInfo?.icon}
                    <span>{platformInfo?.name}</span>
                  </div>
                  <span className="text-muted-foreground">{count} posts</span>
                </div>
                <Progress value={percentage} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base"><Tag className="w-5 h-5 mr-2" /> Popular Tags</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <Badge key={tag} variant="secondary" className="cursor-pointer">{tag}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  if (isPopover) {
    return (
      <ScrollArea className="h-[70vh] w-full pr-3">
        <SidebarContent />
      </ScrollArea>
    );
  }

  return (
    <aside className={cn("w-full lg:w-80 lg:shrink-0 space-y-5 hidden lg:block")}>
      <SidebarContent />
    </aside>
  );
}
