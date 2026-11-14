'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Megaphone,
  ExternalLink,
  Settings2,
  Check,
  Plus,
  Trash2,
  Server,
  Globe,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type {
  AdPlatformType,
  AdProviderEntry,
  BackendAdConfig,
  DirectSponsorCreative,
} from '@/app/api/ads/route';

export type AdSenseConfig = BackendAdConfig;

export const DEFAULT_ADSENSE_CONFIG: BackendAdConfig = {
  enabled: true,
  frequency: 4,
  rotationMode: 'random',
  previewFallback: true,
  providers: [
    {
      id: 'prov-adsense',
      platform: 'adsense',
      name: 'Google AdSense',
      enabled: true,
      publisherId: '',
      slotId: '',
      layoutKey: '-fb+5w+4e-db+86',
    },
    {
      id: 'prov-carbon',
      platform: 'carbon',
      name: 'Carbon Ads (BuySellAds)',
      enabled: true,
      carbonServeId: '',
      carbonPlacement: 'sakaboomcom',
    },
    {
      id: 'prov-ethical',
      platform: 'ethicalads',
      name: 'EthicalAds Network',
      enabled: true,
      ethicalPublisherId: '',
    },
    {
      id: 'prov-custom',
      platform: 'custom_script',
      name: 'Custom Ad Network (Media.net / Taboola / Adsterra)',
      enabled: false,
      scriptSrc: '',
      containerHtml: '',
    },
    {
      id: 'prov-direct',
      platform: 'direct_sponsor',
      name: 'Sakaboom Direct Sponsors',
      enabled: true,
    },
  ],
  directSponsors: [
    {
      id: 'sp-1',
      advertiser: 'Vercel Cloud AI',
      headline: 'Deploy Global Next.js & AI Agents with Zero Configuration',
      description:
        'Scale from zero to millions of requests with edge caching, streaming AI SDKs, and instant rollbacks.',
      cta: 'Start Free Trial',
      url: 'https://vercel.com',
      image:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1080',
      category: 'Google AdSense • Cloud',
      enabled: true,
    },
    {
      id: 'sp-2',
      advertiser: 'Raycast Pro',
      headline: 'Your Mac Command Bar, Supercharged with Local & Cloud AI',
      description:
        'Replace slow browser tabs with sub-millisecond launcher workflows, clipboard history, and custom extensions.',
      cta: 'Download for macOS',
      url: 'https://raycast.com',
      image:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1080',
      category: 'Carbon Ads • DevTools',
      enabled: true,
    },
    {
      id: 'sp-3',
      advertiser: 'Runway Gen-4 Studio',
      headline: 'Cinema-Grade Generative Video & Motion Brush in Your Browser',
      description:
        'Turn storyboards into 4K controllable shots with multi-camera physics and character consistency.',
      cta: 'Try Studio Now',
      url: 'https://runwayml.com',
      image:
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1080',
      category: 'Direct Sponsor • Creative AI',
      enabled: true,
    },
    {
      id: 'sp-4',
      advertiser: 'Supabase Vector',
      headline: 'The Open-Source Postgres Backend for High-Velocity Apps',
      description:
        'Instant REST & Realtime APIs, Auth, Edge Functions, and pgvector embeddings in under 2 minutes.',
      cta: 'Launch Database',
      url: 'https://supabase.com',
      image:
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1080',
      category: 'EthicalAds • Database',
      enabled: true,
    },
  ],
};

declare global {
  interface Window {
    adsbygoogle?: any[];
    ethicalads?: any;
  }
}

export async function fetchBackendAdConfig(): Promise<BackendAdConfig> {
  try {
    const res = await fetch('/api/ads', { cache: 'no-store' });
    if (!res.ok) return DEFAULT_ADSENSE_CONFIG;
    return await res.json();
  } catch {
    return DEFAULT_ADSENSE_CONFIG;
  }
}

export async function saveBackendAdConfig(
  config: BackendAdConfig
): Promise<BackendAdConfig> {
  const res = await fetch('/api/ads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    throw new Error('Failed to save ad configuration to backend');
  }
  return await res.json();
}

// Keep synchronous fallback helper for initial client state
export function loadSavedAdSenseConfig(): BackendAdConfig {
  return DEFAULT_ADSENSE_CONFIG;
}

/**
 * Dynamically injects Google AdSense script when an AdSense provider has a valid Publisher ID.
 */
