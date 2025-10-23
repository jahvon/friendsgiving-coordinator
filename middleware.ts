import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login pages and API routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Check admin auth for admin routes
  if (pathname.startsWith('/admin')) {
    const adminAuth = request.cookies.get('admin-auth');
    if (!adminAuth || adminAuth.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Check guest auth for all other routes
  const guestAuth = request.cookies.get('guest-auth');
  const adminAuth = request.cookies.get('admin-auth');

  if (!guestAuth?.value && !adminAuth?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
