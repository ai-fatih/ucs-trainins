'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { AuthModal } from '@/components/auth/AuthModal';
import { NotificationsDropdown } from './NotificationsDropdown';
import { Menu, Bell, User, Download, ChevronDown, Settings, LogOut } from 'lucide-react';
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
  const { user, isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const deferredPrompt = useRef<any>(null);
  const [installable, setInstallable] = useState(false);

  // Header обёрнут в ssr: false — компонент монтируется только на клиенте,
  // useHydrated() не нужен, читаем стор напрямую.

  // Закрывать дропдаун по клику вне, по Escape и при смене маршрута
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [userMenuOpen]);

  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    console.info('[Header] logout');
    setUserMenuOpen(false);
    logout();
    router.replace('/');
  };

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

  const isStaff = user?.role === 'admin' || user?.role === 'company_admin' || user?.role === 'specialist';

  const isLanding = pathname === '/';

  const sections = navConfig.sections as Section[];

  const ADMIN_HEADER_NAV: NavTab[] = [
    { href: '/admin/dashboard', label: 'KPI' },
    { href: '/admin/requests', label: 'Заявки' },
    { href: '/admin/services', label: 'Услуги' },
    { href: '/admin/specialists', label: 'Специалисты' },
    { href: '/admin/schedule', label: 'Расписание' },
  ];

  const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/');

  // Section выбирается по самому длинному совпавшему URL (href раздела + его headerNav),
  // чтобы табы корректно показывались на /services, /bookings, /chat, /profile и т.д.
  const sectionTabs = isAdminArea && isStaff
    ? ADMIN_HEADER_NAV
    : (() => {
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
    { href: '/#services', label: 'Услуги' },
    { href: '/#school', label: 'Школа' },
    { href: '/#news', label: 'Новости' },
    { href: '/#reviews', label: 'Отзывы' },
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
              {tab.href === '/school/notifications' ? <Bell className="w-5 h-5" /> : tab.label}
            </Link>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <>
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

          <div className="flex items-center gap-1 shrink-0">
            {isAuthenticated && user ? (
              <>
                <NotificationsDropdown />

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-lg p-1 hover:bg-[#1a56db]/5 transition-all cursor-pointer"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                  >
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] inline-flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {user.name.charAt(0)}
                    </span>
                    <span className="hidden lg:block text-sm font-medium text-[#374151] max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className={`hidden lg:block w-3.5 h-3.5 text-[#6b7280] shrink-0 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-2 w-52 glass-strong rounded-xl py-2 shadow-xl border border-white/20 z-50"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#1a56db]/5 hover:text-[#1a56db] transition-colors no-underline"
                      >
                        <User className="w-4 h-4" /> Профиль
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#1a56db]/5 hover:text-[#1a56db] transition-colors no-underline"
                      >
                        <Settings className="w-4 h-4" /> Настройки
                      </Link>
                      <div className="my-1 border-t border-[#e5e7eb]" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#dc2626] hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Выход
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="glass-btn text-sm flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">Личный кабинет</span>
              </button>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/10 transition-all"
            aria-label="Открыть меню"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}