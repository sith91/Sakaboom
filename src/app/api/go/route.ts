import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const postId = searchParams.get('postId');

  if (!url) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // METHOD 2: API Redirect Tracking
  // Here is where heavy-duty backend tracking occurs.
  // In a full production environment with @supabase/ssr, you would:
  // 1. Verify the session token from cookies to prevent bot forging.
  // 2. Check a Rate Limiter (Redis/Upstash) based on IP.
  // 3. Perform atomic increment: db.update(posts).set({ totalBooms: sql`total_booms + 1` }).where(eq(posts.id, postId));
  
  console.log(`[Tracking] Click logged for Post ID: ${postId}. User navigated to ${url}`);

  // 302 Redirect natively bounces the user to the destination seamlessly
  return NextResponse.redirect(url);
}
