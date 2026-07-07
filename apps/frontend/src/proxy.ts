import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/booking', '/bookings', '/profile', '/chat', '/notifications', '/review'];
const adminRoutes = ['/admin'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('ucs-auth')?.value;
  const isAuthenticated = !!token;
  const pathname = request.nextUrl.pathname;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/booking/:path*', '/bookings/:path*', '/profile/:path*', '/chat/:path*', '/notifications/:path*', '/review/:path*', '/admin/:path*'],
};
