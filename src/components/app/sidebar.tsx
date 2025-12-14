'use client';

import { useMemo } from 'react';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { platforms } from '@/lib/data.tsx';
import { LineChart } from 'lucide-react';
import AITrendPredictor from './ai-trend-predictor';
import { cn } from '@/lib/utils';

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

  if (isPopover) {
    return (
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
                  <Progress value={percentage} indicatorClassName="bg-primary" />
                </div>
              );
            })}
          </CardContent>
        </Card>
        <AITrendPredictor posts={posts} />
      </div>
    );
  }

  return (
    <aside className={cn("w-full lg:w-80 lg:shrink-0 space-y-5 hidden lg:block")}>
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

    </aside>
  );
}
