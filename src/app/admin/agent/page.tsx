'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bot,
  Sparkles,
  Play,
  Check,
  Terminal,
  TrendingUp,
  Cpu,
  Radio,
  Plus,
  RefreshCw,
  Layers,
  ExternalLink,
  Trash2,
  ArrowLeft,
  Megaphone,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SocialPost } from '@/lib/business-data';
import { PlatformId } from '@/lib/types';
import { Tiktok, Instagram, Twitter, Youtube, Reddit, Threads } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const AGENT_PLATFORMS: {
  id: PlatformId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'reddit', label: 'Reddit', icon: Reddit },
  { id: 'twitter', label: 'X / Twitter', icon: Twitter },
  { id: 'tiktok', label: 'TikTok', icon: Tiktok },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'threads', label: 'Threads', icon: Threads },
];

const NICHE_PRESETS = [
  { id: 'all', label: '🔥 All Viral' },
  { id: 'ai', label: '🤖 AI & LocalLLaMA' },
  { id: 'tech', label: '⚡ Hardware & Tech' },
  { id: 'viral', label: '🌍 Culture & Video' },
  { id: 'design', label: '🎨 Design & 3D Art' },
];

export default function ViralAgentAdminPage() {
  const { toast } = useToast();
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([
    'reddit',
    'twitter',
    'tiktok',
    'instagram',
    'youtube',
  ]);
  const [niche, setNiche] = useState<string>('all');
  const [limit, setLimit] = useState<number>(6);
  const [isScanning, setIsScanning] = useState(false);
  const [ollamaOnline, setOllamaOnline] = useState(false);
  const [autoPilot, setAutoPilot] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[Admin System] Sakaboom Viral Scout Agent Admin Console initialized.',
    '[Admin System] Connected to /api/agent/scout (.sakaboom-agent-cache.json).',
  ]);
  const [stagedCandidates, setStagedCandidates] = useState<SocialPost[]>([]);
  const [liveFeedPosts, setLiveFeedPosts] = useState<SocialPost[]>([]);

  const loadAgentState = async () => {
    try {
      const res = await fetch('/api/agent/scout', { cache: 'no-store' });
      const data = await res.json();
      setOllamaOnline(Boolean(data.ollamaOnline));
      setAutoPilot(Boolean(data.autoPilot));
      if (Array.isArray(data.posts)) {
        setLiveFeedPosts(data.posts);
      }
      if (Array.isArray(data.logs) && data.logs.length > 0) {
        setLogs((prev) => Array.from(new Set([...prev, ...data.logs])));
      }
    } catch {}
  };

  useEffect(() => {
    loadAgentState();
  }, []);

  const togglePlatform = (id: PlatformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleToggleAutoPilot = async () => {
    const next = !autoPilot;
    setAutoPilot(next);
    try {
      await fetch('/api/agent/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-autopilot', autoPilot: next }),
      });
      toast({
        title: next ? '🤖 Auto-Pilot Enabled' : 'Auto-Pilot Paused',
        description: next
          ? 'The agent will automatically scout and publish viral signals to the user feed.'
          : 'Manual approval mode active.',
      });
    } catch {}
  };

  const handleRunScan = async (autoPublish: boolean) => {
    setIsScanning(true);
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Admin triggered multi-social scan (${
        autoPublish ? 'Auto-Publish' : 'Stage for Review'
      })...`,
    ]);

    try {
      const res = await fetch('/api/agent/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          niche,
          limit,
          useOllama: true,
          autoPublish,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan failed');

      setStagedCandidates(data.posts || []);
      setLogs((prev) => [...prev, ...(data.logs || [])]);

      if (autoPublish) {
        await loadAgentState();
        toast({
          title: `🚀 Published ${data.posts?.length || 0} Viral Posts to User Feed`,
          description: 'Live Frontpage updated immediately.',
        });
      } else {
        toast({
          title: `⚡ Scanned ${data.posts?.length || 0} Candidates`,
          description: 'Review below and click "Publish to User Feed" on any card.',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Scan Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handlePublishPosts = async (postsToPublish: SocialPost[]) => {
    try {
      const res = await fetch('/api/agent/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          posts: postsToPublish,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.posts)) {
        setLiveFeedPosts(data.posts);
      }
      toast({
        title: `✅ Published ${postsToPublish.length} Post(s) to Live User Feed`,
        description: 'Now visible to all users on Sakaboom Frontpage.',
      });
    } catch (err: any) {
      toast({
        title: 'Publish Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteLivePost = async (url: string) => {
    try {
      const res = await fetch('/api/agent/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', url }),
      });
      const data = await res.json();
      if (Array.isArray(data.posts)) {
        setLiveFeedPosts(data.posts);
      }
      toast({
        title: 'Removed from Live Feed',
        description: 'The post was removed from the backend agent cache.',
      });
    } catch {}
  };

  const liveUrls = new Set(liveFeedPosts.map((p) => p.url));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Admin Navbar */}
      <header className="border-b border-white/10 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Back to Admin Portal"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  VIRAL SCOUT AGENT — ADMIN PLATFORM
                </h1>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  $0 / Mo Local Runtime
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dedicated backend operator console for multi-social viral ingestion &amp; scoring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-950 border border-white/10 px-3 py-1.5 rounded-xl">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>{ollamaOnline ? 'Ollama LLM: Online' : 'Engine: Local Velocity AI'}</span>
            </div>

            <button
              onClick={handleToggleAutoPilot}
              className={cn(
                'flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-xl border transition-all',
                autoPilot
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-950 text-slate-400 border-white/15 hover:text-white'
              )}
            >
              <Radio className={cn('w-3.5 h-3.5', autoPilot && 'animate-pulse')} />
              <span>{autoPilot ? 'Auto-Pilot: ON' : 'Auto-Pilot: OFF'}</span>
            </button>

            <Link
              href="/admin/ads"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 flex items-center gap-1.5"
            >
              <Megaphone className="w-3.5 h-3.5" /> Ad Hub Admin
            </Link>

            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1.5"
            >
              View User Site <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 1. Scanner Configuration Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/90 border border-white/10 rounded-3xl p-6 space-y-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Layers className="w-4 h-4" /> 1. Configure Multi-Network Ingestion
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 block">
                Target Social Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {AGENT_PLATFORMS.map((plat) => {
                  const Icon = plat.icon;
                  const active = selectedPlatforms.includes(plat.id);
                  return (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => togglePlatform(plat.id)}
                      className={cn(
                        'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all',
                        active
                          ? 'bg-indigo-600/30 text-indigo-200 border-indigo-400/60 shadow-sm'
                          : 'bg-slate-950/60 text-slate-500 border-white/5 hover:text-slate-300'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{plat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 block">
                  Niche / Subreddit / Topic Filter
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {NICHE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setNiche(preset.id)}
                      className={cn(
                        'px-2.5 py-1 rounded-xl text-xs font-bold border transition-all',
                        niche === preset.id
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-950/60 text-slate-400 border-white/10 hover:text-white'
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Custom topic or subreddit (e.g. robotics, LocalLLaMA, design)..."
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">
                  Batch Size (Cards per Scan)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={limit}
                  onChange={(e) => setLimit(Math.max(1, Math.min(20, Number(e.target.value) || 6)))}
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                onClick={() => handleRunScan(false)}
                disabled={isScanning}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl px-5 h-10"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Scanning Social Networks...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Scan &amp; Stage for Review
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleRunScan(true)}
                disabled={isScanning}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl px-5 h-10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Scan &amp; Auto-Publish to User Feed
              </Button>
            </div>
          </div>

          {/* Telemetry Console */}
          <div className="bg-black border border-white/10 rounded-3xl p-5 font-mono text-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-white/10">
                <span className="flex items-center gap-1.5 font-bold text-indigo-400">
                  <Terminal className="w-4 h-4" /> AGENT TELEMETRY
                </span>
                <span className="text-[10px] text-slate-500">npm run agent</span>
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {logs.slice(-10).map((log, i) => (
                  <div key={i} className="text-emerald-400/90 text-[11px] leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Live Cache: .sakaboom-agent-cache.json</span>
              <span className="text-emerald-400 font-bold">{liveFeedPosts.length} Live Posts</span>
            </div>
          </div>
        </div>

        {/* 2. Staged Candidates Queue (If Scanned in Review Mode) */}
        {stagedCandidates.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Staged Viral Candidates ({stagedCandidates.length})
              </h2>
              <Button
                size="sm"
                onClick={() => handlePublishPosts(stagedCandidates)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl"
              >
                <Plus className="w-4 h-4 mr-1" /> Publish All ({stagedCandidates.length}) to Live Feed
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stagedCandidates.map((post, idx) => {
                const isLive = liveUrls.has(post.url);
                return (
                  <div
                    key={`${post.url}-${idx}`}
                    className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {post.platform} • {post.authorHandle}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {post.viralScore} VIRAL
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-2">{post.content}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{post.trendingReason}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        Source <ExternalLink className="w-3 h-3" />
                      </a>
                      <Button
                        size="sm"
                        disabled={isLive}
                        onClick={() => handlePublishPosts([post])}
                        className={cn(
                          'h-7 px-3 rounded-xl text-[11px] font-black',
                          isLive
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        )}
                      >
                        {isLive ? (
                          <>
                            <Check className="w-3 h-3 mr-1" /> Live on Feed
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 mr-1" /> Publish to Feed
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Live Published Agent Posts Manager */}
        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Currently Live Agent Posts on User Feed ({liveFeedPosts.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                These posts are actively served to all visitors from the backend cache.
              </p>
            </div>
          </div>

          {liveFeedPosts.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No agent posts currently cached. Click &ldquo;Scan &amp; Auto-Publish&rdquo; above to populate.
            </div>
          ) : (
            <div className="space-y-2">
              {liveFeedPosts.map((post, i) => (
                <div
                  key={`${post.url}-${i}`}
                  className="bg-slate-950/80 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {post.platform}
                      </span>
                      <span className="text-[10px] font-black text-amber-400">
                        🔥 {post.viralScore} VIRAL
                      </span>
                      <span className="text-[11px] text-slate-500 truncate">
                        {post.authorHandle}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white truncate mt-1">
                      {post.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                      title="Open Source URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDeleteLivePost(post.url)}
                      className="p-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-400 border border-red-800/40"
                      title="Remove from Live User Feed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

