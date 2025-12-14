'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Tag } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface AdvancedFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (tags: string[]) => void;
  initialTags?: string[];
  allTags: string[];
}

const MAX_TAGS = 10;

export default function AdvancedFilterDialog({ 
    open, 
    onOpenChange, 
    onApplyFilter,
    initialTags = [],
    allTags = []
}: AdvancedFilterDialogProps) {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialTags);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags, open]);

  const filteredSuggestions = useMemo(() => {
    if (!tagInput) return [];
    const lowercasedInput = tagInput.toLowerCase();
    return allTags.filter(
      (tag) =>
        tag.toLowerCase().includes(lowercasedInput) &&
        !tags.find(t => t.toLowerCase() === tag.toLowerCase())
    ).slice(0, 5);
  }, [tagInput, allTags, tags]);

  const addTag = (newTag: string) => {
    if (tags.length >= MAX_TAGS) {
      toast({
        variant: 'destructive',
        title: 'Tag limit reached',
        description: `You can add a maximum of ${MAX_TAGS} tags.`,
      });
      return;
    }
    if (newTag && !tags.find(t => t.toLowerCase() === newTag.toLowerCase())) {
      setTags([...tags, newTag]);
    }
    setTagInput('');
    setSuggestionsOpen(false);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
    if (e.target.value.trim().length > 0) {
      setSuggestionsOpen(true);
    } else {
      setSuggestionsOpen(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleClear = () => {
    setTags([]);
    onApplyFilter([]);
  }
  
  const handleSubmit = () => {
    onApplyFilter(tags);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Filter className="w-5 h-5"/> Advanced Tag Filter</DialogTitle>
          <DialogDescription>
            Find posts that include ALL of the tags you specify. You can add up to {MAX_TAGS} tags.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
                <label htmlFor="tag-input" className="font-medium flex items-center gap-2"><Tag className="w-4 h-4"/> Tags</label>
                <span className="text-sm text-muted-foreground">{tags.length} / {MAX_TAGS}</span>
            </div>
            <Popover open={suggestionsOpen && filteredSuggestions.length > 0} onOpenChange={setSuggestionsOpen}>
              <PopoverTrigger asChild>
                <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[40px] items-center">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1 rounded-full hover:bg-background/50 p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  <Input
                    id="tag-input"
                    className="flex-1 border-none shadow-none focus-visible:ring-0 h-auto p-0 m-1 bg-transparent"
                    value={tagInput}
                    onChange={handleInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder={tags.length === 0 ? "Type tags here..." : "Add more tags..."}
                    autoComplete="off"
                    disabled={tags.length >= MAX_TAGS}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[--radix-popover-trigger-width] p-0" 
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()} // Prevent focus stealing
              >
                <ScrollArea className="max-h-40">
                  <ul className="space-y-1 p-1">
                    {filteredSuggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        className="p-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        onMouseDown={(e) => { // use onMouseDown to avoid input blur
                          e.preventDefault();
                          addTag(suggestion);
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
            <Button onClick={handleClear} variant="ghost">Clear Filter</Button>
            <Button onClick={handleSubmit}>Apply Filter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
