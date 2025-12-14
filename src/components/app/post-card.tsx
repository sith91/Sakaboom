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
} from 'lucide-react';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface PostCardProps {
  post: Post;
  onBoom: (id: number, isButtonBoom?: boolean) => void;
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

export default function PostCard({ post, onBoom }: PostCardProps) {
  const platformInfo = platforms[post.platform];

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click target is a button, a link, a badge, or inside one
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('a') || 
      target.closest('[data-tag-badge]') ||
      target.closest('[data-boom-button-area]')
    ) {
      return;
    }
    onBoom(post.id, false); // This is a "view" boom, not from the button
    window.open(post.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        'overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1 flex flex-col cursor-pointer',
        post.isNew && 'glow-pulse',
        post.platform === 'instagram' && 'instagram-post-border'
      )}
    >
      <CardHeader className="p-0 relative">
        {post.isCelebrity && (
          <Badge className="absolute top-2 left-2 z-10 bg-yellow-400 text-black hover:bg-yellow-400">
            <Star className="w-3 h-3 mr-1" /> Celebrity
          </Badge>
        )}
        {post.hasVideo && (
          <Badge variant="secondary" className="absolute top-2 right-2 z-10">
            <PlayCircle className="w-3 h-3 mr-1" /> Video
          </Badge>
        )}
        <div className="aspect-video relative w-full">
            <Image
                src={post.media}
                alt={post.text}
                fill
                className="object-cover"
                data-ai-hint={post.mediaHint}
            />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: platformInfo?.color }}>
            {platformInfo?.icon}
            <span>{platformInfo?.name}</span>
          </div>
          <time className="text-xs text-muted-foreground">{getTimeAgo(post.timestamp)}</time>
        </div>
        <p className="mb-3 text-sm text-foreground/80 line-clamp-3">{post.caption}</p>
        
        {post.followerCount && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{post.followerCount}</span>
            {post.postCount && <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" />{post.postCount}</span>}
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant={"secondary"}
              className="cursor-pointer"
              data-tag-badge // Prevent card click
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start p-4 pt-0">
         <div className="flex justify-between items-center w-full mb-4" data-boom-button-area>
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant={post.isBoomed ? 'default' : 'outline'}
                    onClick={(e) => {
                        e.stopPropagation();
                        onBoom(post.id, true);
                    }}
                    className={cn("gap-1", post.isBoomed && "bg-boom text-white border-boom hover:bg-boom/90")}
                >
                    <span className={cn("transition-transform", post.isBoomed && "animate-ping absolute inline-flex h-full w-full rounded-full bg-boom opacity-75")}></span>
                     <span className="relative">💥</span>
                    Boom
                </Button>
                <span className="font-bold text-sm">{post.booms.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" />{post.comments}</span>
                <span className="flex items-center gap-1"><Share2 className="w-4 h-4" />{post.shares}</span>
            </div>
        </div>
        <div className="flex justify-between items-center w-full text-xs text-muted-foreground border-t pt-3">
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
