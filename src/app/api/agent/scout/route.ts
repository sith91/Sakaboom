import { NextResponse } from 'next/server';
import { runLocalViralAgent, ViralAgentConfig } from '@/ai/flows/viral-agent-flow';
import fs from 'fs/promises';
import path from 'path';
import { isAdminAuthenticated } from '@/lib/admin-auth';

const CACHE_FILE = path.join(process.cwd(), '.sakaboom-agent-cache.json');

async function readAgentCache() {
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { posts: [], lastRun: null, logs: [], autoPilot: false };
  }
}

async function writeAgentCache(data: any) {
  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist local agent cache:', err);
  }
}

export async function GET() {
  const cache = await readAgentCache();

  // Check if local Ollama daemon is reachable
  let ollamaOnline = false;
  try {
    const r = await fetch('http://127.0.0.1:11434/api/tags', {
      signal: AbortSignal.timeout(1200),
    });
    ollamaOnline = r.ok;
  } catch {
    ollamaOnline = false;
  }

  return NextResponse.json({
    ...cache,
    ollamaOnline,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const existing = await readAgentCache();
    const isAdmin = await isAdminAuthenticated(request);

    // Require admin authentication unless Auto-Pilot is already enabled on the backend
    if (!isAdmin && !existing.autoPilot) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin session required to control Viral Scout Agent.' },
        { status: 401 }
      );
    }

    // 1. Admin Action: Publish specific approved posts to the live user feed
    if (body.action === 'publish' && Array.isArray(body.posts)) {
      const mergedPosts = [...body.posts];
      for (const oldPost of existing.posts || []) {
        if (!mergedPosts.some((p: any) => p.url === oldPost.url)) {
          mergedPosts.push(oldPost);
        }
      }
      const updated = {
        ...existing,
        posts: mergedPosts.slice(0, 60),
        lastRun: new Date().toISOString(),
      };
      await writeAgentCache(updated);
      return NextResponse.json(updated);
    }

    // 2. Admin Action: Remove a post from the live user feed
    if (body.action === 'delete' && body.url) {
      const filtered = (existing.posts || []).filter((p: any) => p.url !== body.url);
      const updated = {
        ...existing,
        posts: filtered,
      };
      await writeAgentCache(updated);
      return NextResponse.json(updated);
    }

    // 3. Admin Action: Toggle Auto-Pilot setting
    if (body.action === 'toggle-autopilot') {
      const updated = {
        ...existing,
        autoPilot: Boolean(body.autoPilot),
      };
      await writeAgentCache(updated);
      return NextResponse.json(updated);
    }

    // 4. Default: Run the Local Viral Agent scan
    const config = body as ViralAgentConfig & { autoPublish?: boolean };
    const result = await runLocalViralAgent(config);

    // Only write to live public feed cache if autoPublish !== false
    if (config.autoPublish !== false) {
      const mergedPosts = [...result.posts];
      for (const oldPost of existing.posts || []) {
        if (!mergedPosts.some((p) => p.url === oldPost.url)) {
          mergedPosts.push(oldPost);
        }
      }

      const updatedCache = {
        ...existing,
        posts: mergedPosts.slice(0, 60),
        lastRun: result.timestamp,
        logs: result.logs,
        engineUsed: result.engineUsed,
        scannedCount: result.scannedCount,
      };

      await writeAgentCache(updatedCache);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Viral Agent Route Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Local Viral Agent failed to execute.' },
      { status: 500 }
    );
  }
}
