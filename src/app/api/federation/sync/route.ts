import { NextResponse } from 'next/server';
import { initialPosts } from '@/lib/data'; // Fallback connection for the architectural mock

const FEDERATION_SECRET = process.env.FEDERATION_SECRET || 'SAKA_MESH_TEST_KEY_2026';

export async function GET(request: Request) {
  // 1. Verify Mesh Integrity
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${FEDERATION_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized Peer Node' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  console.log(`[FEDERATION SEARCH EVENT] Friendly node requested index synchronization for term: "${query}"`);

  // 2. Fast-Path filtering: Retrieve local indices. 
  // In a full DB environment, this would be an indexed Drizzle ILIKE scan.
  let results = initialPosts; // Assume this holds our local Drizzle ORM array
  if (query) {
      results = results.filter(p => 
          p.text.toLowerCase().includes(query.toLowerCase()) || 
          p.caption?.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );
  }

  // 3. Return the absolute top 10 most hyper-relevant local posts to protect bandwidth limits.
  return NextResponse.json({ posts: results.slice(0, 10) });
}
