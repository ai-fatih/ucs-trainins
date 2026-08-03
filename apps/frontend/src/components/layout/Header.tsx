'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download, Search } from 'lucide-react';
import { useUIStore } from '@/stores/ui';
import { Tooltip } from '@/components/ui/Tooltip';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

interface NavTab {
  href: string;
  label: string;
}

export function Header() {
  const pathname = usePathname();
  const deferredPrompt = useRef<any>(null);
  const [installable, setInstallable] = useState(false);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);

  // Header обёрнут в ssr: false — компонент монтируется только на клиенте

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setInstallable(true);
    };
    const handleInstalled = () => {
      deferredPrompt.current = null;
      setInstallable(false);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    deferredPrompt.current.userChoice.then((result: { outcome: string }) => {
      if (result.outcome === 'accepted') {
        deferredPrompt.current = null;
        setInstallable(false);
      }
    });
  };

  const HEADER_NAV: NavTab[] = [
    { href: '/docs', label: 'Документация' },
    { href: '/school', label: 'Школа' },
  ];

  const TAB_HINTS: Record<string, string> = {
    '/docs': 'Инструкции и пошаговые руководства по программам r_keeper',
    '/school': 'Обучающие курсы и тренажёры на реальных кейсах',
  };

  const isActiveTab = (href: string) => {
    if (href === pathname) return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const renderNavLinks = () => {
    return (
      <>
        {HEADER_NAV.map((link) => {
          const active = isActiveTab(link.href);
          return (
            <Tooltip key={link.href} content={TAB_HINTS[link.href] ?? link.label} side="bottom">
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`text-sm font-medium px-3 py-2 rounded-lg no-underline whitespace-nowrap transition-all relative ${
                  active
                    ? 'text-[#1a56db] bg-[#1a56db]/10 font-semibold'
                    : 'text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-[#1a56db] to-[#0d9488]" />
                )}
              </Link>
            </Tooltip>
          );
        })}
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-white/20">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="no-underline shrink-0 mr-4"
        >
          <span className="text-lg font-extrabold bg-gradient-to-r from-[#1a56db] to-[#0d9488] bg-clip-text text-transparent">
            UCS service
          </span>
        </Link>
        <nav className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {renderNavLinks()}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <kbd className="hidden lg:inline-flex items-center px-1.5 h-6 rounded-md border border-[#d1d5db] bg-white/60 text-[10px] font-medium text-[#6b7280] select-none">
            Ctrl + 5
          </kbd>
          <Tooltip
            content="Поиск по сайту: инструкции, курсы, кейсы. Быстрый доступ — Ctrl + 5"
            side="bottom"
          >
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/10 transition-all shrink-0"
              aria-label="Поиск (Ctrl + 5)"
              title="Поиск (Ctrl + 5)"
            >
              <Search className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {installable && (
          <Tooltip content="Установить портал как приложение — инструкции и курсы будут доступны даже без интернета" side="bottom">
            <button
              onClick={handleInstall}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0d9488] bg-[rgba(13,148,136,0.1)] hover:bg-[rgba(13,148,136,0.2)] transition-all border border-[rgba(13,148,136,0.2)] shrink-0"
              title="Установить приложение"
            >
              <Download className="w-4 h-4" />
              Установить
            </button>
          </Tooltip>
        )}
      </div>
    </header>
  );
}
