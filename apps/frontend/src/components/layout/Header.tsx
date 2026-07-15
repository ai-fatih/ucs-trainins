'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notifications';
import { useUIStore } from '@/stores/ui';
import { AuthModal } from '@/components/auth/AuthModal';
import { Menu, X, Bell, LogOut, User, Download } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const pathname = usePathname();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const [authOpen, setAuthOpen] = useState(false);
  const deferredPrompt = useRef<any>(null);
  const [installable, setInstallable] = useState(false);

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

  const HEADER_NAV = [
    { href: '/#about', label: 'О нас' },
    { href: '/#services', label: 'Услуги' },
    { href: '/#news', label: 'Новости' },
    { href: '/#reviews', label: 'Отзывы' },
    { href: '/#faq', label: 'Вопросы' },
  ] as const;

  const avatarHref = !isAuthenticated ? '/' : isStaff ? '/admin/dashboard' : '/dashboard';

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

    return null;
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-strong border-b border-white/20 h-16">
        <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
          <nav className="hidden lg:flex items-center gap-1">
            {renderNavLinks()}
          </nav>

          {installable && (
            <button
              onClick={handleInstall}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0d9488] bg-[rgba(13,148,136,0.1)] hover:bg-[rgba(13,148,136,0.2)] transition-all border border-[rgba(13,148,136,0.2)]"
              title="Установить приложение"
            >
              <Download className="w-4 h-4" />
              Установить
            </button>
          )}

          <div className="flex items-center gap-1">
            {isAuthenticated && user ? (
              <>
                <Link
                  href="/notifications"
                  className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/10 transition-all no-underline"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#dc2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <Link
                  href={avatarHref}
                  className="hidden lg:flex items-center gap-2 no-underline"
                >
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] inline-flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {user.name.charAt(0)}
                  </span>
                  <span className="text-sm font-medium text-[#374151] max-w-[100px] truncate">{user.name}</span>
                </Link>
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
