'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import { SocialPost } from '@/lib/business-data';
import { PlatformId } from '@/lib/types';
import { Tiktok, Instagram, Twitter, Youtube, Reddit, Threads } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ViralAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublishPosts: (posts: SocialPost[]) => void;
  autoPilotEnabled: boolean;
  onToggleAutoPilot: (enabled: boolean) => void;
}

const AGENT_PLATFORMS: { id: PlatformId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
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

export default function ViralAgentDialog({
  open,
  onOpenChange,
  onPublishPosts,
  autoPilotEnabled,
  onToggleAutoPilot,
}: ViralAgentDialogProps) {
  const { toast } = useToast();
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([
    'reddit',
    'twitter',
    'tiktok',
    'instagram',
    'youtube',
  ]);
  const [niche, setNiche] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [ollamaOnline, setOllamaOnline] = useState(false);
  const [engineUsed, setEngineUsed] = useState<string>('local-velocity-heuristic');
  const [logs, setLogs] = useState<string[]>([
    '[System] Sakaboom Local Viral Agent ready on macOS ($0/mo local runtime).',
    '[System] Select target networks and click "Scan & Score Viral Posts" to begin.',
  ]);
  const [discoveredPosts, setDiscoveredPosts] = useState<SocialPost[]>([]);
  const [publishedUrls, setPublishedUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      fetch('/api/agent/scout')
        .then((r) => r.json())
        .then((data) => {
          setOllamaOnline(Boolean(data.ollamaOnline));
          if (data.posts && data.posts.length > 0 && discoveredPosts.length === 0) {
            setDiscoveredPosts(data.posts.slice(0, 6));
          }
        })
        .catch(() => {});
    }
  }, [open]);

  const togglePlatform = (id: PlatformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleRunAgent = async (autoPublish = false) => {
    setIsScanning(true);
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Dispatching local multi-social scout across ${selectedPlatforms.length} networks...`,
    ]);

    try {
      const response = await fetch('/api/agent/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          niche,
          limit: 6,
          useOllama: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Agent scan failed');
      }

      setDiscoveredPosts(data.posts || []);
      setEngineUsed(data.engineUsed || 'local-velocity-heuristic');
      setLogs((prev) => [...prev, ...(data.logs || [])]);

      if (autoPublish && data.posts?.length > 0) {
        onPublishPosts(data.posts);
        setPublishedUrls((prev) => {
          const next = new Set(prev);
          data.posts.forEach((p: SocialPost) => next.add(p.url));
          return next;
        });
        toast({
          title: `🤖 Local Agent Published ${data.posts.length} Viral Posts!`,
          description: 'New multi-platform signals are now live on the Sakaboom Frontpage.',
        });
      } else {
        toast({
          title: `⚡ Discovered ${data.posts?.length || 0} Viral Posts`,
          description: `Scored ${data.scannedCount || 0} candidates locally at $0 cost.`,
        });
      }
    } catch (err: any) {
      setLogs((prev) => [...prev, `[Error] ${err.message}`]);
      toast({
        title: 'Agent Scan Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handlePublishSingle = (post: SocialPost) => {
    onPublishPosts([post]);
    setPublishedUrls((prev) => new Set(prev).add(post.url));
    toast({
      title: '🚀 Published to Frontpage!',
      description: `Indexed "${post.content.slice(0, 50)}..." under @saka_viral_agent.`,
    });
  };

  const handlePublishAll = () => {
    const unpublished = discoveredPosts.filter((p) => !publishedUrls.has(p.url));
    if (unpublished.length === 0) {
      toast({ title: 'All posts already published to feed!' });
      return;
    }
    onPublishPosts(unpublished);
    setPublishedUrls((prev) => {
      const next = new Set(prev);
      unpublished.forEach((p) => next.add(p.url));
      return next;
    });
    toast({
      title: `💥 Boom! Published ${unpublished.length} Viral Posts`,
      description: 'All agent-curated cards are now live on your Frontpage feed.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-slate-950 border border-indigo-500/30 text-slate-100 rounded-3xl p-0 overflow-hidden shadow-[0_0_60px_-15px_rgba(99,102,241,0.5)] max-h-[90vh] flex flex-col">
        {/* Top Command Header */}
        <DialogHeader className="p-6 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-violet-950/90 border-b border-white/10 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Bot className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  SAKA LOCAL VIRAL AGENT
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    $0 / Mo Local Runtime
                  </span>
                </DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Autonomous multi-network viral scout, velocity scorer & frontpage publisher
                </p>
              </div>
            </div>

            {/* Local AI Engine Status Pill + Auto-Pilot Toggle */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 text-[11px] font-bold bg-slate-900/90 border border-white/10 px-3 py-1.5 rounded-xl">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-300">
                  {ollamaOnline ? 'Ollama LLM: Online' : 'Engine: Local Velocity AI'}
                </span>
              </div>

              <button
                onClick={() => onToggleAutoPilot(!autoPilotEnabled)}
                className={cn(
                  'flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border transition-all',
                  autoPilotEnabled
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-900 text-slate-400 border-white/15 hover:text-white'
                )}
              >
                <Radio className={cn('w-3.5 h-3.5', autoPilotEnabled && 'animate-pulse')} />
                <span>{autoPilotEnabled ? 'Auto-Pilot: ON' : 'Auto-Pilot: OFF'}</span>
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Target Networks & Niche Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/70 p-4 rounded-2xl border border-white/10">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Target Social Networks
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AGENT_PLATFORMS.map((plat) => {
                  const Icon = plat.icon;
                  const active = selectedPlatforms.includes(plat.id);
                  return (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => togglePlatform(plat.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all',
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

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Viral Niche / Topic Filter
              </label>
              <div className="flex flex-wrap gap-1.5">
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
                placeholder="Or type custom subreddit / topic (e.g. robotics, coffee, anime)..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 mt-1"
              />
            </div>
          </div>

          {/* 2. Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleRunAgent(false)}
                disabled={isScanning}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs rounded-xl px-4 h-10 shadow-lg shadow-indigo-600/30"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Scanning Social Feeds...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Scan & Score Viral Posts
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleRunAgent(true)}
                disabled={isScanning}
                variant="outline"
                className="border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 font-bold text-xs rounded-xl h-10"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Scan & Auto-Publish to Feed
              </Button>
            </div>

            {discoveredPosts.length > 0 && (
              <Button
                onClick={handlePublishAll}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl h-10 px-4"
              >
                <Plus className="w-4 h-4 mr-1" />
                Publish All ({discoveredPosts.length}) to Frontpage
              </Button>
            )}
          </div>

          {/* 3. Live Agent Telemetry Console */}
          <div className="bg-black/80 border border-white/10 rounded-2xl p-3.5 font-mono text-[11px] space-y-1 max-h-28 overflow-y-auto">
            <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-white/5 mb-1">
              <span className="flex items-center gap-1.5 font-bold text-indigo-400">
                <Terminal className="w-3.5 h-3.5" /> LOCAL AGENT TELEMETRY
              </span>
              <span>CLI: npm run agent</span>
            </div>
            {logs.slice(-6).map((log, i) => (
              <div key={i} className="text-emerald-400/90 leading-relaxed truncate">
                {log}
              </div>
            ))}
          </div>

          {/* 4. Discovered Viral Candidates Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Discovered Viral Candidates ({discoveredPosts.length})
              </h4>
              <span className="text-[11px] text-slate-500">
                Ranked by cross-platform engagement velocity
              </span>
            </div>

            {discoveredPosts.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/40 rounded-2xl border border-white/5 text-slate-400 text-xs">
                Click <strong>&ldquo;Scan &amp; Score Viral Posts&rdquo;</strong> above to fetch live multi-platform viral signals.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {discoveredPosts.map((post, idx) => {
                  const isPublished = publishedUrls.has(post.url);
                  return (
                    <div
                      key={`${post.url}-${idx}`}
                      className="bg-slate-900/90 border border-white/10 hover:border-indigo-500/40 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                            {post.platform} • {post.authorHandle}
                          </span>
                          <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2 py-0.5 rounded-full">
                            <TrendingUp className="w-3 h-3" /> {post.viralScore} VIRAL
                          </span>
                        </div>

                        <p className="text-xs font-bold text-white leading-snug line-clamp-2">
                          {post.content}
                        </p>

                        {post.trendingReason && (
                          <p className="text-[11px] text-slate-400 bg-slate-950/80 p-2 rounded-xl border border-white/5 line-clamp-2">
                            <strong className="text-indigo-400">Why it&apos;s viral:</strong> {post.trendingReason}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                        >
                          Source <ExternalLink className="w-3 h-3" />
                        </a>

                        <Button
                          size="sm"
                          onClick={() => handlePublishSingle(post)}
                          disabled={isPublished}
                          className={cn(
                            'h-7 px-3 rounded-xl text-[11px] font-black',
                            isPublished
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          )}
                        >
                          {isPublished ? (
                            <>
                              <Check className="w-3 h-3 mr-1" /> Published
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 mr-1" /> Post to Feed
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

