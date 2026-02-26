'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Submission } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';

interface SubmissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissions: Submission[];
  postUrl: string;
}

function getTimeAgo(timestamp: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)}y ago`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)}mo ago`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}d ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}h ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}m ago`;
  return 'Just now';
}

export default function SubmissionsDialog({ open, onOpenChange, submissions, postUrl }: SubmissionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Boomer Descriptions</DialogTitle>
          <DialogDescription>
            Different perspectives on the same link, shared by the community.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
                {submissions.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).map((submission, index) => (
                    <Card key={index}>
                        <CardContent className="p-4 flex gap-4">
                             <Avatar>
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${submission.submitter}`} alt={submission.submitter}/>
                                <AvatarFallback>{submission.submitter.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold">{submission.submitter}</p>
                                    <p className="text-xs text-muted-foreground">{getTimeAgo(submission.timestamp)}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{submission.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
