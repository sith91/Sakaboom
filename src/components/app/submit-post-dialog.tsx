'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { platforms } from '@/lib/data.tsx';
import type { Post } from '@/lib/types';
import { suggestRelevantTagsAction, identifyPlatformAction, getUrlMetadataAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link, Tags, MessageSquare, Image, Rocket, Wand2 } from 'lucide-react';
import NextImage from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface SubmitPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostSubmit: (post: Omit<Post, 'id' | 'boomers'>) => void;
}

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export default function SubmitPostDialog({ open, onOpenChange, onPostSubmit }: SubmitPostDialogProps) {
  const [url, setUrl] = useState('');
  const [comment, setComment] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [tags, setTags] = useState<Set<string>>(new Set());
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const { toast } = useToast();
  const [user, setUser] = useState<any>(true); // Placeholder for user state, assume logged in

  const resetState = () => {
    setUrl('');
    setComment('');
    setDetectedPlatform(null);
    setTags(new Set());
    setTagInput('');
    setIsLoading(false);
    setIsSubmitting(false);
    setPreviewData(null);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    detectPlatformDebounced(newUrl);
  };

  const detectPlatform = async (url: string) => {
    if (!url.trim() || !url.startsWith('http')) {
      setDetectedPlatform(null);
      setPreviewData(null);
      return;
    }
    
    setIsLoading(true);
    setPreviewData(null);
    setDetectedPlatform('Detecting...');
    
    try {
      // Parallelize platform detection and metadata fetching
      const [platformResult, metadataResult] = await Promise.all([
        identifyPlatformAction({ url }),
        getUrlMetadataAction({ url })
      ]);

      const { platform: platformId } = platformResult;

      if (platformId && platforms[platformId]) {
        setDetectedPlatform(platformId);
        
        const { title, description, image } = metadataResult;
        
        const platformName = platforms[platformId]?.name || 'the website';
        const finalDescription = description || title || `An interesting link from ${platformName}.`;
        
        const defaultImg = PlaceHolderImages.find(i => i.id === '12');

        setPreviewData({
          platform: platforms[platformId],
          url: url,
          image: image || defaultImg?.imageUrl,
          imageHint: 'website preview',
          title: title || `Link from ${platformName}`,
          description: finalDescription
        });
        
        if (!comment) {
            setComment(finalDescription);
        }

      } else {
        setDetectedPlatform('error');
        toast({
            variant: "destructive",
            title: "Unsupported Link",
            description: "We couldn't analyze the URL. The link may be private, incorrect, or from an unsupported site.",
        });
        setPreviewData(null);
      }
    } catch (error: any) {
        console.error(error);
        setDetectedPlatform('error');
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Could not analyze the URL. The link may be private, incorrect, or from an unsupported site.",
        });
        setPreviewData(null);
    } finally {
        setIsLoading(false);
    }
  };

  const detectPlatformDebounced = useCallback(debounce(detectPlatform, 700), [comment]);

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags(new Set(tags).add(tagInput.trim()));
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.size > 0) {
      const lastTag = Array.from(tags).pop();
      if (lastTag) {
        const newTags = new Set(tags);
        newTags.delete(lastTag);
        setTags(newTags);
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => {
      const newTags = new Set(prev);
      newTags.delete(tagToRemove);
      return newTags;
    });
  };

  const handleGenerateTags = async () => {
    if (!detectedPlatform || !comment) {
      toast({
        variant: "destructive",
        title: "Cannot suggest tags",
        description: "A platform and some text are needed to suggest tags.",
      });
      return;
    }
    setIsSuggestingTags(true);
    try {
      const result = await suggestRelevantTagsAction({
        platform: detectedPlatform,
        text: comment,
      });
      if (result.tags) {
        setTags(prev => new Set([...Array.from(prev), ...result.tags]));
        toast({ title: "AI tags added!" });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not suggest tags at this time.",
      });
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const handleSubmit = () => {
    if (!detectedPlatform || !previewData) {
      toast({ variant: 'destructive', title: 'Cannot submit', description: 'A valid link must be detected and previewed.' });
      return;
    }
    if (tags.size === 0) {
      toast({ variant: 'destructive', title: 'Cannot submit', description: 'Please add at least one tag.' });
      return;
    }
    
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Required', description: 'You must be logged in to submit a post.' });
        return;
    }

    setIsSubmitting(true);
    
    const newPost: Omit<Post, 'id' | 'boomers'> = {
      media: previewData.image,
      mediaHint: previewData.imageHint,
      platform: detectedPlatform as any,
      text: comment,
      caption: comment,
      booms: 1,
      comments: 0,
      submitter: 'Anonymous',
      isVerified: false,
      tags: Array.from(tags),
      url: url,
      isNew: true,
      isBoomed: true,
      hasVideo: false,
      shares: 0,
      timestamp: new Date(),
    };

    setTimeout(() => {
      onPostSubmit(newPost);
      toast({ title: 'Post submitted!', description: 'Your post is now live on Trendify.' });
      setIsSubmitting(false);
      handleOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Rocket className="w-5 h-5" /> Share a Link</DialogTitle>
          <DialogDescription>Help power the search. Paste a link from any website to share it with the community.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="post-url" className="font-medium flex items-center gap-2"><Link className="w-4 h-4"/> Web/Social/Location Link</label>
            <Input id="post-url" value={url} onChange={handleUrlChange} placeholder="e.g., https://www.theverge.com/..." />
          </div>

          <div className="p-3 bg-secondary/50 rounded-lg flex items-center gap-3 text-sm">
            <strong>Detected Platform:</strong>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : detectedPlatform && platforms[detectedPlatform] ? (
              <div className="flex items-center gap-2 font-semibold" style={{ color: platforms[detectedPlatform].color }}>
                {platforms[detectedPlatform].icon}
                <span>{platforms[detectedPlatform].name}</span>
              </div>
            ) : detectedPlatform === 'error' ? (
                <span className='font-semibold text-destructive'>Unsupported</span>
            ) : (
              <span>None</span>
            )}
          </div>
          
          <div className="grid gap-2">
            <label className="font-medium flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Description</label>
            <Textarea 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              placeholder="Add a description, or we'll generate one from the link." 
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <label className="font-medium flex items-center gap-2"><Tags className="w-4 h-4"/> Flairs (Tags)</label>
              <Button size="sm" variant="ghost" onClick={handleGenerateTags} disabled={isSuggestingTags || !detectedPlatform}>
                {isSuggestingTags ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Wand2 className="h-4 w-4 mr-2"/>}
                Suggest with AI
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[40px]">
              {Array.from(tags).map(tag => (
                <Badge key={tag} variant="default">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-1 rounded-full hover:bg-primary-foreground/20 p-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                  </button>
                </Badge>
              ))}
              <Input
                className="flex-1 border-none shadow-none focus-visible:ring-0 h-auto p-0 m-1 bg-transparent"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add tags..."
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mt-2 p-4 bg-secondary/50 rounded-lg min-h-[100px] flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : previewData ? (
                <div className="flex gap-4 w-full">
                    <div className="w-24 h-24 relative shrink-0 bg-background rounded-md">
                        {previewData.image ? (
                            <NextImage src={previewData.image} alt="Preview" fill className="rounded-md object-cover" data-ai-hint={previewData.imageHint}/>
                        ) : (
                             <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Image className="w-8 h-8" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                        <h4 className="font-bold truncate">{previewData.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">{previewData.description}</p>
                    </div>
                </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Image className="w-8 h-8 mx-auto mb-2" />
                <p>Preview will appear here</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading || !previewData || tags.size === 0 || !user}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
            Boom it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
