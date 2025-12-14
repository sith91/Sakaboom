'use client';

import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { X, Filter, Tag } from 'lucide-react';

interface AdvancedFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (tags: string[]) => void;
  initialTags?: string[];
}

export default function AdvancedFilterDialog({ 
    open, 
    onOpenChange, 
    onApplyFilter,
    initialTags = []
}: AdvancedFilterDialogProps) {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialTags);

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags, open]);


  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.find(t => t.toLowerCase() === newTag.toLowerCase())) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
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
            Find posts that include ALL of the tags you specify. Separate tags with a comma or press Enter.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <label htmlFor="tag-input" className="font-medium flex items-center gap-2"><Tag className="w-4 h-4"/> Tags</label>
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
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder={tags.length === 0 ? "Type tags here..." : "Add more tags..."}
                    />
                </div>
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
