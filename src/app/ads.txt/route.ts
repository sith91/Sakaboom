import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { BackendAdConfig } from '@/app/api/ads/route';

const ADS_CONFIG_FILE = path.join(process.cwd(), '.sakaboom-ads-config.json');

export async function GET() {
  let config: Partial<BackendAdConfig> = {};
  try {
    const raw = await fs.readFile(ADS_CONFIG_FILE, 'utf-8');
    config = JSON.parse(raw);
  } catch {}

  const lines: string[] = [
    '# Sakaboom Authorized Digital Sellers (ads.txt)',
    '# Automatically synced from /admin/ads backend configuration',
  ];

  const adSenseProv = config.providers?.find((p) => p.platform === 'adsense');
  const rawPubId = (
    adSenseProv?.publisherId ||
    process.env.ADSENSE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
    ''
  ).trim();

  if (rawPubId) {
    const normalizedPubId = rawPubId.startsWith('ca-')
      ? rawPubId.slice(3)
      : rawPubId;
    lines.push(`google.com, ${normalizedPubId}, DIRECT, f08c47fec0942fa0`);
  } else {
    lines.push('# Configure your Google AdSense Publisher ID in /admin/ads to populate google.com entry');
  }

  return new NextResponse(lines.join('\n') + '\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
