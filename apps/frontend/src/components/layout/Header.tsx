'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download } from 'lucide-react';
import { SidebarSearch } from './SidebarSearch';
import navConfig from '@/data/navigation.json';

interface NavTab {
  href: string;
  label: string;
}

type Section = {
  id: string;
  label: string;
  icon: string;
  href: string;
  groups?: { label: string; icon: string; items: { href: string; label: string }[] }[];
  headerNav?: NavTab[] | null;
};

export function Header() {
  const pathname = usePathname();
  const deferredPrompt = useRef<any>(null);
  const [installable, setInstallable] = useState(false);

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

  const isLanding = pathname === '/';

  const sections = navConfig.sections as Section[];

  // Section выбирается по самому длинному совпавшему URL (href раздела + его headerNav),
  // чтобы табы корректно показывались на /docs/*, /school/* и т.д.
  const sectionTabs = (() => {
    let best: { section: Section; len: number } | null = null;
    for (const s of sections) {
      if (!s.headerNav || s.headerNav.length === 0) continue;
      const urls = [s.href, ...s.headerNav.map((t) => t.href)];
      for (const u of urls) {
        if (u === '/') continue;
        if (pathname === u || pathname.startsWith(u + '/')) {
          if (!best || u.length > best.len) best = { section: s, len: u.length };
        }
      }
    }
    return best?.section.headerNav ?? null;
  })();

  const HEADER_NAV: NavTab[] = [
    { href: '/#about', label: 'О нас' },
    { href: '/#docs', label: 'Документация' },
    { href: '/#school', label: 'Школа' },
  ];

  const isActiveTab = (href: string) => {
    if (href === pathname) return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const renderNavLinks = () => {
    if (isLanding) {
      return (
        <>
          {HEADER_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium px-3 py-2 rounded-lg no-underline text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5 transition-all whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </>
      );
    }

    if (sectionTabs) {
      return (
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {sectionTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`text-sm font-medium px-3 py-2 rounded-lg no-underline whitespace-nowrap transition-all ${
                isActiveTab(tab.href)
                  ? 'text-[#1a56db] bg-[#1a56db]/10 font-semibold'
                  : 'text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      );
    }

    return null;
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

        {installable && (
          <button
            onClick={handleInstall}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0d9488] bg-[rgba(13,148,136,0.1)] hover:bg-[rgba(13,148,136,0.2)] transition-all border border-[rgba(13,148,136,0.2)] shrink-0"
            title="Установить приложение"
          >
            <Download className="w-4 h-4" />
            Установить
          </button>
        )}

        <div className="hidden md:block shrink-0 max-w-[200px]">
          <SidebarSearch />
        </div>
      </div>
    </header>
  );
}
