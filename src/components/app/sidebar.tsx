'use client';

import { useMemo } from 'react';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { platforms } from '@/lib/data.tsx';
import { LineChart, Tag, Flame, Filter, ArrowDownUp, Trophy, Star } from 'lucide-react';
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

  const topCurators = useMemo(() => {
    const curatorsStats: Record<string, number> = {};
    posts.forEach(post => {
      if (post.submitter) {
         curatorsStats[post.submitter] = (curatorsStats[post.submitter] || 0) + post.booms;
      }
    });
    return Object.entries(curatorsStats)
      .map(([name, booms]) => ({ name, booms }))
      .sort((a, b) => b.booms - a.booms)
      .slice(0, 5); // top 5 indexers
  }, [posts]);

  const sortOptions = ['trending', 'newest', 'booms'];
  const sortLabels: Record<string, string> = { trending: 'Trending', newest: 'Newest', booms: 'Most Booms' };

  const handleSortChange = () => {
    const currentIndex = sortOptions.indexOf(sortMethod);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    onSortChange(sortOptions[nextIndex]);
  };

  const SidebarContent = () => (
    <div className="space-y-4">
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base"><Flame className="w-5 h-5 mr-2 text-boom" /> Booming Flairs</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <Button key={tag} variant="ghost" size="sm" className="rounded-full bg-secondary hover:bg-secondary/80 h-auto py-1 px-3 text-xs font-bold" onClick={onFilterClick}>
              #{tag}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base"><Trophy className="w-5 h-5 mr-2 text-boom" /> Top Curators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topCurators.map((curator, index) => (
             <div key={curator.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs font-black", index === 0 ? "text-boom drop-shadow-md" : index === 1 ? "text-orange-400" : index === 2 ? "text-slate-400" : "text-muted-foreground")}>
                    #{index + 1}
                  </span>
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-foreground">{curator.name}</span>
                     <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase tracking-widest"><Star className={cn("w-3 h-3", index === 0 ? "text-boom fill-boom" : "text-white/20 fill-white/20")}/> {index === 0 ? "Grand Architect" : index === 1 ? "Elite Indexer" : "Scout"}</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-boom/10 text-boom font-black border-none shadow-[0_0_10px_-2px_rgba(255,107,53,0.3)]">
                   {curator.booms} Booms
                </Badge>
             </div>
          ))}
        </CardContent>
      </Card>

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
