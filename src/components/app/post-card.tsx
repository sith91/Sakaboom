'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { platforms } from '@/lib/data.tsx';
import type { Post } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  ExternalLink,
  Users,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

interface PostCardProps {
  post: Post;
  onTagClick: (tag: string) => void;
  onPostClick?: (post: Post) => void;
  onBoomersClick?: (post: Post) => void;
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
  'violet',
  'pink',
  'blue',
  'green',
  'amber',
  'indigo',
];

const getTagColorClass = (index: number) => {
    return tagColorClasses[index % tagColorClasses.length];
}

export default function PostCard({ post, onTagClick, onPostClick, onBoomersClick }: PostCardProps) {
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
    if (onPostClick) {
        onPostClick(post);
    } else {
        window.open(post.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTagBadgeClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    onTagClick(tag);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        'group overflow-hidden shadow-sm border flex flex-col w-full cursor-pointer transition-colors hover:bg-secondary/50',
        post.isNew && 'glow-pulse'
      )}
    >
      <div className="relative w-full h-32 shrink-0">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-secondary" style={{color: platformInfo?.color}}>
            {React.cloneElement(platformInfo?.icon as React.ReactElement, { className: 'w-10 h-10 opacity-50' })}
          </div>
        ) : (
          <Image
            src={post.media}
            alt={post.text}
            fill
            className="object-cover"
            data-ai-hint={post.mediaHint}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="flex flex-col flex-1 p-2.5">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: platformInfo?.color }}>
            {React.cloneElement(platformInfo?.icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
            <span>{platformInfo?.name}</span>
          </div>
          <time className="text-xs text-muted-foreground">{getTimeAgo(post.timestamp)}</time>
        </div>

        <h3 className="font-bold text-sm leading-tight mb-1.5 group-hover:underline">{post.text}</h3>

        <p className="text-xs text-foreground/80 line-clamp-2 mb-1.5">{post.caption}</p>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          {post.tags.slice(0, 3).map((tag, index) => (
            <div
              key={tag}
              className={cn("category-badge", getTagColorClass(index))}
              data-tag-badge
              onClick={(e) => handleTagBadgeClick(e, tag)}
            >
              <span>#{tag}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-auto pt-1.5 border-t border-dashed">
          <div className="flex items-center gap-3 text-muted-foreground text-xs">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onBoomersClick?.(post);
                }}
                disabled={!onBoomersClick}
                className={cn(
                  "flex items-center gap-1 font-semibold",
                  onBoomersClick ? "hover:text-primary cursor-pointer" : "cursor-default"
                )}
              >
                <Users className="w-3.5 h-3.5" />{post.boomers.toLocaleString()}
              </button>
              <span 
                className={cn(
                    "flex items-center gap-1 font-semibold transition-colors",
                    post.isBoomed ? 'text-boom' : 'text-muted-foreground'
                )}
              >
                <Zap className="w-3.5 h-3.5" />{post.booms.toLocaleString()}
              </span>
          </div>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            Source <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </Card>
  );
}
