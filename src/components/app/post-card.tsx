
'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { platforms } from '@/lib/data.tsx';
import type { Post } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Share2,
  CheckCircle,
  User,
  ExternalLink,
  PlayCircle,
  Users,
  ImageIcon,
  Zap,
} from 'lucide-react';
import { Star } from 'lucide-react';
import React, { useState } from 'react';

interface PostCardProps {
  post: Post;
  onTagClick: (tag: string) => void;
  onBoom: () => void;
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
    onBoom();
    window.open(post.url, '_blank', 'noopener,noreferrer');
  };

  const handleTagBadgeClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    onTagClick(tag);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        'overflow-hidden shadow-none border-b rounded-none flex flex-col cursor-pointer transition-colors hover:bg-secondary/50',
        post.isNew && 'glow-pulse'
      )}
    >
      <CardHeader className="p-4 relative flex-row gap-4">
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
      
      <CardContent className="px-4 pb-2 pt-0">
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
      
      <CardFooter className="flex-col items-start p-4 pt-2">
         <div className="flex justify-between items-center w-full mb-3">
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <span className="flex items-center gap-1 font-semibold"><Users className="w-4 h-4" />{post.boomers.toLocaleString()} Boomers</span>
                <span className="flex items-center gap-1 font-semibold"><Zap className="w-4 h-4" />{post.booms.toLocaleString()} Booms</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" />{post.comments}</span>
                <span className="flex items-center gap-1"><Share2 className="w-4 h-4" />{post.shares}</span>
            </div>
        </div>
        <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-1 font-semibold">
            {post.isVerified ? (
              <CheckCircle className="w-3.5 h-3.5 text-primary" />
            ) : (
              <User className="w-3.5 h-3.5" />
            )}
            @{post.submitter}
          </div>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            Source <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
