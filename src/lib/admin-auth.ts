import crypto from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'sakaboom_admin_session';

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'sakaboom-admin';
}

export function computeAdminToken(): string {
  const secret = getAdminPassword();
  return crypto
    .createHmac('sha256', 'sakaboom-node-salt-2026')
    .update(secret)
    .digest('hex');
}

export function verifyPasswordInput(input: string): boolean {
  const expected = getAdminPassword();
  return input === expected;
}

export async function isAdminAuthenticated(request?: Request): Promise<boolean> {
  // 1. Check x-admin-key header for CLI / automated scripts
  if (request) {
    const headerKey = request.headers.get('x-admin-key');
    if (headerKey && headerKey === getAdminPassword()) {
      return true;
    }
  }

  // 2. Check HttpOnly session cookie
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!sessionCookie) return false;
    return sessionCookie === computeAdminToken();
  } catch {
    return false;
  }
}

