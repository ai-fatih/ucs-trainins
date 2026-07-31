import type { UserRole } from '@/types';

/**
 * Единый конфиг доступа к роутам (см. docs/auth-redirects.md).
 * Потребляется двумя слоями:
 *  - серверным: `src/proxy.ts` (middleware, cookie `ucs-auth`) — только /admin/*
 *  - клиентским: `src/components/layout/AuthRouter.tsx` (localStorage `ucs-auth`)
 */

export type AuthStatus = 'unknown' | 'guest' | 'client' | 'staff';

export type AccessType = 'public' | 'guest-only' | 'protected' | 'staff-only';

export type Layer = 'server' | 'client';

export interface RouteRule {
  /** Шаблон пути: '/' , '/chat/:path*' , '*' = fallback (длинный паттерн побеждает) */
  pattern: string;
  access: AccessType;
  /** Какой слой это enforce: server = middleware (cookie), client = AuthRouter (localStorage) */
  layer: Layer;
  /** guest-only → куда отправить авторизованного (роль-аваресность задаётся в resolver) */
  authedRedirect?: string;
  /** protected/staff-only → куда отправить гостя */
  guestRedirect?: string;
  /** staff-only → куда отправить client(user) */
  clientRedirect?: string;
  /** protected → куда отправить staff */
  staffRedirect?: string;
  note?: string;
}

export const STAFF_ROLES: UserRole[] = ['admin', 'company_admin', 'specialist'];

export function isStaffRole(role?: string | null): boolean {
  return !!role && (STAFF_ROLES as string[]).includes(role);
}

export function roleRedirect(status: AuthStatus, fallback: string): string {
  return status === 'staff' ? '/admin/dashboard' : fallback;
}

export const ROUTE_RULES: RouteRule[] = [
  // ── Клиентский слой (AuthRouter, localStorage) ────────────────────────────
  { pattern: '/', access: 'guest-only', layer: 'client', note: 'лендинг: авторизованным → дашборд роли' },
  { pattern: '/auth', access: 'guest-only', layer: 'client', note: 'хаб входа' },
  { pattern: '/auth/login', access: 'guest-only', layer: 'client' },
  { pattern: '/auth/register', access: 'guest-only', layer: 'client' },
  { pattern: '/dashboard', access: 'protected', layer: 'client', staffRedirect: '/admin/dashboard', note: 'клиентский дашборд' },
  { pattern: '/booking', access: 'protected', layer: 'client' },
  { pattern: '/bookings', access: 'protected', layer: 'client' },
  { pattern: '/chat/:path*', access: 'protected', layer: 'client' },
  { pattern: '/profile', access: 'protected', layer: 'client' },
  { pattern: '/settings', access: 'protected', layer: 'client' },
  { pattern: '/notifications', access: 'protected', layer: 'client' },
  { pattern: '/review', access: 'protected', layer: 'client' },
  { pattern: '/school/:path*', access: 'protected', layer: 'client' },

  // ── Серверный слой (proxy.ts, cookie ucs-auth) ────────────────────────────
  { pattern: '/admin/login', access: 'public', layer: 'server', note: 'вход в админку (backend cookie)' },
  { pattern: '/admin/:path*', access: 'staff-only', layer: 'server', guestRedirect: '/admin/login', note: 'staff-only, cookie' },

  // ── Fallback ──────────────────────────────────────────────────────────────
  { pattern: '*', access: 'public', layer: 'client', note: 'docs, services, specialists, request, юр. страницы, feedback' },
];

function patternToRegex(pattern: string): RegExp {
  if (pattern === '*') return /.*/;
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replace(/:path\*/g, '(?:/.*)?')}$`);
}

const compiled = ROUTE_RULES.map((rule) => ({ rule, re: patternToRegex(rule.pattern) }));

/** Longest-pattern match */
export function matchRule(pathname: string): RouteRule | null {
  let best: { rule: RouteRule; len: number } | null = null;
  for (const { rule, re } of compiled) {
    if (re.test(pathname) && (!best || rule.pattern.length > best.len)) {
      best = { rule, len: rule.pattern.length };
    }
  }
  return best?.rule ?? null;
}

const LOGIN = (pathname: string) => `/auth/login?redirect=${encodeURIComponent(pathname)}`;

/**
 * Клиентский resolver: для pathname и статуса авторизации возвращает целевой URL
 * или null (редирект не нужен). `unknown` (до гидрации) — никогда не редиректит.
 * Серверные роуты (/admin/*) — игнорирует: их обрабатывает proxy.ts.
 */
export function resolveClientRedirect(pathname: string, status: AuthStatus): string | null {
  if (status === 'unknown') return null;
  const rule = matchRule(pathname);
  if (!rule || rule.layer !== 'client') return null;
  return resolveRule(pathname, status, rule);
}

export function resolveRule(pathname: string, status: AuthStatus, rule: RouteRule): string | null {
  if (rule.access === 'public') return null;

  if (rule.access === 'guest-only') {
    if (status === 'guest') return null;
    const to = roleRedirect(status, rule.authedRedirect ?? '/dashboard');
    return to === pathname ? null : to;
  }

  if (rule.access === 'protected') {
    if (status === 'guest') return rule.guestRedirect ?? LOGIN(pathname);
    if (status === 'staff' && rule.staffRedirect) return rule.staffRedirect;
    return null;
  }

  // staff-only
  if (status === 'guest') return rule.guestRedirect ?? LOGIN(pathname);
  if (status === 'client' && rule.clientRedirect) return rule.clientRedirect;
  return null;
}
