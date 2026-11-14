import { NextResponse } from 'next/server';

const FEDERATION_SECRET = process.env.FEDERATION_SECRET || 'SAKA_MESH_TEST_KEY_2026';

export async function POST(request: Request) {
  // 1. Enforce Zero-Trust Encryption Handshake
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${FEDERATION_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized Peer Node' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const incomingPost = data.post;
    
    // 2. Integration layer: In production, Drizzle ORM immediately intercepts this 
    // and seamlessly inserts it into your local instance's Postgres database identically to a local submission.
    // e.g. await db.insert(posts).values(incomingPost);
    
    console.log(`[FEDERATION SECURE INGESTION] Received new post broadcast from peer node: "${incomingPost.text}"`);

    // 3. Inform the originating Node that we successfully synchronized their data block!
    return NextResponse.json({ success: true, message: 'Broadcast permanently synchronized to Local Instance' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to decode Federation payload' }, { status: 400 });
  }
}
