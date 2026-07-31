import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { matchRule } from './lib/auth/route-access';

/**
 * Серверный слой авторизации (L1, см. docs/auth-redirects.md).
 * Защищает ТОЛЬКО /admin/* по cookie `ucs-auth` (backend-сессия).
 * Все не-admin роуты обрабатывает клиентский `AuthRouter` (localStorage).
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const rule = matchRule(pathname);

  if (!rule || rule.layer !== 'server') {
    return NextResponse.next();
  }
  if (rule.access === 'public') {
    return NextResponse.next();
  }

  const token = request.cookies.get('ucs-auth')?.value;
  if (token) {
    return NextResponse.next();
  }

  const loginUrl = new URL(rule.guestRedirect || '/admin/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'],
};
