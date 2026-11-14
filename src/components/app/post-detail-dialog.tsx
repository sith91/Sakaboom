'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ExternalLink, MessageSquare, User, Calendar, MapPin, FileText, Sparkles, TrendingUp, Zap, Send, CheckCircle2, Share2 } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Tiktok, Instagram, Facebook, Twitter, Youtube, Reddit, Threads } from '@/components/icons';
import { Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlatformId } from '@/lib/types';

interface PostDetailDialogProps {
  post: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTagClick: (tag: string) => void;
  onAddPerspective?: (postId: any, text: string) => void;
}

export default function PostDetailDialog({ post, open, onOpenChange, onTagClick, onAddPerspective }: PostDetailDialogProps) {
  const [imageError, setImageError] = useState(false);
  const [newPerspective, setNewPerspective] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      setImageError(false);
      setNewPerspective('');
    }
  }, [open]);

  const handleTagClick = (tag: string) => {
    onOpenChange(false);
    setTimeout(() => {
      onTagClick(tag);
    }, 150);
  };

  const handlePerspectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerspective.trim()) return;
    setIsSubmitting(true);

    if (onAddPerspective && post) {
      onAddPerspective(post, newPerspective.trim());
    } else if (post) {
      // Local optimistic append
      if (!post.submissions) post.submissions = [];
      post.submissions.push({
        submitter: 'You (Curator)',
        description: newPerspective.trim(),
        timestamp: new Date().toISOString(),
        reputation: 150
      });
    }

    toast({
      title: 'Perspective Added!',
      description: 'Your insight is now part of this universal topic node.'
    });

    setNewPerspective('');
    setIsSubmitting(false);
  };

  const isLocation = post?.type === 'location' || post?.platform === 'location';
  const isEvent = post?.type === 'event';
  const isText = post?.type === 'text';

  const renderPlatformIcon = (platform: PlatformId | string, className = "w-4 h-4") => {
    switch (platform) {
      case 'tiktok': return <Tiktok className={className} />;
      case 'instagram': return <Instagram className={className} />;
      case 'twitter': return <Twitter className={className} />;
      case 'youtube': return <Youtube className={className} />;
      case 'reddit': return <Reddit className={className} />;
      case 'threads': return <Threads className={className} />;
      case 'facebook': return <Facebook className={className} />;
      case 'location': return <MapPin className={className} />;
      case 'event': return <Calendar className={className} />;
      case 'text': return <FileText className={className} />;
      default: return <Globe className={className} />;
    }
  };

  const platformColor = isLocation 
    ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
    : isEvent 
      ? 'text-purple-600 bg-purple-50 border-purple-200' 
      : isText 
        ? 'text-indigo-600 bg-indigo-50 border-indigo-200' 
        : post?.platform === 'tiktok' 
          ? 'text-slate-900 bg-slate-100 border-slate-300' 
          : post?.platform === 'twitter'
            ? 'text-sky-600 bg-sky-50 border-sky-200'
            : post?.platform === 'youtube'
              ? 'text-red-600 bg-red-50 border-red-200'
              : post?.platform === 'reddit'
                ? 'text-orange-600 bg-orange-50 border-orange-200'
                : post?.platform === 'instagram' 
                  ? 'text-pink-600 bg-pink-50 border-pink-200' 
                  : 'text-slate-700 bg-slate-100 border-slate-200';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {post && (
        <DialogContent className="sm:max-w-xl p-0 bg-white text-slate-900 border-slate-200 overflow-hidden rounded-3xl shadow-2xl">
          <ScrollArea className="max-h-[88vh]">
            {/* Media Banner / Video Player */}
            <div className="relative w-full h-56 bg-slate-950 overflow-hidden">
              {post.video ? (
                <video
                  src={post.video}
                  poster={post.image || post.media}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : imageError || (!post.image && !post.media) ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900">
                  {renderPlatformIcon(post.platform, "w-12 h-12 opacity-50 text-white")}
                  <span className="text-xs mt-2 text-slate-400 font-medium">Original Social Story</span>
                </div>
              ) : (
                <Image
                  src={post.image || post.media}
                  alt={post.content || post.caption || post.text}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              )}

              {/* Floating Cross-Platform indicator */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 backdrop-blur-md bg-black/60 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                {renderPlatformIcon(post.platform, "w-3.5 h-3.5 text-primary")}
                <span>{post.platform.toUpperCase()}</span>
                {post.crossPlatforms && post.crossPlatforms.length > 0 && (
                  <span className="text-slate-300 font-normal">
                    + {post.crossPlatforms.length} networks
                  </span>
                )}
              </div>

              {post.viralScore && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 backdrop-blur-md bg-amber-500/90 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{post.viralScore} VIRAL INDEX</span>
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className={cn("flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full border", platformColor)}>
                    {renderPlatformIcon(post.platform, "w-3.5 h-3.5")}
                    <span>{isLocation ? 'Location Spot' : isEvent ? 'Event Listing' : isText ? 'General Update' : post.platform}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-black text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                    <Share2 className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Shared {post.submissions?.length || 1}x on Sakaboom</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {post.sentiment && (
                    <span className={cn(
                      "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                      post.sentiment === 'bullish' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      post.sentiment === 'viral' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      post.sentiment === 'debated' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-slate-50 text-slate-700 border-slate-200'
                    )}>
                      ● {post.sentiment} sentiment
                    </span>
                  )}
                  {post.verificationScore && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {post.verificationScore}% Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Main Content Title */}
              <DialogHeader className="text-left">
                <DialogTitle className="text-lg sm:text-xl font-black leading-snug text-slate-900">
                  {post.content || post.caption || post.text}
                </DialogTitle>
                {post.authorHandle && (
                  <div className="text-xs text-slate-500 font-bold mt-1 inline-flex items-center gap-1">
                    <span>Origin: {post.authorHandle}</span>
                  </div>
                )}
              </DialogHeader>

              {/* AI "Why It's Trending" Intelligence Card */}
              {post.trendingReason && (
                <div className="bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-50 p-4 rounded-2xl border border-indigo-100/80 shadow-sm space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                    <span>Why This Is Trending Across Socials</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    {post.trendingReason}
                  </p>

                  {/* Takeaways list */}
                  {post.takeaways && post.takeaways.length > 0 && (
                    <div className="pt-2 border-t border-indigo-100/60 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Key Takeaways & Consensus</div>
                      <ul className="space-y-1">
                        {post.takeaways.map((takeaway: string, idx: number) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                            <span className="text-indigo-500 font-bold shrink-0">•</span>
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cross-Platform Ecosystem Badges */}
                  {post.crossPlatforms && post.crossPlatforms.length > 0 && (
                    <div className="pt-2 border-t border-indigo-100/60 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active on:</span>
                      {post.crossPlatforms.map((plat: PlatformId) => (
                        <span key={plat} className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                          {renderPlatformIcon(plat, "w-3 h-3")}
                          <span className="capitalize">{plat}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Specific metadata card for Event and Location */}
              {isLocation && post.address && (
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-800">Address / Coordinates</h5>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">{post.address}</p>
                  </div>
                </div>
              )}

              {isEvent && (
                <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 space-y-3">
                  {post.eventDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-xs uppercase tracking-wider text-purple-800">Date & Schedule</h5>
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">{post.eventDate}</p>
                      </div>
                    </div>
                  )}
                  {post.venue && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-xs uppercase tracking-wider text-purple-800">Venue</h5>
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">{post.venue}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag: string) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="text-[11px] font-bold text-blue-600 bg-blue-50/60 hover:bg-blue-100 border border-blue-100 px-2.5 py-0.5 rounded-lg transition-all"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Multi-Perspective & Link Shares Community Hub */}
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <div className="flex justify-between items-center bg-slate-100/80 p-3 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span>🔗 Link Shares & Perspectives ({post.submissions?.length || 1})</span>
                  </h4>
                  <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                    Canonical Story Node
                  </span>
                </div>
                
                {/* Submit new perspective input */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <form onSubmit={handlePerspectiveSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Verified this with local benchmarks / Visited this spot last week..."
                      value={newPerspective}
                      onChange={(e) => setNewPerspective(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none font-medium transition-all"
                    />
                    <Button 
                      type="submit" 
                      size="sm" 
                      disabled={!newPerspective.trim() || isSubmitting}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 text-xs font-bold shrink-0 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" /> Share Take
                    </Button>
                  </form>
                </div>

                {/* Perspective List */}
                <div className="space-y-3 pt-1">
                  {post.submissions && post.submissions.length > 0 ? (
                    post.submissions.map((sub: any, index: number) => (
                      <div key={index} className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 text-left shadow-xs hover:border-indigo-300 transition-all">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs uppercase">
                              {sub.submitter.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                <span>@{sub.submitter}</span>
                                {sub.reputation && (
                                  <span className="text-[10px] bg-amber-50 text-amber-800 font-extrabold px-1.5 py-0.2 rounded border border-amber-200">
                                    ★ {sub.reputation}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {new Date(sub.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pl-9">
                          "{sub.description}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-left shadow-xs">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                            {(post.submitter || 'C').charAt(0).toUpperCase()}
                          </div>
                          <span>@{post.submitter || 'OriginCurator'}</span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pl-9">
                        "{post.content || post.caption || post.text}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Link Out */}
              {post.url && !post.url.startsWith('#') && (
                <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-2xl shadow-lg transition-transform active:scale-[0.99]">
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Source Post on {post.platform.toUpperCase()}
                  </a>
                </Button>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      )}
    </Dialog>
  );
}
