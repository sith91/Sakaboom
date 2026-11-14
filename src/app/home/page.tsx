'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import {
  Search,
  Plus,
  Globe,
  Bookmark,
  Folder,
  Check,
  MessageSquare,
  MapPin,
  Calendar,
  FileText,
  Sparkles,
  TrendingUp,
  Zap,
  Flame,
  Radio,
  ArrowRight,
  Layers,
  Share2,
  Bot,
  Megaphone,
  LayoutGrid,
  Rows3,
  Trophy,
  Activity,
  Play,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { businesses as initialBusinesses, SocialPost } from '@/lib/business-data';
import { Tiktok, Instagram, Facebook, Twitter, Youtube, Reddit, Threads } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AddContentDialog from '@/components/app/add-content-dialog';
import PostDetailDialog from '@/components/app/post-detail-dialog';
import {
  AdSenseCard,
  AdSenseConfig,
  DEFAULT_ADSENSE_CONFIG,
  fetchBackendAdConfig,
} from '@/components/app/adsense-card';
import { PlatformId } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Playlist {
  id: number;
  name: string;
  posts: SocialPost[];
}

// Flat list of initial feed posts
const initialFeedPosts: SocialPost[] = initialBusinesses.flatMap((biz) => biz.socialPosts);

// Breaking social ticker data
const OMNI_TICKER_ITEMS = [
  { network: 'twitter' as PlatformId, text: 'New reasoning AI benchmark solves IMO Math Olympiad with 99% proof verification', tag: 'ai' },
  { network: 'instagram' as PlatformId, text: 'Aesthetic street photography capturing golden hour across Shibuya crossing', tag: 'photography' },
  { network: 'tiktok' as PlatformId, text: 'Kyoto master baristas 3-pour V60 technique passes 12M views worldwide', tag: 'coffee' },
  { network: 'youtube' as PlatformId, text: 'Next-gen optical silicon architecture reaches 10x GPU efficiency benchmark', tag: 'hardware' },
  { network: 'reddit' as PlatformId, text: 'r/LocalLLaMA distillation breakthrough: 3B open weights beating 70B models', tag: 'localllama' },
  { network: 'openart' as PlatformId, text: 'Procedural neural glass city featured in Digital Art Tokyo 2026', tag: 'ai-art' },
  { network: 'location' as PlatformId, text: 'Hidden 120-yr Machiya cafe near Gion ranked #1 secret spot in Kyoto', tag: 'travel' },
];

