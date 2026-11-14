'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Server,
  Globe,
  Layers,
  Check,
  Plus,
  Trash2,
  ArrowLeft,
  Bot,
  ExternalLink,
  Megaphone,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AdSenseCard,
  DEFAULT_ADSENSE_CONFIG,
  fetchBackendAdConfig,
  saveBackendAdConfig,
} from '@/components/app/adsense-card';
import type {
  AdProviderEntry,
  BackendAdConfig,
  DirectSponsorCreative,
} from '@/app/api/ads/route';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AdHubAdminPage() {
  const { toast } = useToast();
  const [form, setForm] = useState<BackendAdConfig>(DEFAULT_ADSENSE_CONFIG);
  const [activeTab, setActiveTab] = useState<'networks' | 'sponsors'>('networks');
  const [isSaving, setIsSaving] = useState(false);
  const [previewSlotIdx, setPreviewSlotIdx] = useState(0);

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
    fetchBackendAdConfig().then((cfg) => setForm(cfg));
  }, []);

  const updateProvider = (id: string, patch: Partial<AdProviderEntry>) => {
    setForm((prev) => ({
      ...prev,
      providers: prev.providers.map((p) => (p.id === id ? { ...p, ...patch } : p)),
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
    toast({
      title: 'Sponsor Card Staged',
      description: 'Click "Save to Backend" to publish to all users.',
    });
  };

  const handleRemoveSponsor = (id: string) => {
    setForm((prev) => ({
      ...prev,
      directSponsors: prev.directSponsors.filter((s) => s.id !== id),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const saved = await saveBackendAdConfig(form);
      setForm(saved);
      toast({
        title: '💰 Backend Ad Server Updated',
        description: `Synced ${
          saved.providers.filter((p) => p.enabled).length
        } active ad networks & ${saved.directSponsors.length} sponsor cards to /api/ads.`,
      });
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  MULTI-PLATFORM AD HUB — ADMIN PLATFORM
                </h1>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  /api/ads
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage Google AdSense, Carbon Ads, EthicalAds, Custom Scripts &amp; Direct Sponsors on the backend
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/admin/agent"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" /> Viral Agent Admin
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Configuration Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Master Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/90 p-5 rounded-3xl border border-white/10">
              <label className="flex items-center justify-between sm:col-span-2 cursor-pointer">
                <div>
                  <div className="text-sm font-black text-white">
                    Enable In-Feed Ad Injection on User Site
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Rotates enabled ad networks across random cards on the public Frontpage
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Card Frequency (Every N Posts)
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
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('networks')}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2',
                    activeTab === 'networks'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  <Globe className="w-4 h-4" /> Ad Networks (5)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('sponsors')}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2',
                    activeTab === 'sponsors'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  <Layers className="w-4 h-4" /> Direct Sponsor Cards ({form.directSponsors?.length || 0})
                </button>
              </div>

              <Button
                type="submit"
                disabled={isSaving}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl px-5 h-10 shadow-lg shadow-amber-500/20"
              >
                <Check className="w-4 h-4 mr-1.5" />
                {isSaving ? 'Saving to Backend...' : 'Save Configuration to Backend'}
              </Button>
            </div>

            {activeTab === 'networks' ? (
              <div className="space-y-4">
                {form.providers?.map((prov) => (
                  <div
                    key={prov.id}
                    className={cn(
                      'p-5 rounded-3xl border transition-all space-y-3',
                      prov.enabled
                        ? 'bg-slate-900/90 border-amber-500/30'
                        : 'bg-slate-900/40 border-white/5 opacity-60'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-black text-white">{prov.name}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white/5 text-amber-300 border border-white/10">
                          {prov.platform}
                        </span>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer font-bold">
                        <input
                          type="checkbox"
                          checked={prov.enabled}
                          onChange={(e) => updateProvider(prov.id, { enabled: e.target.checked })}
                          className="w-4 h-4 accent-amber-500 rounded"
                        />
                        <span>Active</span>
                      </label>
                    </div>

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
                            onChange={(e) => updateProvider(prov.id, { publisherId: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
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
                            onChange={(e) => updateProvider(prov.id, { slotId: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
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
                            onChange={(e) => updateProvider(prov.id, { layoutKey: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    )}

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
                            onChange={(e) => updateProvider(prov.id, { carbonServeId: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
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
                            onChange={(e) => updateProvider(prov.id, { carbonPlacement: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {prov.platform === 'ethicalads' && (
                      <div className="pt-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          EthicalAds Publisher ID
                        </label>
                        <input
                          type="text"
                          placeholder="sakaboom"
                          value={prov.ethicalPublisherId || ''}
                          onChange={(e) => updateProvider(prov.id, { ethicalPublisherId: e.target.value })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    )}

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
                            onChange={(e) => updateProvider(prov.id, { scriptSrc: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
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
                            onChange={(e) => updateProvider(prov.id, { containerHtml: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 space-y-3">
                  <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Create New Direct Sponsor Card
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Advertiser Name (e.g. Linear, Perplexity)"
                      value={newSponsor.advertiser}
                      onChange={(e) => setNewSponsor({ ...newSponsor, advertiser: e.target.value })}
                      className="bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Network / Category Badge (e.g. Direct Sponsor • AI)"
                      value={newSponsor.category}
                      onChange={(e) => setNewSponsor({ ...newSponsor, category: e.target.value })}
                      className="bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Headline"
                      value={newSponsor.headline}
                      onChange={(e) => setNewSponsor({ ...newSponsor, headline: e.target.value })}
                      className="bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white sm:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="Short Description"
                      value={newSponsor.description}
                      onChange={(e) => setNewSponsor({ ...newSponsor, description: e.target.value })}
                      className="bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white sm:col-span-2"
                    />
                    <input
                      type="url"
                      placeholder="Image URL (https://...)"
                      value={newSponsor.image}
                      onChange={(e) => setNewSponsor({ ...newSponsor, image: e.target.value })}
                      className="bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white sm:col-span-2"
                    />
                    <input
                      type="url"
                      placeholder="Destination URL (https://...)"
                      value={newSponsor.url}
                      onChange={(e) => setNewSponsor({ ...newSponsor, url: e.target.value })}
                      className="bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="CTA Text (e.g. Try Free)"
                        value={newSponsor.cta}
                        onChange={(e) => setNewSponsor({ ...newSponsor, cta: e.target.value })}
                        className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
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

                <div className="space-y-2.5">
                  {form.directSponsors?.map((sp) => (
                    <div
                      key={sp.id}
                      className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-400">{sp.advertiser}</span>
                          <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                            {sp.category}
                          </span>
                        </div>
                        <p className="text-xs text-white font-semibold truncate mt-1">{sp.headline}</p>
                        <p className="text-[11px] text-slate-400 truncate">{sp.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSponsor(sp.id)}
                        className="p-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-400 border border-red-800/40"
                        title="Remove Sponsor Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live User Feed Ad Card Preview */}
          <div className="space-y-4">
            <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 space-y-4 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Live User View Preview
                </h3>
                <button
                  type="button"
                  onClick={() => setPreviewSlotIdx((p) => p + 1)}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300"
                >
                  Cycle Slot #{previewSlotIdx + 1} &rarr;
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                This is exactly how the ad card renders inside the public Frontpage Bento grid (with all admin controls hidden from users):
              </p>

              <AdSenseCard slotIndex={previewSlotIdx} config={form} />

              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer pt-2 border-t border-white/10">
                <input
                  type="checkbox"
                  checked={form.previewFallback}
                  onChange={(e) => setForm({ ...form, previewFallback: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <span>Show native sponsor fallback when network script is unfilled</span>
              </label>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

