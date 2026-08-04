'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/ui';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const el = target;
  return (
    el.isContentEditable ||
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT'
  );
}

export function Hotkeys() {
  const router = useRouter();
  const pathname = usePathname();
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;

      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.code === 'Digit5') {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }

      if (pathname !== '/') return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      if (e.key === '1') router.push('/docs');
      else if (e.key === '2') router.push('/school');
      else if (e.key === '3') router.push('/faq');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [router, pathname, setSearchOpen]);

  return null;
}
