'use client';

import { useState, useMemo } from 'react';
import type { Post, FilterTagGroup } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { popularSidebarTags, platforms } from '@/lib/data.tsx';
import { cn } from '@/lib/utils';
import { LineChart, Tags } from 'lucide-react';
import AITrendPredictor from './ai-trend-predictor';

interface AppSidebarProps {
  activeTags: Set<string>;
  onToggleTag: (tag: string) => void;
  posts: Post[];
  tagGroups: FilterTagGroup[];
}

export default function AppSidebar({ activeTags, onToggleTag, posts, tagGroups }: AppSidebarProps) {
  const popularTagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        if (popularSidebarTags.includes(tag)) {
          counts[tag] = (counts[tag] || 0) + 1;
        }
      });
    });
    return counts;
  }, [posts]);

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

  return (
    <aside className="w-full lg:w-80 lg:shrink-0 space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base"><Tags className="w-5 h-5 mr-2" /> Filter by Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tagGroups.map(group => (
            <div key={group.label}>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <group.icon className="w-4 h-4 text-muted-foreground" />
                {group.label}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.tags.map(tag => (
                  <Button
                    key={tag.name}
                    variant={activeTags.has(tag.name) ? 'default' : 'secondary'}
                    size="sm"
                    className="rounded-full h-auto py-1 px-3"
                    onClick={() => onToggleTag(tag.name)}
                  >
                    {tag.name}
                    <Badge variant={activeTags.has(tag.name) ? "secondary" : "default"} className="ml-2">{tag.count}</Badge>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base"><Tags className="w-5 h-5 mr-2" /> Popular Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {popularSidebarTags.map(tag => (
            <Button
              key={tag}
              variant={activeTags.has(tag) ? 'default' : 'outline'}
              className={cn("w-full justify-between", activeTags.has(tag) && "bg-accent text-accent-foreground")}
              onClick={() => onToggleTag(tag)}
            >
              <span>{tag}</span>
              <Badge variant={activeTags.has(tag) ? 'outline' : 'default'}>{popularTagCounts[tag] || 0}</Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      <AITrendPredictor posts={posts} />

    </aside>
  );
}
