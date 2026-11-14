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
  MapPin,
  Calendar,
  FileText,
} from 'lucide-react';
import React, { useState } from 'react';

interface PostCardProps {
  post: Post;
  index?: number;
  onTagClick?: (tag: string) => void;
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

export default function PostCard({ post, index, onTagClick, onPostClick, onBoomersClick }: PostCardProps) {
  const platformInfo = platforms[post.platform];
  const [imageError, setImageError] = useState(false);

  // Compute Bento Grid dynamics
  let bentoClass = '';
  let imageHeight = 'h-40';
  
  if (index !== undefined) {
    if (index % 5 === 0) {
      bentoClass = 'bento-large';
      imageHeight = 'h-64 sm:h-80'; // Taller image for large square blocks
    } else if (index !== 0 && index % 7 === 0) {
      bentoClass = 'bento-wide';
      imageHeight = 'h-52 sm:h-64'; // Slightly taller for wide horizontal blocks
    } else {
      imageHeight = index % 2 === 0 ? 'h-40' : 'h-48'; // Slight vertical rhythm variation for standard cards
    }
  }

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
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <div className={cn("relative group cursor-pointer w-full transition-all duration-500 hover:-translate-y-1.5 hover:z-10", bentoClass)} onClick={handleCardClick}>
      
      <Card
        className={cn(
          'relative h-full overflow-hidden flex flex-col w-full bg-black/40 backdrop-blur-2xl border border-white/10 transition-all duration-500 group-hover:bg-black/60 shadow-lg group-hover:shadow-[0_10px_40px_-10px_rgba(109,40,217,0.5)] group-hover:border-primary/30',
          post.isNew ? 'ring-1 ring-primary/50 shadow-[0_0_20px_-5px_rgba(109,40,217,0.4)]' : ''
        )}
      >
        <div className={cn("relative w-full shrink-0 overflow-hidden", imageHeight)}>
          {/* Dark gradient overlay for a cinematic look */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
          
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-900/80" style={{color: platformInfo?.color}}>
              {React.cloneElement(platformInfo?.icon as React.ReactElement, { className: 'w-12 h-12 opacity-30 drop-shadow-lg' })}
            </div>
          ) : (
            <Image
              src={post.media}
              alt={post.text}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint={post.mediaHint}
              onError={() => setImageError(true)}
            />
          )}

          {/* Top-right floating indicator */}
          <div className="absolute top-3 right-3 z-20 flex gap-1">
             <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1.5 shadow-xl">
                {post.isAiDiscovered ? <Zap className="w-3 h-3 text-boom fill-boom" /> : <Users className="w-3 h-3 text-primary" />}
                {post.isAiDiscovered ? "AI Indexed" : "Curated"}
             </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 p-4 relative z-20 -mt-8">
          <div className="flex justify-between items-center mb-2">
            {(() => {
              const isLocation = post.type === 'location' || post.platform === 'location';
              const isEvent = post.type === 'event';
              const isText = post.type === 'text';
              
              const platformName = isLocation 
                ? 'Location Spot' 
                : isEvent 
                  ? 'Community Event' 
                  : isText 
                    ? 'General Update' 
                    : platformInfo?.name || 'Website';
              
              const color = isLocation 
                ? '#10b981' 
                : isEvent 
                  ? '#a855f7' 
                  : isText 
                    ? '#6366f1' 
                    : platformInfo?.color || '#fff';
              
              const iconEl = isLocation 
                ? <MapPin className="w-3.5 h-3.5" /> 
                : isEvent 
                  ? <Calendar className="w-3.5 h-3.5" /> 
                  : isText 
                    ? <FileText className="w-3.5 h-3.5" /> 
                    : platformInfo?.icon ? React.cloneElement(platformInfo?.icon as React.ReactElement, { className: 'w-3.5 h-3.5' }) : null;

              return (
                <div className="flex items-center gap-1.5 text-xs font-bold px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/5 shadow-md" style={{ color }}>
                  {iconEl}
                  <span className="drop-shadow-md">{platformName}</span>
                </div>
              );
            })()}
          </div>

          <h3 className="font-extrabold text-base leading-tight mb-2 text-white/95 group-hover:text-primary transition-colors line-clamp-2 drop-shadow-sm">{post.text}</h3>

          <p className="text-sm text-white/60 line-clamp-2 mb-3 leading-relaxed font-light">{post.caption}</p>

          {post.type === 'location' && post.address && (
            <div className="flex items-center gap-1 text-xs text-white/40 mb-3">
              <MapPin className="w-3.5 h-3.5 text-green-500 shrink-0" />
              <span className="truncate">{post.address}</span>
            </div>
          )}

          {post.type === 'event' && (
            <div className="space-y-1 mb-3 bg-purple-950/30 p-2 rounded-lg border border-purple-900/20">
              {post.eventDate && (
                <div className="flex items-center gap-1 text-[11px] text-white/60">
                  <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{post.eventDate}</span>
                </div>
              )}
              {post.venue && (
                <div className="flex items-center gap-1 text-[11px] text-white/60">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{post.venue}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <div
                key={tag}
                className={cn("category-badge opacity-90 hover:opacity-100", getTagColorClass(index))}
                data-tag-badge
                onClick={(e) => handleTagBadgeClick(e, tag)}
              >
                <span>#{tag}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/10">
            <div className="flex items-center gap-4 text-white/50 text-xs">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onBoomersClick?.(post);
                  }}
                  disabled={!onBoomersClick}
                  className={cn(
                    "flex items-center gap-1.5 font-bold transition-all",
                    onBoomersClick ? "hover:text-primary hover:scale-105 cursor-pointer" : "cursor-default"
                  )}
                >
                  <Users className="w-4 h-4" />{post.boomers.toLocaleString()}
                </button>
                <span 
                  className={cn(
                      "flex items-center gap-1.5 font-black transition-all",
                      post.isBoomed ? 'text-boom drop-shadow-[0_0_8px_rgba(255,107,53,0.8)]' : 'group-hover:text-white/80'
                  )}
                >
                  <Zap className={cn("w-4 h-4", post.isBoomed ? "fill-boom" : "fill-current")} />
                  <span className="text-sm">{post.booms.toLocaleString()}</span>
                </span>
            </div>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-white/40 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Source <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
