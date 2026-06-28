import { cookies } from 'next/headers';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const AUTH_COOKIE_NAME = 'portfolio_admin_session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'super-secret-key-change-in-production';

function createToken(email) {
  const payload = JSON.stringify({ email, exp: Date.now() + 24 * 60 * 60 * 1000 });
  return Buffer.from(payload).toString('base64');
}

function verifyToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function authenticateAdmin(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = createToken(email);
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid credentials' };
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return false;
  }
  return true;
}
