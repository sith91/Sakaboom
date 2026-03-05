'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Post } from '@/lib/types';
import Image from 'next/image';
import { platforms } from '@/lib/data';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface PostDetailDialogProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTagClick: (tag: string) => void;
}

const tagColorClasses = [
  'border-sky-500 text-sky-400 hover:bg-sky-950 bg-sky-950/50',
  'border-emerald-500 text-emerald-400 hover:bg-emerald-950 bg-emerald-950/50',
  'border-amber-500 text-amber-400 hover:bg-amber-950 bg-amber-950/50',
  'border-violet-500 text-violet-400 hover:bg-violet-950 bg-violet-950/50',
  'border-pink-500 text-pink-400 hover:bg-pink-950 bg-pink-950/50',
  'border-indigo-500 text-indigo-400 hover:bg-indigo-950 bg-indigo-950/50',
];

const getTagColor = (index: number) => {
    return tagColorClasses[index % tagColorClasses.length];
}

export default function PostDetailDialog({ post, open, onOpenChange, onTagClick }: PostDetailDialogProps) {
  if (!post) return null;

  const platformInfo = platforms[post.platform];
  const [imageError, setImageError] = React.useState(false);

  // When dialog opens, reset image error state
  React.useEffect(() => {
    if (open) {
      setImageError(false);
    }
  }, [open]);

  const handleTagClick = (tag: string) => {
    onOpenChange(false);
    // Use a timeout to allow the dialog to close before the navigation/filter happens
    setTimeout(() => {
        onTagClick(tag);
    }, 150);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative w-full h-48">
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center bg-secondary rounded-t-lg" style={{color: platformInfo?.color}}>
                {React.cloneElement(platformInfo?.icon as React.ReactElement, { className: 'w-12 h-12 opacity-50' })}
              </div>
            ) : (
              <Image
                src={post.media}
                alt={post.text}
                fill
                className="object-cover rounded-t-lg"
                data-ai-hint={post.mediaHint}
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: platformInfo?.color }}>
              {React.cloneElement(platformInfo?.icon as React.ReactElement, { className: 'w-4 h-4' })}
              <span>{platformInfo?.name}</span>
            </div>
            
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl leading-tight">{post.text}</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-foreground/90">{post.caption}</p>

            <div>
              <h4 className="text-sm font-semibold mb-2">Flairs</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={cn("cursor-pointer font-normal", getTagColor(index))}
                    onClick={() => handleTagClick(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Button asChild className="w-full">
              <a href={post.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Original Post
              </a>
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
