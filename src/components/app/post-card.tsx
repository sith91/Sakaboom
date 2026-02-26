'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { platforms } from '@/lib/data.tsx';
import type { Post } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  ExternalLink,
  Users,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import SubmissionsDialog from './submissions-dialog';

interface PostCardProps {
  post: Post;
  onTagClick: (tag: string) => void;
  onBoom?: () => void;
}

function getTimeAgo(timestamp: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'm';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm';
  return 'Just now';
}

const tagColorClasses = [
  'border-sky-500 text-sky-600 hover:bg-sky-50 bg-sky-50/50',
  'border-emerald-500 text-emerald-600 hover:bg-emerald-50 bg-emerald-50/50',
  'border-amber-500 text-amber-600 hover:bg-amber-50 bg-amber-50/50',
  'border-violet-500 text-violet-600 hover:bg-violet-50 bg-violet-50/50',
  'border-pink-500 text-pink-600 hover:bg-pink-50 bg-pink-50/50',
  'border-indigo-500 text-indigo-600 hover:bg-indigo-50 bg-indigo-50/50',
];


const getTagColor = (index: number) => {
    return tagColorClasses[index % tagColorClasses.length];
}

export default function PostCard({ post, onTagClick, onBoom }: PostCardProps) {
  const platformInfo = platforms[post.platform];
  const [imageError, setImageError] = useState(false);
  const [submissionsOpen, setSubmissionsOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click target is a button, a link, a badge, or inside one
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('a') || 
      target.closest('[data-tag-badge]')
    ) {
      return;
    }
    // Assume user is logged in for boom to happen.
    // In a real app, you'd check auth state.
    onBoom?.();
    window.open(post.url, '_blank', 'noopener,noreferrer');
  };

  const handleTagBadgeClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    onTagClick(tag);
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        className={cn(
          'overflow-hidden shadow-sm border flex flex-col cursor-pointer transition-colors hover:bg-secondary/50',
          post.isNew && 'glow-pulse'
        )}
      >
        <CardHeader className="p-4 relative flex-row gap-4 items-start">
          <div className="w-16 h-16 relative shrink-0">
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center rounded-lg bg-secondary text-muted-foreground/50" style={{color: platformInfo?.color}}>
                  {React.cloneElement(platformInfo?.icon as React.ReactElement, { className: 'w-8 h-8 opacity-50' })}
              </div>
            ) : (
              <Image
                  src={post.media}
                  alt={post.text}
                  fill
                  className="object-cover rounded-lg"
                  data-ai-hint={post.mediaHint}
                  onError={() => setImageError(true)}
              />
            )}
          </div>

          <div className='flex flex-col flex-1'>
              <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: platformInfo?.color }}>
                      {platformInfo?.icon}
                      <span>{platformInfo?.name}</span>
                  </div>
                  <time className="text-xs text-muted-foreground">{getTimeAgo(post.timestamp)}</time>
              </div>
              <p className="mb-3 text-sm text-foreground/80 line-clamp-3">{post.caption}</p>
          </div>
        </CardHeader>
        
        <CardContent className="px-4 pb-2 pt-0 mt-auto">
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.map((tag, index) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn(
                  "cursor-pointer font-normal",
                  getTagColor(index)
                )}
                data-tag-badge
                onClick={(e) => handleTagBadgeClick(e, tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center p-4 pt-2">
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSubmissionsOpen(true);
                }}
                className="flex items-center gap-1 font-semibold hover:text-primary cursor-pointer"
              >
                <Users className="w-4 h-4" />{post.boomers.toLocaleString()} Boomers
              </button>
              <span className="flex items-center gap-1 font-semibold"><Zap className="w-4 h-4" />{post.booms.toLocaleString()} Booms</span>
          </div>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            Source <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </CardFooter>
      </Card>
      <SubmissionsDialog 
        open={submissionsOpen}
        onOpenChange={setSubmissionsOpen}
        submissions={post.submissions}
        postUrl={post.url}
      />
    </>
  );
}
