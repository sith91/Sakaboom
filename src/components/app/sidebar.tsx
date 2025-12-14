'use client';

import { useMemo } from 'react';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { platforms } from '@/lib/data.tsx';
import { LineChart, Tag } from 'lucide-react';
import AITrendPredictor from './ai-trend-predictor';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AppSidebarProps {
  posts: Post[];
  isPopover?: boolean;
}

export default function AppSidebar({ posts, isPopover = false }: AppSidebarProps) {

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

  const SidebarContent = () => (
    <div className="space-y-5">
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

      <AITrendPredictor posts={posts} />

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
    return <SidebarContent />;
  }

  return (
    <aside className={cn("w-full lg:w-80 lg:shrink-0 space-y-5 hidden lg:block")}>
      <SidebarContent />
    </aside>
  );
}
