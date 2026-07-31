'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useHydrated } from '@/lib/hooks/useHydrated';
import { isStaffRole, resolveClientRedirect, type AuthStatus } from '@/lib/auth/route-access';

/**
 * Центральный клиентский guard (слой L2, см. docs/auth-redirects.md).
 * Монтируется один раз в root-layout и принимает решения о редиректе
 * для всех не-admin роутов на каждой навигации.
 *
 * Правила:
 *  - до гидрации (useHydrated = false) НЕ редиректит — статус `unknown`;
 *  - /admin/* игнорирует (серверный слой: proxy.ts + api-client.me());
 *  - только router.replace() — одна запись в истории, нет цикла по «Назад».
 */
export function AuthRouter() {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.user?.role);
  const wasAuthenticated = useRef(isAuthenticated);

  useEffect(() => {
    if (!hydrated) return;

    // Logout transition (authenticated → guest): Header already handles
    // navigation to '/' via router.replace('/'). Skip to avoid fighting
    // with Header's redirect and the brief flash to /auth/login.
    if (wasAuthenticated.current && !isAuthenticated) {
      wasAuthenticated.current = isAuthenticated;
      return;
    }
    wasAuthenticated.current = isAuthenticated;

    const status: AuthStatus = !isAuthenticated ? 'guest' : isStaffRole(role) ? 'staff' : 'client';
    const to = resolveClientRedirect(pathname, status);
    if (to && to !== pathname) {
      console.info(`[AuthRouter] ${status} ${pathname} → ${to}`);
      router.replace(to);
    }
  }, [hydrated, pathname, isAuthenticated, role, router]);

  return null;
}