export default function SocialSearchPage() {
  const [generalPosts, setGeneralPosts] = useState<SocialPost[]>(initialFeedPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilterPlatform, setCurrentFilterPlatform] = useState<string>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'link' | 'location' | 'event' | 'text'>('all');
  const [sortMode, setSortMode] = useState<'velocity' | 'viral' | 'discussed'>('velocity');
  const [feedLayout, setFeedLayout] = useState<'bento' | 'stream'>('bento');
  const [focusedStreamIdx, setFocusedStreamIdx] = useState<number>(0);

  // Gamification & Addictive Micro-Rewards State
  const [curatorXp, setCuratorXp] = useState<number>(1420);
  const [boomStreak, setBoomStreak] = useState<number>(3);
  const [boomedUrls, setBoomedUrls] = useState<Set<string>>(new Set());
  const [queuedAgentPosts, setQueuedAgentPosts] = useState<SocialPost[]>([]);

  // Modals & Configs
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(false);
  const [adSenseConfig, setAdSenseConfig] = useState<AdSenseConfig>(DEFAULT_ADSENSE_CONFIG);
  const [adRandomOffset, setAdRandomOffset] = useState<number>(1);
  const [selectedPostDetail, setSelectedPostDetail] = useState<SocialPost | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [activeTickerIdx, setActiveTickerIdx] = useState(0);

  // Playlist states
  const [activeView, setActiveView] = useState<'feed' | 'playlists'>('feed');
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: 1, name: '🌟 Frontpage Favorites', posts: initialFeedPosts.slice(0, 2) },
    { id: 2, name: '📸 Visual Stories & Culture', posts: initialFeedPosts.filter((p) => p.platform === 'instagram') },
    { id: 3, name: '🤖 Frontier AI Watch', posts: [initialFeedPosts[0], initialFeedPosts[1]] },
  ]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const { toast } = useToast();

  const handlePublishAgentPosts = (newPosts: SocialPost[]) => {
    setGeneralPosts((prev) => {
      const existingUrls = new Set(prev.map((p) => p.url));
      const uniqueNew = newPosts.filter((p) => !existingUrls.has(p.url));
      return [...uniqueNew, ...prev];
    });
  };

  useEffect(() => {
    setHydrated(true);
    setAdRandomOffset(Math.floor(Math.random() * 2) + 1);

    // Load saved Curator XP & Streak
    try {
      const savedXp = localStorage.getItem('sakaboom_curator_xp');
      if (savedXp) setCuratorXp(Number(savedXp) || 1420);
    } catch {}

    // Load multi-platform ad configuration from the backend (/api/ads)
    fetchBackendAdConfig()
      .then((cfg) => setAdSenseConfig(cfg))
      .catch(() => {});

    // Load persisted community posts + live agent posts from the backend (/api/posts)
    fetch('/api/posts', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        setAutoPilotEnabled(Boolean(data.autoPilot));
        if (Array.isArray(data.posts) && data.posts.length > 0) {
          setGeneralPosts(data.posts);
        }
        if (Array.isArray(data.publishedAgentPosts) && data.publishedAgentPosts.length > 0) {
          handlePublishAgentPosts(data.publishedAgentPosts);
        }
        if (Array.isArray(data.queuedAgentPosts) && data.queuedAgentPosts.length > 0) {
          setQueuedAgentPosts(data.queuedAgentPosts);
        }
      })
      .catch(() => {});

    const interval = setInterval(() => {
      setActiveTickerIdx((prev) => (prev + 1) % OMNI_TICKER_ITEMS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!autoPilotEnabled) return;
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/api/agent/scout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 3 }),
        });
        const data = await res.json();
        if (Array.isArray(data.posts) && data.posts.length > 0) {
          setQueuedAgentPosts((prev) => {
            const existing = new Set([
              ...prev.map((p) => p.url),
              ...generalPosts.map((p) => p.url),
            ]);
            const fresh = data.posts.filter((p: SocialPost) => !existing.has(p.url));
            return [...fresh, ...prev];
          });
        }
      } catch {
        // Ignore background poll error
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [autoPilotEnabled, generalPosts]);

  const renderPlatformIcon = (platform: PlatformId | string, className = 'w-3.5 h-3.5') => {
    switch (platform) {
      case 'tiktok':
        return <Tiktok className={className} />;
      case 'instagram':
        return <Instagram className={className} />;
      case 'twitter':
        return <Twitter className={className} />;
      case 'youtube':
        return <Youtube className={className} />;
      case 'reddit':
        return <Reddit className={className} />;
      case 'threads':
        return <Threads className={className} />;
      case 'facebook':
        return <Facebook className={className} />;
      case 'openart':
      case 'higgsfield':
      case 'ai':
        return <Sparkles className={className} />;
      case 'location':
        return <MapPin className={className} />;
      case 'event':
        return <Calendar className={className} />;
      case 'text':
        return <FileText className={className} />;
      default:
        return <Globe className={className} />;
    }
  };

  const filteredPosts = useMemo(() => {
    let filtered = [...generalPosts];

    // 1. Content Type Filter
    if (activeTypeFilter !== 'all') {
      filtered = filtered.filter((post) => {
        const postType = post.type || (post.platform === 'location' ? 'location' : 'link');
        return postType === activeTypeFilter;
      });
    }

    // 2. Platform Filter
    if (currentFilterPlatform !== 'all') {
      filtered = filtered.filter((post) => post.platform === currentFilterPlatform);
    }

    // 3. Search Relevance Engine
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();

      const scoredPosts = filtered.map((post) => {
        let score = 0;
        const text = (post.content || '').toLowerCase();
        const reason = (post.trendingReason || '').toLowerCase();
        const address = (post.address || '').toLowerCase();
        const venue = (post.venue || '').toLowerCase();

        if (text.startsWith(query)) score += 20;
        else if (text.includes(query)) score += 10;
        if (reason.includes(query)) score += 8;

        if (post.tags) {
          post.tags.forEach((tag) => {
            const tagLower = tag.toLowerCase();
            if (tagLower === query) score += 15;
            else if (tagLower.includes(query)) score += 6;
          });
        }

        if (address.includes(query) || venue.includes(query)) score += 8;

        return { post, score };
      });

      filtered = scoredPosts
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.post);
    } else {
      // 4. Addictive Sort Modes
      filtered.sort((a, b) => {
        if (sortMode === 'viral') {
          return (b.viralScore || 80) - (a.viralScore || 80);
        }
        if (sortMode === 'discussed') {
          return (b.submissions?.length || 1) - (a.submissions?.length || 1);
        }
        // Default 'velocity': combine viralScore + likes
        const velA = (a.viralScore || 85) * 100 + (typeof a.likes === 'number' ? a.likes : 100);
        const velB = (b.viralScore || 85) * 100 + (typeof b.likes === 'number' ? b.likes : 100);
        return velB - velA;
      });
    }

    return filtered;
  }, [generalPosts, searchQuery, currentFilterPlatform, activeTypeFilter, sortMode]);

  const handleBoomPost = (targetPost: SocialPost) => {
    const alreadyBoomed = boomedUrls.has(targetPost.url);
    const nextStreak = alreadyBoomed ? boomStreak : boomStreak + 1;
    const xpGain = nextStreak >= 5 ? 50 : 25;
    const nextXp = curatorXp + xpGain;

    setBoomStreak(nextStreak);
    setCuratorXp(nextXp);
    setBoomedUrls((prev) => new Set(prev).add(targetPost.url));
    try {
      localStorage.setItem('sakaboom_curator_xp', String(nextXp));
    } catch {}

    setGeneralPosts((prev) =>
      prev.map((p) => {
        if (p.url === targetPost.url && p.content === targetPost.content) {
          return {
            ...p,
            likes: (typeof p.likes === 'number' ? p.likes : 0) + 1,
          };
        }
        return p;
      })
    );

    // Persist Boom to backend
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'boom',
        url: targetPost.url,
        post: targetPost,
      }),
    }).catch(() => {});

    toast({
      title: `💥 Boomed! +${xpGain} Curator XP (${nextStreak}x Streak🔥)`,
      description: 'You amplified this cross-network signal up the global velocity chart.',
    });
  };

  // Keyboard J/K & B navigation for addictive rapid browsing
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || selectedPostDetail || isAddDialogOpen) {
        return;
      }
      if (e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setFocusedStreamIdx((prev) => Math.min(filteredPosts.length - 1, prev + 1));
      } else if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setFocusedStreamIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key.toLowerCase() === 'b' && filteredPosts[focusedStreamIdx]) {
        e.preventDefault();
        handleBoomPost(filteredPosts[focusedStreamIdx]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [filteredPosts, focusedStreamIdx, selectedPostDetail, isAddDialogOpen]);

  const handleFlushQueuedSignals = () => {
    if (queuedAgentPosts.length === 0) return;
    handlePublishAgentPosts(queuedAgentPosts);
    const count = queuedAgentPosts.length;
    setQueuedAgentPosts([]);
    setCuratorXp((prev) => prev + 30);
    toast({
      title: `⚡ Loaded ${count} Breaking Viral Signals! (+30 XP)`,
      description: 'Fresh cross-platform discoveries are now at the top of your feed.',
    });
  };

  const handlePostSubmit = (post: any, collectionId?: number | null) => {
    const existingIndex = generalPosts.findIndex((p) => p.url === post.url);

    if (existingIndex > -1) {
      setGeneralPosts((prev) =>
        prev.map((p, idx) => {
          if (idx === existingIndex) {
            const newSubmission = {
              submitter: 'Curator',
              description: post.caption || post.text,
              timestamp: new Date().toISOString(),
              reputation: 120,
            };
            return {
              ...p,
              content: post.caption || post.text,
              submissions: [...(p.submissions || []), newSubmission],
            };
          }
          return p;
        })
      );
      setCuratorXp((prev) => prev + 75);
      toast({ title: 'Perspective Synced! (+75 XP)', description: 'Your take was combined into the canonical story node.' });
    } else {
      const defaultPost: SocialPost = {
        platform: post.platform || 'web',
        content: post.caption || post.text,
        likes: 1,
        url: post.url,
        image: post.media,
        video: post.video,
        submitter: 'Curator',
        submitterReputation: 150,
        verificationScore: 98,
        upvotesCount: 1,
        downvotesCount: 0,
        tags: post.tags || ['indexed', 'frontpage'],
        trendingReason: 'Newly curated by community scout.',
        viralScore: 92,
        sentiment: 'bullish',
        submissions: [
          {
            submitter: 'Curator',
            description: post.caption || post.text,
            timestamp: new Date().toISOString(),
          },
        ],
        type: post.type,
        eventDate: post.eventDate,
        venue: post.venue,
        address: post.address,
        authorHandle: post.authorHandle,
      };

      setGeneralPosts((prev) => [defaultPost, ...prev]);
      setCuratorXp((prev) => prev + 100);
      toast({ title: '🚀 Frontpage Live! (+100 Curator XP)', description: 'Your curated link is now indexed across all social feeds.' });
    }

    // Persist curated post or merged perspective to backend
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        post,
      }),
    }).catch(() => {});
  };

  const handleAddPerspective = (targetPost: SocialPost, text: string) => {
    setGeneralPosts((prev) =>
      prev.map((p) => {
        if (p.url === targetPost.url && p.content === targetPost.content) {
          const newSub = {
            submitter: 'You (Curator)',
            description: text,
            timestamp: new Date().toISOString(),
            reputation: 150,
          };
          return {
            ...p,
            submissions: [...(p.submissions || []), newSub],
          };
        }
        return p;
      })
    );
    setCuratorXp((prev) => prev + 50);

    // Persist perspective to backend
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'perspective',
        url: targetPost.url,
        text,
        submitter: 'Curator',
        post: targetPost,
      }),
    }).catch(() => {});
  };

  const handleAddToPlaylist = (playlistId: number, post: SocialPost) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.posts.some((p) => p.url === post.url && p.content === post.content)) {
            toast({ title: 'Already in Playlist', description: `This card is already saved in "${pl.name}".` });
            return pl;
          }
          toast({ title: 'Saved to Playlist! (+15 XP)', description: `Added to "${pl.name}".` });
          return { ...pl, posts: [...pl.posts, post] };
        }
        return pl;
      })
    );
    setCuratorXp((prev) => prev + 15);
    setActiveDropdownIndex(null);
  };

  const handleCreatePlaylist = (name: string, firstPost?: SocialPost) => {
    if (!name.trim()) return;
    const newId = Math.max(0, ...playlists.map((p) => p.id)) + 1;
    const newPl: Playlist = {
      id: newId,
      name: name.trim(),
      posts: firstPost ? [firstPost] : [],
    };
    setPlaylists((prev) => [...prev, newPl]);
    setNewPlaylistName('');
    setActiveDropdownIndex(null);
    toast({
      title: 'Playlist Created!',
      description: firstPost ? `Created "${name}" and saved card.` : `Created playlist "${name}".`,
    });
  };

  if (!hydrated) return null;

  const currentTicker = OMNI_TICKER_ITEMS[activeTickerIdx];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Background Glow Orbs for High-Contrast Depth */}
      <div className="pointer-events-none fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] -z-10" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 w-[450px] h-[450px] bg-fuchsia-600/10 rounded-full blur-[140px] -z-10" />

      {/* 1. TOP PULSE BREAKING TICKER + CURATOR STREAK HUD */}
      <div className="bg-gradient-to-r from-violet-950/95 via-slate-950/95 to-indigo-950/95 border-b border-white/10 py-2 px-4 sticky top-0 z-40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-black tracking-widest text-[10px] uppercase text-red-400 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> PULSE
            </span>
          </div>

          {/* Scrolling Ticker Text */}
          <div
            onClick={() => {
              setCurrentFilterPlatform(currentTicker.network);
              setSearchQuery(currentTicker.tag);
            }}
            className="flex-1 overflow-hidden text-slate-300 hover:text-white cursor-pointer transition-all duration-300 flex items-center gap-2 group truncate"
          >
            <span className="inline-flex items-center gap-1 font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/60 text-[10px] uppercase shrink-0">
              {renderPlatformIcon(currentTicker.network, 'w-3 h-3')}
              {currentTicker.network}
            </span>
            <span className="truncate font-medium text-xs text-slate-200 group-hover:underline">
              {currentTicker.text}
            </span>
            <ArrowRight className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>

          {/* Addictive Dopamine Streak & Curator XP HUD */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
              <span>{boomStreak}x Streak</span>
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full text-[11px] font-black">
              <Trophy className="w-3 h-3 text-indigo-400" />
              <span>{curatorXp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 2. MAIN HEADER & UNIVERSAL INGESTION BAR */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.6)] group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  SAKABOOM
                </h1>
                <p className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
                  Live Viral Intelligence Radar
                </p>
              </div>
            </Link>
          </div>

          {/* Universal Search & Paste Input */}
          <div className="w-full md:max-w-xl flex items-center bg-slate-900/90 border border-white/15 rounded-2xl p-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-xl transition-all">
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search viral topics, hashtags, or paste any X / TikTok / YouTube / Reddit URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 font-medium py-1.5"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-500 hover:text-white px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
            <Button
              size="sm"
              onClick={() => setAddDialogOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3.5 font-bold text-xs h-9 shadow-lg shadow-indigo-600/30 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Curate
            </Button>

            <button
              onClick={() => setActiveView(activeView === 'playlists' ? 'feed' : 'playlists')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 h-9 shrink-0',
                activeView === 'playlists'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white hover:border-white/20'
              )}
            >
              <Folder className="w-3.5 h-3.5 text-indigo-400" />
              <span>{activeView === 'playlists' ? 'Feed' : `Decks (${playlists.length})`}</span>
            </button>
          </div>
        </header>

        {/* 3. UNIVERSAL SOCIAL MATRIX PLATFORM PILLS + VELOCITY CONTROLS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: '🔥 All Radar', icon: Flame },
                { id: 'instagram', label: 'Instagram', icon: Instagram },
                { id: 'twitter', label: 'X / Twitter', icon: Twitter },
                { id: 'tiktok', label: 'TikTok', icon: Tiktok },
                { id: 'youtube', label: 'YouTube', icon: Youtube },
                { id: 'reddit', label: 'Reddit', icon: Reddit },
                { id: 'threads', label: 'Threads', icon: Threads },
                { id: 'openart', label: 'AI & Art', icon: Sparkles },
                { id: 'location', label: 'Spots', icon: MapPin },
              ].map((platform) => {
                const Icon = platform.icon;
                const isActive = currentFilterPlatform === platform.id;
                return (
                  <button
                    key={platform.id}
                    onClick={() => setCurrentFilterPlatform(platform.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border shrink-0 backdrop-blur-md',
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105'
                        : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{platform.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Bar: Format Filters + Sort Velocity + Bento vs Stream Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'link', 'location', 'event'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTypeFilter(type)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border uppercase tracking-wider',
                    activeTypeFilter === type
                      ? 'bg-white text-slate-950 border-white font-black'
                      : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-slate-200'
                  )}
                >
                  {type === 'all' ? 'All Formats' : type === 'link' ? '🔗 Links & Video' : type === 'location' ? '📍 Spots' : '📅 Events'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Velocity Sort Switcher */}
              <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-xl p-0.5">
                {[
                  { id: 'velocity', label: '⚡ Velocity Hot' },
                  { id: 'viral', label: '🔥 Peak Viral' },
                  { id: 'discussed', label: '💬 Most Takes' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortMode(s.id as any)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[11px] font-black transition-all',
                      sortMode === s.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Bento Matrix vs Addictive Focus Stream Switcher */}
              <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-xl p-0.5">
                <button
                  onClick={() => setFeedLayout('bento')}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all',
                    feedLayout === 'bento'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  )}
                  title="Asymmetric Bento Matrix"
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Bento
                </button>
                <button
                  onClick={() => setFeedLayout('stream')}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all',
                    feedLayout === 'stream'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  )}
                  title="Full-Impact Viral Stream (Use J/K keys to navigate, B to Boom)"
                >
                  <Rows3 className="w-3.5 h-3.5" /> Stream
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. REAL-TIME FOMO "NEW VIRAL SIGNALS" FLOATING PILL */}
        {queuedAgentPosts.length > 0 && activeView === 'feed' && (
          <div className="flex justify-center pt-1">
            <button
              onClick={handleFlushQueuedSignals}
              className="group flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-black text-xs px-5 py-2.5 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>
                ⚡ {queuedAgentPosts.length} New Viral {queuedAgentPosts.length === 1 ? 'Signal' : 'Signals'} Just Broke Across Networks — Click to Load (+30 XP)
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* 5. MAIN CONTENT VIEW: FEED VS PLAYLISTS */}
        {activeView === 'playlists' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/80 p-5 rounded-3xl border border-white/10">
              <div>
                <h3 className="text-lg font-black text-white">Curated Collections &amp; Living Playlists</h3>
                <p className="text-xs text-slate-400 mt-0.5">High-signal knowledge trees and cross-platform decks.</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New collection name..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="bg-slate-950 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />
                <Button
                  size="sm"
                  onClick={() => handleCreatePlaylist(newPlaylistName)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Create Deck
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((pl) => (
                <div key={pl.id} className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 space-y-4 hover:border-indigo-500/50 transition-all shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-white text-base flex items-center gap-2">
                        <Folder className="w-4 h-4 text-indigo-400" />
                        {pl.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{pl.posts.length} indexed items</p>
                    </div>
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-800">
                      Curated Deck
                    </span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {pl.posts.map((post, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => setSelectedPostDetail(post)}
                        className="bg-slate-950/80 p-2.5 rounded-xl border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all flex items-center justify-between text-xs"
                      >
                        <span className="truncate text-slate-200 font-medium max-w-[200px]">{post.content}</span>
                        <span className="text-[10px] uppercase font-bold text-indigo-400 shrink-0">{post.platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 6. ASYMMETRIC BENTO HERO MATRIX OR FOCUS STREAM */
          <>
            {feedLayout === 'stream' && (
              <div className="flex items-center justify-between bg-indigo-950/40 border border-indigo-500/30 rounded-2xl px-4 py-2.5 text-xs text-indigo-200 max-w-2xl mx-auto">
                <span className="font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Focus Stream Active — Use <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-white/20 font-mono text-[10px]">J</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-white/20 font-mono text-[10px]">K</kbd> keys to cycle cards, <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-white/20 font-mono text-[10px]">B</kbd> to Boom!
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFocusedStreamIdx((p) => Math.max(0, p - 1))}
                    className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setFocusedStreamIdx((p) => Math.min(filteredPosts.length - 1, p + 1))}
                    className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div
              className={cn(
                'grid gap-6',
                feedLayout === 'stream'
                  ? 'grid-cols-1 max-w-2xl mx-auto'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              )}
            >
              {filteredPosts.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-slate-900/40 rounded-3xl border border-white/10 space-y-4">
                  <Search className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-slate-400 text-sm font-medium">No viral stories match this filter. Try another network or keyword.</p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentFilterPlatform('all');
                      setActiveTypeFilter('all');
                    }}
                    variant="outline"
                    className="rounded-full text-xs font-bold border-white/20 text-white"
                  >
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                filteredPosts.map((post, postIndex) => {
                  const isLocation = post.type === 'location' || post.platform === 'location';
                  const isEvent = post.type === 'event';
                  const showDropdown = activeDropdownIndex === postIndex;
                  const isHeroCard = feedLayout === 'bento' && postIndex === 0;
                  const isUltraViral = (post.viralScore || 0) >= 96;
                  const isBoomed = boomedUrls.has(post.url);
                  const isStreamFocused = feedLayout === 'stream' && focusedStreamIdx === postIndex;

                  // Calculate simulated hourly velocity from likes & viralScore
                  const velocityPerHr = Math.max(
                    45,
                    Math.round(((typeof post.likes === 'number' ? post.likes : 300) / 14) * ((post.viralScore || 88) / 85))
                  );

                  const freq = Math.max(2, adSenseConfig.frequency || 4);
                  const shouldShowAdAfter =
                    adSenseConfig.enabled &&
                    postIndex + 1 - adRandomOffset >= 0 &&
                    (postIndex + 1 - adRandomOffset) % freq === 0;
                  const adSlotIdx = Math.floor((postIndex + 1) / freq) + adRandomOffset;

                  return (
                    <Fragment key={`card-group-${postIndex}`}>
                      <div
                        className={cn(
                          'group rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col justify-between relative backdrop-blur-xl',
                          isHeroCard && 'md:col-span-2 bg-gradient-to-br from-slate-900/95 via-indigo-950/40 to-slate-900/95 border-indigo-500/50 shadow-[0_15px_50px_-12px_rgba(99,102,241,0.35)]',
                          !isHeroCard && isUltraViral && 'bg-slate-900/95 border-amber-500/40 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] hover:border-amber-400',
                          !isHeroCard && !isUltraViral && 'bg-slate-900/90 border-white/10 hover:border-indigo-500/60 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.3)]',
                          isStreamFocused && 'ring-2 ring-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.3)]'
                        )}
                      >
                        <div className="cursor-pointer" onClick={() => setSelectedPostDetail(post)}>
                          {/* Media Header with Hover-to-Play Video or Image */}
                          {post.video ? (
                            <div
                              className={cn(
                                'relative w-full bg-slate-950 overflow-hidden border-b border-white/10',
                                isHeroCard || feedLayout === 'stream' ? 'h-64' : 'h-48'
                              )}
                              onMouseEnter={(e) => {
                                const vid = e.currentTarget.querySelector('video');
                                vid?.play().catch(() => {});
                              }}
                              onMouseLeave={(e) => {
                                const vid = e.currentTarget.querySelector('video');
                                vid?.pause();
                              }}
                            >
                              <video
                                src={post.video}
                                poster={post.image}
                                controls
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md text-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-500/40 pointer-events-none">
                                <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                                HOVER TO PLAY
                              </div>
                              {post.viralScore ? (
                                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                                  <TrendingUp className="w-3 h-3" />
                                  {post.viralScore} VIRAL
                                </div>
                              ) : null}
                            </div>
                          ) : post.image ? (
                            <div
                              className={cn(
                                'relative w-full bg-slate-950 overflow-hidden border-b border-white/10',
                                isHeroCard || feedLayout === 'stream' ? 'h-64' : 'h-48'
                              )}
                            >
                              <img
                                src={post.image}
                                alt={post.content}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                              {isHeroCard && (
                                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                                  <Flame className="w-3.5 h-3.5 fill-white" />
                                  #1 BREAKOUT SIGNAL
                                </div>
                              )}

                              {post.viralScore ? (
                                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                                  <TrendingUp className="w-3 h-3" />
                                  {post.viralScore} VIRAL
                                </div>
                              ) : null}

                              {/* Live Velocity Overlay on Bottom-Left of Image */}
                              <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-2">
                                <span className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                                  <Activity className="w-3 h-3 animate-pulse" />
                                  +{velocityPerHr.toLocaleString()}/hr velocity
                                </span>
                                {post.sentiment && (
                                  <span className="bg-slate-950/85 backdrop-blur-md text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                                    {post.sentiment}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : null}

                          <div className="p-5 space-y-3.5">
                            {/* Network Source + Link Shares Metric */}
                            <div className="flex justify-between items-center flex-wrap gap-2">
                              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800/60">
                                {renderPlatformIcon(post.platform)}
                                <span>{post.platform}</span>
                                {post.authorHandle && (
                                  <span className="text-slate-400 font-semibold normal-case">
                                    • {post.authorHandle}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-[11px] font-black text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
                                  <Share2 className="w-3 h-3 text-cyan-400" />
                                  <span>{post.submissions?.length || 1}x Perspectives</span>
                                </div>

                                {post.crossPlatforms && post.crossPlatforms.length > 0 && (
                                  <div className="flex items-center gap-1 text-[10px] text-slate-300 font-bold bg-white/5 px-2 py-0.5 rounded-full border border-white/10 hidden sm:flex">
                                    <Layers className="w-3 h-3 text-indigo-400" />
                                    <span>{post.crossPlatforms.length} networks</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Story Content */}
                            <p
                              className={cn(
                                'text-slate-100 font-bold leading-snug text-left group-hover:text-white transition-colors',
                                isHeroCard || feedLayout === 'stream' ? 'text-base sm:text-lg line-clamp-3' : 'text-sm line-clamp-3'
                              )}
                            >
                              {post.content}
                            </p>

                            {/* "Why It's Trending" AI Pill */}
                            {post.trendingReason && (
                              <div className="bg-indigo-950/50 border border-indigo-500/25 rounded-2xl p-3 text-left space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 text-[10px] font-black text-indigo-300 uppercase tracking-wider">
                                    <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                                    <span>Why It&apos;s Blowing Up</span>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
                                  {post.trendingReason}
                                </p>

                                {/* Zero-Click Instant Takeaway Bullet */}
                                {post.takeaways && post.takeaways.length > 0 && (
                                  <div className="pt-1.5 border-t border-indigo-500/20 flex items-start gap-1.5 text-[11px] text-emerald-300 font-semibold">
                                    <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span className="line-clamp-1">{post.takeaways[0]}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Location / Event Metadata */}
                            {isLocation && post.address && (
                              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold truncate bg-emerald-950/40 p-2 rounded-xl border border-emerald-800/40">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{post.address}</span>
                              </div>
                            )}

                            {isEvent && (
                              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold truncate bg-purple-950/40 p-2 rounded-xl border border-purple-800/40">
                                <Calendar className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{post.eventDate || post.venue}</span>
                              </div>
                            )}

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
                                {post.tags.slice(0, isHeroCard ? 6 : 4).map((tag: string) => (
                                  <button
                                    key={tag}
                                    onClick={() => setSearchQuery(tag)}
                                    className="text-[10px] font-bold text-slate-400 hover:text-indigo-300 bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-0.5 rounded-md transition-all"
                                  >
                                    #{tag}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Action Strip */}
                        <div className="p-4 border-t border-white/10 bg-slate-950/70 rounded-b-3xl flex items-center justify-between relative flex-wrap gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleBoomPost(post)}
                              className={cn(
                                'flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-xl border transition-all active:scale-90',
                                isBoomed
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                                  : 'bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 border-amber-500/30'
                              )}
                            >
                              <span>💥 {isBoomed ? 'Boomed' : 'Boom'}</span>
                              <span>({(typeof post.likes === 'number' ? post.likes : 1).toLocaleString()})</span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPostDetail(post);
                              }}
                              className="text-[11px] text-indigo-300 hover:text-white font-bold bg-indigo-950/80 hover:bg-indigo-900/80 px-2.5 py-1.5 rounded-xl border border-indigo-800/60 flex items-center gap-1.5 transition-all"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                              <span>
                                {post.submissions?.length || 1} {post.submissions?.length === 1 ? 'Take' : 'Takes'}
                              </span>
                            </button>
                          </div>

                          <div className="relative">
                            <button
                              onClick={() => setActiveDropdownIndex(showDropdown ? null : postIndex)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold border border-white/10 transition-all"
                            >
                              <Bookmark className="w-3.5 h-3.5 text-indigo-400" /> Save
                            </button>

                            {/* Save to Playlist Dropdown */}
                            {showDropdown && (
                              <div className="absolute bottom-11 right-0 w-60 bg-slate-900 border border-white/20 rounded-2xl shadow-2xl z-50 p-3 text-left">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                                  Save to Curated Deck (+15 XP)
                                </div>
                                <div className="flex flex-col gap-1 max-h-36 overflow-y-auto mb-2.5">
                                  {playlists.map((pl) => (
                                    <button
                                      key={pl.id}
                                      onClick={() => handleAddToPlaylist(pl.id, post)}
                                      className="w-full flex items-center justify-between text-left text-xs font-semibold px-2 py-1.5 hover:bg-slate-800 rounded-lg text-slate-200"
                                    >
                                      <span className="flex items-center gap-1.5 truncate">
                                        <Folder className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                        <span className="truncate">{pl.name}</span>
                                      </span>
                                      {pl.posts.some((p) => p.url === post.url) && (
                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                      )}
                                    </button>
                                  ))}
                                </div>

                                <div className="border-t border-white/10 pt-2.5 flex gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="New deck..."
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-white/15 rounded-lg px-2 py-1 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
                                  />
                                  <button
                                    onClick={() => handleCreatePlaylist(newPlaylistName, post)}
                                    className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {shouldShowAdAfter && (
                        <AdSenseCard
                          slotIndex={adSlotIdx}
                          config={adSenseConfig}
                        />
                      )}
                    </Fragment>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* FOOTER */}
        <footer className="mt-16 text-center py-8 border-t border-white/10 text-xs text-slate-500 space-y-2">
          <p className="font-bold text-slate-400">
            SAKABOOM — Universal Cross-Network Index &amp; Viral Intelligence Radar
          </p>
          <p>
            Aggregating viral moments and high-signal discussions across X, TikTok, YouTube, Reddit, Instagram, Threads &amp; AI Arts.
          </p>
        </footer>
      </div>

      <AddContentDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onPostSubmit={handlePostSubmit}
      />

      {selectedPostDetail && (
        <PostDetailDialog
          post={selectedPostDetail}
          open={!!selectedPostDetail}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedPostDetail(null);
          }}
          onTagClick={(tag) => setSearchQuery(tag)}
          onAddPerspective={handleAddPerspective}
        />
      )}
    </div>
  );
}
