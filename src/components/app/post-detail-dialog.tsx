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
