import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ADMIN_COOKIE_NAME,
  computeAdminToken,
  isAdminAuthenticated,
  verifyPasswordInput,
} from '@/lib/admin-auth';

export async function GET(request: Request) {
  const authenticated = await isAdminAuthenticated(request);
  return NextResponse.json({ authenticated });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (body.action === 'logout') {
      const cookieStore = await cookies();
      cookieStore.delete(ADMIN_COOKIE_NAME);
      return NextResponse.json({ authenticated: false });
    }

    const password = String(body.password || '');
    if (!verifyPasswordInput(password)) {
      return NextResponse.json(
        { error: 'Invalid admin password.' },
        { status: 401 }
      );
    }

    const token = computeAdminToken();
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ authenticated: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}

