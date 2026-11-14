import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { businesses as initialBusinesses, SocialPost } from '@/lib/business-data';

const POSTS_STORE_FILE = path.join(process.cwd(), '.sakaboom-posts-store.json');
const AGENT_CACHE_FILE = path.join(process.cwd(), '.sakaboom-agent-cache.json');

const SEED_POSTS: SocialPost[] = initialBusinesses.flatMap((biz) => biz.socialPosts);

async function readPostsStore(): Promise<SocialPost[]> {
  try {
    const raw = await fs.readFile(POSTS_STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Initialize store with seed posts on first access
  }
  await writePostsStore(SEED_POSTS);
  return SEED_POSTS;
}

async function writePostsStore(posts: SocialPost[]): Promise<void> {
  try {
    await fs.writeFile(POSTS_STORE_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Posts API] Could not write .sakaboom-posts-store.json:', err);
  }
}

export async function GET() {
  const storedPosts = await readPostsStore();

  // Also read live agent posts from .sakaboom-agent-cache.json
  let agentPosts: SocialPost[] = [];
  let autoPilot = false;
  try {
    const rawAgent = await fs.readFile(AGENT_CACHE_FILE, 'utf-8');
    const parsedAgent = JSON.parse(rawAgent);
    if (Array.isArray(parsedAgent.posts)) {
      agentPosts = parsedAgent.posts;
    }
    autoPilot = Boolean(parsedAgent.autoPilot);
  } catch {}

  // Merge agent posts with stored community posts without duplicates
  const seenUrls = new Set(storedPosts.map((p) => p.url));
  const freshAgentPosts = agentPosts.filter((ap) => !seenUrls.has(ap.url));

  return NextResponse.json({
    posts: storedPosts,
    queuedAgentPosts: freshAgentPosts.slice(0, 2),
    publishedAgentPosts: freshAgentPosts.slice(2),
    autoPilot,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const posts = await readPostsStore();

    // 1. Boom (Upvote) a Post
    if (body.action === 'boom' && body.url) {
      let found = false;
      const updated = posts.map((p) => {
        if (p.url === body.url) {
          found = true;
          return {
            ...p,
            likes: (typeof p.likes === 'number' ? p.likes : 0) + 1,
          };
        }
        return p;
      });

      // If the boomed post came from the agent cache and wasn't in the main store yet, add it
      if (!found && body.post) {
        updated.unshift({
          ...body.post,
          likes: (typeof body.post.likes === 'number' ? body.post.likes : 0) + 1,
        });
      }

      await writePostsStore(updated);
      return NextResponse.json({ ok: true, posts: updated });
    }

    // 2. Add a Perspective / Take to an Existing Post
    if (body.action === 'perspective' && body.url && body.text) {
      const newSub = {
        submitter: body.submitter || 'Curator',
        description: String(body.text).trim(),
        timestamp: new Date().toISOString(),
        reputation: 150,
      };

      let found = false;
      const updated = posts.map((p) => {
        if (p.url === body.url) {
          found = true;
          return {
            ...p,
            submissions: [...(p.submissions || []), newSub],
          };
        }
        return p;
      });

      if (!found && body.post) {
        updated.unshift({
          ...body.post,
          submissions: [...(body.post.submissions || []), newSub],
        });
      }

      await writePostsStore(updated);
      return NextResponse.json({ ok: true, posts: updated });
    }

    // 3. Curate / Submit a New Post (or Merge Perspective if URL Already Exists)
    if (body.action === 'create' && body.post) {
      const incoming = body.post;
      const existingIdx = posts.findIndex((p) => p.url === incoming.url);

      if (existingIdx > -1) {
        const newSub = {
          submitter: incoming.submitter || 'Curator',
          description: incoming.caption || incoming.text || incoming.content,
          timestamp: new Date().toISOString(),
          reputation: 120,
        };
        posts[existingIdx] = {
          ...posts[existingIdx],
          submissions: [...(posts[existingIdx].submissions || []), newSub],
        };
        await writePostsStore(posts);
        return NextResponse.json({ ok: true, merged: true, post: posts[existingIdx] });
      } else {
        const created: SocialPost = {
          platform: incoming.platform || 'web',
          content: incoming.caption || incoming.text || incoming.content,
          likes: 1,
          url: incoming.url,
          image: incoming.media || incoming.image,
          video: incoming.video,
          submitter: incoming.submitter || 'Curator',
          submitterReputation: 150,
          verificationScore: 98,
          upvotesCount: 1,
          downvotesCount: 0,
          tags: incoming.tags || ['indexed', 'frontpage'],
          trendingReason: 'Newly curated by community scout.',
          viralScore: 92,
          sentiment: 'bullish',
          submissions: [
            {
              submitter: incoming.submitter || 'Curator',
              description: incoming.caption || incoming.text || incoming.content,
              timestamp: new Date().toISOString(),
            },
          ],
          type: incoming.type,
          eventDate: incoming.eventDate,
          venue: incoming.venue,
          address: incoming.address,
          authorHandle: incoming.authorHandle,
        };
        const updated = [created, ...posts];
        await writePostsStore(updated);
        return NextResponse.json({ ok: true, merged: false, post: created });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to persist post update' },
      { status: 500 }
    );
  }
}

