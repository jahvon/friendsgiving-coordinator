import { cookies } from 'next/headers';

const GUEST_PASSWORD = process.env.GUEST_PASSWORD || 'friendsgiving2024';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2024';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function checkGuestAuth(): boolean {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('guest-auth');
  return authCookie?.value === 'authenticated';
}

export function checkAdminAuth(): boolean {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('admin-auth');
  return authCookie?.value === 'authenticated';
}

export function setGuestAuth(): void {
  const cookieStore = cookies();
  cookieStore.set('guest-auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export function setAdminAuth(): void {
  const cookieStore = cookies();
  cookieStore.set('admin-auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export function verifyGuestPassword(password: string): boolean {
  return password === GUEST_PASSWORD;
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function clearAuth(): void {
  const cookieStore = cookies();
  cookieStore.delete('guest-auth');
  cookieStore.delete('admin-auth');
}
