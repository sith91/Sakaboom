#!/usr/bin/env npx tsx
/**
 * Sakaboom Local Viral Agent CLI Daemon
 *
 * Usage:
 *   npm run agent                      # Single scan & save to .sakaboom-agent-cache.json
 *   npm run agent -- --watch           # Continuous background loop (every 15 mins)
 *   npm run agent -- --niche=ai        # Target specific niche (ai, tech, viral, design)
 */

import fs from 'fs/promises';
import path from 'path';
import { runLocalViralAgent } from '../src/ai/flows/viral-agent-flow';

const CACHE_FILE = path.join(process.cwd(), '.sakaboom-agent-cache.json');

async function executeCycle(niche: string, limit: number) {
  console.log(`\n⚡ [Sakaboom Local Agent] Starting scan (niche="${niche}", limit=${limit})...`);
  const result = await runLocalViralAgent({ niche, limit, useOllama: true });

  for (const log of result.logs) {
    console.log(`  ${log}`);
  }

  let existing: any = { posts: [] };
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf-8');
    existing = JSON.parse(raw);
  } catch {
    // No existing cache yet
  }

  const mergedPosts = [...result.posts];
  for (const oldPost of existing.posts || []) {
    if (!mergedPosts.some((p) => p.url === oldPost.url)) {
      mergedPosts.push(oldPost);
    }
  }

  await fs.writeFile(
    CACHE_FILE,
    JSON.stringify(
      {
        posts: mergedPosts.slice(0, 50),
        lastRun: result.timestamp,
        logs: result.logs,
        engineUsed: result.engineUsed,
        scannedCount: result.scannedCount,
      },
      null,
      2
    ),
    'utf-8'
  );

  console.log(`\n✅ Indexed ${result.posts.length} viral posts into ${path.basename(CACHE_FILE)}:`);
  result.posts.forEach((p, idx) => {
    console.log(`  ${idx + 1}. [${p.platform.toUpperCase()} | 🔥 ${p.viralScore}] ${p.content}`);
  });
}

async function main() {
  const args = process.argv.slice(2);
  const watchMode = args.includes('--watch');
  const nicheArg = args.find((a) => a.startsWith('--niche='))?.split('=')[1] || 'all';
  const limitArg = Number(args.find((a) => a.startsWith('--limit='))?.split('=')[1] || 6);

  await executeCycle(nicheArg, limitArg);

  if (watchMode) {
    console.log('\n🔄 Watch mode active — scanning every 15 minutes (Ctrl+C to stop)...');
    setInterval(() => {
      executeCycle(nicheArg, limitArg).catch((err) =>
        console.error('Cycle error:', err)
      );
    }, 15 * 60 * 1000);
  }
}

main().catch((err) => {
  console.error('❌ Local Agent failed:', err);
  process.exit(1);
});

