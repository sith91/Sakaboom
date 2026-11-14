'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Server,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Cpu,
  Megaphone,
  TrendingUp,
  Layers,
  Flame,
} from 'lucide-react';

export default function AdminPortalPage() {
  const [agentStats, setAgentStats] = useState({
    livePostsCount: 0,
    ollamaOnline: false,
    autoPilot: false,
    lastRun: null as string | null,
  });
  const [adStats, setAdStats] = useState({
    enabled: true,
    activeNetworksCount: 0,
    directSponsorsCount: 0,
    frequency: 4,
  });

  useEffect(() => {
    fetch('/api/agent/scout', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        setAgentStats({
          livePostsCount: Array.isArray(data.posts) ? data.posts.length : 0,
          ollamaOnline: Boolean(data.ollamaOnline),
          autoPilot: Boolean(data.autoPilot),
          lastRun: data.lastRun || null,
        });
      })
      .catch(() => {});

    fetch('/api/ads', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        setAdStats({
          enabled: Boolean(data.enabled),
          activeNetworksCount: Array.isArray(data.providers)
            ? data.providers.filter((p: any) => p.enabled).length
            : 0,
          directSponsorsCount: Array.isArray(data.directSponsors)
            ? data.directSponsors.length
            : 0,
          frequency: data.frequency || 4,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-white/10 bg-slate-900/90 backdrop-blur-xl px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                SAKABOOM ADMIN PORTAL
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Operator Console
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Separated backend administration for Viral Scout Agent &amp; Multi-Network Ad Server
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-xs font-black bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-2 transition-all"
          >
            Open Public User Site <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Platform 1: Viral Scout Agent Admin Platform */}
          <Link
            href="/admin/agent"
            className="group bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 hover:border-indigo-400 rounded-3xl p-8 flex flex-col justify-between gap-6 transition-all hover:shadow-[0_15px_50px_-10px_rgba(99,102,241,0.35)]"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Bot className="w-8 h-8 text-slate-950" />
                </div>
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  /admin/agent
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
                  Viral Scout Agent Platform
                </h2>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Autonomous multi-network viral post scanner (Reddit, X, TikTok, Instagram, YouTube, Threads), local Ollama / Velocity AI scorer, Auto-Pilot daemon, and live feed publisher.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Live Agent Posts</div>
                  <div className="text-lg font-black text-white mt-0.5 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    {agentStats.livePostsCount}
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Auto-Pilot</div>
                  <div className="text-lg font-black text-indigo-300 mt-0.5">
                    {agentStats.autoPilot ? 'ON' : 'OFF'}
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Local AI</div>
                  <div className="text-xs font-black text-emerald-400 mt-1.5 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    {agentStats.ollamaOnline ? 'Ollama' : 'Velocity AI'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-black text-indigo-300 group-hover:text-white">
              <span>Launch Viral Scout Agent Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Platform 2: Multi-Platform Ad Hub Admin Platform */}
          <Link
            href="/admin/ads"
            className="group bg-gradient-to-br from-slate-900 via-amber-950/25 to-slate-900 border border-amber-500/30 hover:border-amber-400 rounded-3xl p-8 flex flex-col justify-between gap-6 transition-all hover:shadow-[0_15px_50px_-10px_rgba(245,158,11,0.3)]"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Server className="w-8 h-8 text-slate-950" />
                </div>
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  /admin/ads
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                  Multi-Platform Ad Hub Platform
                </h2>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Backend ad server configuration for Google AdSense, Carbon Ads, EthicalAds, Custom Ad Scripts (Media.net / Taboola), and Direct Sponsor cards with live user-view preview.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Ad Networks</div>
                  <div className="text-lg font-black text-white mt-0.5 flex items-center gap-1">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    {adStats.activeNetworksCount} Active
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Direct Cards</div>
                  <div className="text-lg font-black text-amber-300 mt-0.5 flex items-center gap-1">
                    <Layers className="w-4 h-4" />
                    {adStats.directSponsorsCount}
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Frequency</div>
                  <div className="text-xs font-black text-emerald-400 mt-1.5">
                    Every {adStats.frequency} Posts
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-black text-amber-300 group-hover:text-white">
              <span>Launch Multi-Platform Ad Hub Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