function useAdSenseScript(publisherId?: string) {
  useEffect(() => {
    const cleanPubId = (publisherId || '').trim();
    if (!cleanPubId || !cleanPubId.startsWith('ca-pub-')) return;

    const existingScript = document.querySelector(
      `script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`
    );
    if (existingScript) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      cleanPubId
    )}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, [publisherId]);
}

/**
 * Dynamically injects EthicalAds client script when an EthicalAds publisher ID is configured.
 */
function useEthicalAdsScript(publisherId?: string) {
  useEffect(() => {
    const cleanId = (publisherId || '').trim();
    if (!cleanId) return;

    const existing = document.querySelector(
      `script[src*="media.ethicalads.io/media/client/ethicalads.min.js"]`
    );
    if (existing) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://media.ethicalads.io/media/client/ethicalads.min.js';
    document.head.appendChild(script);
  }, [publisherId]);
}

interface AdSenseCardProps {
  slotIndex: number;
  config: BackendAdConfig;
  onOpenSettings?: () => void;
}

export function AdSenseCard({
  slotIndex,
  config,
  onOpenSettings,
}: AdSenseCardProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const carbonContainerRef = useRef<HTMLDivElement | null>(null);
  const customContainerRef = useRef<HTMLDivElement | null>(null);
  const [adPushed, setAdPushed] = useState(false);

  const enabledProviders = (config.providers || []).filter((p) => p.enabled);
  const activeProvider: AdProviderEntry =
    enabledProviders.length > 0
      ? enabledProviders[slotIndex % enabledProviders.length]
      : DEFAULT_ADSENSE_CONFIG.providers[0];

  const adSenseProvider = (config.providers || []).find(
    (p) => p.platform === 'adsense'
  );
  const ethicalProvider = (config.providers || []).find(
    (p) => p.platform === 'ethicalads'
  );

  useAdSenseScript(adSenseProvider?.publisherId);
  useEthicalAdsScript(ethicalProvider?.ethicalPublisherId);

  const hasLiveAdSense =
    activeProvider.platform === 'adsense' &&
    Boolean(activeProvider.publisherId?.trim().startsWith('ca-pub-')) &&
    Boolean(activeProvider.slotId?.trim());

  const hasLiveCarbon =
    activeProvider.platform === 'carbon' &&
    Boolean(activeProvider.carbonServeId?.trim());

  const hasLiveEthical =
    activeProvider.platform === 'ethicalads' &&
    Boolean(activeProvider.ethicalPublisherId?.trim());

  const hasLiveCustom =
    activeProvider.platform === 'custom_script' &&
    Boolean(
      activeProvider.scriptSrc?.trim() || activeProvider.containerHtml?.trim()
    );

  const hasAnyLiveUnit =
    hasLiveAdSense || hasLiveCarbon || hasLiveEthical || hasLiveCustom;

  // Trigger Google AdSense push
  useEffect(() => {
    if (!hasLiveAdSense || adPushed) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setAdPushed(true);
    } catch {
      // Fallback remains visible if blocked
    }
  }, [hasLiveAdSense, adPushed]);

  // Inject Carbon Ads script into its container
  useEffect(() => {
    if (!hasLiveCarbon || !carbonContainerRef.current) return;
    carbonContainerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.async = true;
    script.id = '_carbonads_js';
    script.src = `https://cdn.carbonads.com/carbon.js?serve=${encodeURIComponent(
      activeProvider.carbonServeId!.trim()
    )}&placement=${encodeURIComponent(
      (activeProvider.carbonPlacement || 'sakaboomcom').trim()
    )}`;
    carbonContainerRef.current.appendChild(script);
  }, [
    hasLiveCarbon,
    activeProvider.carbonServeId,
    activeProvider.carbonPlacement,
  ]);

  // Inject Custom Network Script if configured
  useEffect(() => {
    if (!hasLiveCustom || !customContainerRef.current) return;
    customContainerRef.current.innerHTML = activeProvider.containerHtml || '';
    if (activeProvider.scriptSrc?.trim()) {
      const script = document.createElement('script');
      script.async = true;
      script.src = activeProvider.scriptSrc.trim();
      customContainerRef.current.appendChild(script);
    }
  }, [hasLiveCustom, activeProvider.scriptSrc, activeProvider.containerHtml]);

  const activeSponsors = (
    config.directSponsors && config.directSponsors.length > 0
      ? config.directSponsors
      : DEFAULT_ADSENSE_CONFIG.directSponsors
  ).filter((s) => s.enabled !== false);

  const creative =
    activeSponsors[slotIndex % Math.max(1, activeSponsors.length)] ||
    DEFAULT_ADSENSE_CONFIG.directSponsors[0];

  const platformBadgeLabel: Record<AdPlatformType, string> = {
    adsense: 'Sponsored • Google AdSense',
    carbon: 'Sponsored • Carbon Ads',
    ethicalads: 'Sponsored • EthicalAds',
    custom_script: `Sponsored • ${activeProvider.name}`,
    direct_sponsor: 'Sponsored • Direct Partner',
  };

  return (
    <div className="group bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-amber-950/20 rounded-3xl border border-amber-500/25 overflow-hidden hover:border-amber-400/60 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] transition-all duration-300 flex flex-col justify-between relative backdrop-blur-xl">
      <div>
        {/* Top Multi-Network Disclosure Strip */}
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-[10px]">
          <span className="font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 truncate">
            <Megaphone className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">
              {platformBadgeLabel[activeProvider.platform] || 'Sponsored Ad'}
            </span>
          </span>
          <span className="text-[10px] text-amber-400/70 font-bold uppercase tracking-wider shrink-0">
            Ad
          </span>
        </div>

        {/* 1. Live Google AdSense Container */}
        {hasLiveAdSense && (
          <div className="w-full min-h-[180px] bg-slate-950/60 flex items-center justify-center overflow-hidden p-2">
            <ins
              ref={adRef}
              className="adsbygoogle"
              style={{ display: 'block', width: '100%' }}
              data-ad-format="fluid"
              data-ad-layout-key={activeProvider.layoutKey || '-fb+5w+4e-db+86'}
              data-ad-client={activeProvider.publisherId!.trim()}
              data-ad-slot={activeProvider.slotId!.trim()}
            />
          </div>
        )}

        {/* 2. Live Carbon Ads Container */}
        {hasLiveCarbon && (
          <div
            ref={carbonContainerRef}
            className="w-full min-h-[160px] bg-slate-950/60 flex items-center justify-center p-4 text-xs text-slate-300"
          />
        )}

        {/* 3. Live EthicalAds Container */}
        {hasLiveEthical && (
          <div className="w-full min-h-[160px] bg-slate-950/60 flex items-center justify-center p-4">
            <div
              data-ea-publisher={activeProvider.ethicalPublisherId!.trim()}
              data-ea-type="image"
              className="dark"
            />
          </div>
        )}

        {/* 4. Live Custom Ad Network Container */}
        {hasLiveCustom && (
          <div
            ref={customContainerRef}
            className="w-full min-h-[160px] bg-slate-950/60 flex items-center justify-center p-3 overflow-hidden"
          />
        )}

        {/* 5. Backend Direct Sponsor / Multi-Network Fallback Card */}
        {(!hasAnyLiveUnit ||
          activeProvider.platform === 'direct_sponsor' ||
          config.previewFallback) && (
          <a
            href={creative.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block"
          >
            <div className="relative w-full h-40 bg-slate-950 overflow-hidden border-b border-white/10">
              <img
                src={creative.image}
                alt={creative.headline}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 z-10 bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-500/30">
                {creative.category}
              </div>
              <div className="absolute top-3 right-3 z-10 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
                AD
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-black text-amber-400 uppercase tracking-wider">
                  {creative.advertiser}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {activeProvider.name}
                </span>
              </div>

              <h4 className="text-sm text-white font-bold leading-snug group-hover:text-amber-200 transition-colors">
                {creative.headline}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {creative.description}
              </p>
            </div>
          </a>
        )}
      </div>

      {/* Bottom CTA Strip */}
      <div className="p-4 border-t border-amber-500/15 bg-slate-950/70 rounded-b-3xl flex items-center justify-between gap-2">
        <a
          href={creative.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="w-full inline-flex items-center justify-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-2 rounded-xl transition-all shadow-sm"
        >
          <span>{creative.cta}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

interface AdSenseSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: BackendAdConfig;
  onSaveConfig: (next: BackendAdConfig) => void;
}

export function AdSenseSettingsDialog({
  open,
  onOpenChange,
  config,
  onSaveConfig,
}: AdSenseSettingsDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<BackendAdConfig>(config);
  const [activeTab, setActiveTab] = useState<'networks' | 'sponsors'>('networks');
  const [isSaving, setIsSaving] = useState(false);

  // New Direct Sponsor quick-entry state
  const [newSponsor, setNewSponsor] = useState({
    advertiser: '',
    headline: '',
    description: '',
    cta: 'Learn More',
    url: '',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1080',
    category: 'Direct Sponsor',
  });

  useEffect(() => {
    if (open) {
      setForm(config);
      fetchBackendAdConfig().then((serverCfg) => {
        setForm(serverCfg);
      });
    }
  }, [open, config]);

  const updateProvider = (
    id: string,
    patch: Partial<AdProviderEntry>
  ) => {
    setForm((prev) => ({
      ...prev,
      providers: prev.providers.map((p) =>
        p.id === id ? { ...p, ...patch } : p
      ),
    }));
  };

  const handleAddDirectSponsor = () => {
    if (!newSponsor.advertiser.trim() || !newSponsor.headline.trim() || !newSponsor.url.trim()) {
      toast({
        title: 'Missing Sponsor Fields',
        description: 'Please enter Advertiser, Headline, and Target URL.',
        variant: 'destructive',
      });
      return;
    }
    const item: DirectSponsorCreative = {
      id: `sp-${Date.now()}`,
      advertiser: newSponsor.advertiser.trim(),
      headline: newSponsor.headline.trim(),
      description:
        newSponsor.description.trim() ||
        'Sponsored partner placement on Sakaboom Frontpage.',
      cta: newSponsor.cta.trim() || 'Visit Partner',
      url: newSponsor.url.trim(),
      image: newSponsor.image.trim(),
      category: newSponsor.category.trim() || 'Direct Sponsor',
      enabled: true,
    };
    setForm((prev) => ({
      ...prev,
      directSponsors: [item, ...(prev.directSponsors || [])],
    }));
    setNewSponsor({
      advertiser: '',
      headline: '',
      description: '',
      cta: 'Learn More',
      url: '',
      image:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1080',
      category: 'Direct Sponsor',
    });
  };

  const handleRemoveSponsor = (id: string) => {
    setForm((prev) => ({
      ...prev,
      directSponsors: prev.directSponsors.filter((s) => s.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const saved = await saveBackendAdConfig(form);
      onSaveConfig(saved);
      onOpenChange(false);
      toast({
        title: '💰 Backend Ad Hub Updated',
        description: `Synced ${saved.providers.filter((p) => p.enabled).length} active ad networks & ${saved.directSponsors.length} sponsor cards on the server.`,
      });
    } catch (err: any) {
      toast({
        title: 'Failed to save to backend',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-slate-950 border border-amber-500/30 text-slate-100 rounded-3xl p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border-b border-white/10 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
                  MULTI-PLATFORM BACKEND AD SERVER
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    /api/ads
                  </span>
                </DialogTitle>
                <p className="text-xs text-slate-400">
                  Manage Google AdSense, Carbon Ads, EthicalAds, Custom Scripts &amp; Direct Sponsors from the backend
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('networks')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5',
                  activeTab === 'networks'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Globe className="w-3.5 h-3.5" /> Ad Networks (5)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sponsors')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5',
                  activeTab === 'sponsors'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Layers className="w-3.5 h-3.5" /> Direct Cards ({form.directSponsors?.length || 0})
              </button>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Global Master Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-white/10">
            <label className="flex items-center justify-between sm:col-span-2 cursor-pointer">
              <div>
                <div className="text-xs font-black text-white">
                  Enable Backend In-Feed Ad Injection
                </div>
                <div className="text-[11px] text-slate-400">
                  Rotates active ad platforms randomly across the Frontpage Bento grid
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Frequency (Every N Posts)
              </label>
              <input
                type="number"
                min={2}
                max={12}
                value={form.frequency}
                onChange={(e) =>
                  setForm({
                    ...form,
                    frequency: Math.max(2, Math.min(12, Number(e.target.value) || 4)),
                  })
                }
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {activeTab === 'networks' ? (
            <div className="space-y-4">
              {form.providers?.map((prov) => (
                <div
                  key={prov.id}
                  className={cn(
                    'p-4 rounded-2xl border transition-all space-y-3',
                    prov.enabled
                      ? 'bg-slate-900/90 border-amber-500/30'
                      : 'bg-slate-900/40 border-white/5 opacity-60'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">
                        {prov.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white/5 text-amber-300 border border-white/10">
                        {prov.platform}
                      </span>
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prov.enabled}
                        onChange={(e) =>
                          updateProvider(prov.id, { enabled: e.target.checked })
                        }
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  {/* Google AdSense specific fields */}
                  {prov.platform === 'adsense' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          Publisher ID (Client)
                        </label>
                        <input
                          type="text"
                          placeholder="ca-pub-1234567890123456"
                          value={prov.publisherId || ''}
                          onChange={(e) =>
                            updateProvider(prov.id, { publisherId: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          Ad Slot ID
                        </label>
                        <input
                          type="text"
                          placeholder="9876543210"
                          value={prov.slotId || ''}
                          onChange={(e) =>
                            updateProvider(prov.id, { slotId: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          Fluid Layout Key
                        </label>
                        <input
                          type="text"
                          placeholder="-fb+5w+4e-db+86"
                          value={prov.layoutKey || ''}
                          onChange={(e) =>
                            updateProvider(prov.id, { layoutKey: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Carbon Ads specific fields */}
                  {prov.platform === 'carbon' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          Carbon Serve ID
                        </label>
                        <input
                          type="text"
                          placeholder="CE7D5K3M"
                          value={prov.carbonServeId || ''}
                          onChange={(e) =>
                            updateProvider(prov.id, { carbonServeId: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          Carbon Placement ID
                        </label>
                        <input
                          type="text"
                          placeholder="sakaboomcom"
                          value={prov.carbonPlacement || ''}
                          onChange={(e) =>
                            updateProvider(prov.id, {
                              carbonPlacement: e.target.value,
                            })
                          }
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* EthicalAds specific fields */}
                  {prov.platform === 'ethicalads' && (
                    <div className="pt-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        EthicalAds Publisher ID
                      </label>
                      <input
                        type="text"
                        placeholder="sakaboom"
                        value={prov.ethicalPublisherId || ''}
                        onChange={(e) =>
                          updateProvider(prov.id, {
                            ethicalPublisherId: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  )}

                  {/* Custom Ad Network Script fields */}
                  {prov.platform === 'custom_script' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          External Ad Script URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://contextual.media.net/dmedianet.js?cid=..."
                          value={prov.scriptSrc || ''}
                          onChange={(e) =>
                            updateProvider(prov.id, { scriptSrc: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          Ad Unit Container HTML / Tag
                        </label>
                        <input
                          type="text"
                          placeholder='<div id="medianet-slot-1"></div>'
                          value={prov.containerHtml || ''}
                          onChange={(e) =>
                            updateProvider(prov.id, {
                              containerHtml: e.target.value,
                            })
                          }
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Direct Sponsors Tab */
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  Add New Backend Sponsored Card
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Advertiser Name (e.g. Linear, Perplexity)"
                    value={newSponsor.advertiser}
                    onChange={(e) =>
                      setNewSponsor({ ...newSponsor, advertiser: e.target.value })
                    }
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Network / Category Badge (e.g. Carbon Ads • AI)"
                    value={newSponsor.category}
                    onChange={(e) =>
                      setNewSponsor({ ...newSponsor, category: e.target.value })
                    }
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Headline"
                    value={newSponsor.headline}
                    onChange={(e) =>
                      setNewSponsor({ ...newSponsor, headline: e.target.value })
                    }
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white sm:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Short Description"
                    value={newSponsor.description}
                    onChange={(e) =>
                      setNewSponsor({ ...newSponsor, description: e.target.value })
                    }
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white sm:col-span-2"
                  />
                  <input
                    type="url"
                    placeholder="Destination URL (https://...)"
                    value={newSponsor.url}
                    onChange={(e) =>
                      setNewSponsor({ ...newSponsor, url: e.target.value })
                    }
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="CTA Text (e.g. Try Free)"
                      value={newSponsor.cta}
                      onChange={(e) =>
                        setNewSponsor({ ...newSponsor, cta: e.target.value })
                      }
                      className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    <Button
                      type="button"
                      onClick={handleAddDirectSponsor}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Card
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {form.directSponsors?.map((sp) => (
                  <div
                    key={sp.id}
                    className="bg-slate-900/70 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-400">
                          {sp.advertiser}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                          {sp.category}
                        </span>
                      </div>
                      <p className="text-xs text-white font-semibold truncate mt-0.5">
                        {sp.headline}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSponsor(sp.id)}
                      className="text-slate-500 hover:text-red-400 p-1.5"
                      title="Remove Sponsor Card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={form.previewFallback}
                onChange={(e) =>
                  setForm({ ...form, previewFallback: e.target.checked })
                }
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span>Show native sponsor fallback when network script is unfilled</span>
            </label>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-xs text-slate-400 hover:text-white rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl px-4"
              >
                <Check className="w-4 h-4 mr-1" />
                {isSaving ? 'Saving to Backend...' : 'Save to Backend'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
