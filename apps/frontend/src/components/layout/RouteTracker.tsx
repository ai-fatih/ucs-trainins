'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';

export function RouteTracker() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      logger.info(`route: ${pathname}`);
      prevPath.current = pathname;
    }
  }, [pathname]);

  return null;
}
