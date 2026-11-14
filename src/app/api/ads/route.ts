import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export type AdPlatformType =
  | 'adsense'
  | 'carbon'
  | 'ethicalads'
  | 'custom_script'
  | 'direct_sponsor';

export interface DirectSponsorCreative {
  id: string;
  advertiser: string;
  headline: string;
  description: string;
  cta: string;
  url: string;
  image: string;
  category: string;
  enabled: boolean;
}

export interface AdProviderEntry {
  id: string;
  platform: AdPlatformType;
  name: string;
  enabled: boolean;
  // Google AdSense fields
  publisherId?: string;
  slotId?: string;
  layoutKey?: string;
  // Carbon Ads fields
  carbonServeId?: string;
  carbonPlacement?: string;
  // EthicalAds fields
  ethicalPublisherId?: string;
  // Custom Ad Network Script / Iframe fields
  scriptSrc?: string;
  containerHtml?: string;
}

export interface BackendAdConfig {
  enabled: boolean;
  frequency: number; // Insert a random ad card roughly every N posts
  rotationMode: 'round-robin' | 'random';
  previewFallback: boolean;
  providers: AdProviderEntry[];
  directSponsors: DirectSponsorCreative[];
  updatedAt?: string;
}

const ADS_CONFIG_FILE = path.join(process.cwd(), '.sakaboom-ads-config.json');

const DEFAULT_BACKEND_AD_CONFIG: BackendAdConfig = {
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
      publisherId: process.env.ADSENSE_CLIENT_ID || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
      slotId: process.env.ADSENSE_SLOT_ID || process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || '',
      layoutKey: '-fb+5w+4e-db+86',
    },
    {
      id: 'prov-carbon',
      platform: 'carbon',
      name: 'Carbon Ads (BuySellAds)',
      enabled: true,
      carbonServeId: process.env.CARBON_SERVE_ID || '',
      carbonPlacement: process.env.CARBON_PLACEMENT || 'sakaboomcom',
    },
    {
      id: 'prov-ethical',
      platform: 'ethicalads',
      name: 'EthicalAds Network',
      enabled: true,
      ethicalPublisherId: process.env.ETHICAL_ADS_PUBLISHER || '',
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

async function readBackendAdConfig(): Promise<BackendAdConfig> {
  try {
    const raw = await fs.readFile(ADS_CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_BACKEND_AD_CONFIG,
      ...parsed,
      providers: Array.isArray(parsed.providers)
        ? parsed.providers
        : DEFAULT_BACKEND_AD_CONFIG.providers,
      directSponsors: Array.isArray(parsed.directSponsors)
        ? parsed.directSponsors
        : DEFAULT_BACKEND_AD_CONFIG.directSponsors,
    };
  } catch {
    return DEFAULT_BACKEND_AD_CONFIG;
  }
}

async function writeBackendAdConfig(config: BackendAdConfig): Promise<void> {
  try {
    await fs.writeFile(
      ADS_CONFIG_FILE,
      JSON.stringify({ ...config, updatedAt: new Date().toISOString() }, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.warn('[Ads API] Failed to write .sakaboom-ads-config.json:', err);
  }
}

export async function GET() {
  const config = await readBackendAdConfig();
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated(request))) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as Partial<BackendAdConfig>;
    const current = await readBackendAdConfig();

    const updated: BackendAdConfig = {
      ...current,
      ...body,
      frequency: Math.max(2, Math.min(12, Number(body.frequency ?? current.frequency) || 4)),
      providers: Array.isArray(body.providers) ? body.providers : current.providers,
      directSponsors: Array.isArray(body.directSponsors)
        ? body.directSponsors
        : current.directSponsors,
      updatedAt: new Date().toISOString(),
    };

    await writeBackendAdConfig(updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update backend ad configuration' },
      { status: 500 }
    );
  }
}

