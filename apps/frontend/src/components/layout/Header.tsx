'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notifications';
import { AuthModal } from '@/components/auth/AuthModal';
import { Menu, X, Bell, LogOut, User, LayoutDashboard } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'company_admin';
  const isSpecialist = user?.role === 'specialist';
  const isStaff = isAdmin || isSpecialist;

  const dashboardHref = !isAuthenticated
    ? '/'
    : isAdmin
      ? '/admin/requests'
      : isSpecialist
        ? '/admin/requests'
        : '/bookings';

  const navLinks = isAuthenticated
    ? isStaff
      ? [
          { href: '/services', label: 'Услуги' },
          { href: '/specialists', label: 'Специалисты' },
          { href: '/admin/requests', label: 'Заявки' },
        ]
      : [
          { href: '/services', label: 'Услуги' },
          { href: '/bookings', label: 'Мои записи' },
          { href: '/specialists', label: 'Специалисты' },
        ]
    : [
        { href: '/services', label: 'Услуги' },
        { href: '/specialists', label: 'Специалисты' },
      ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className="sticky top-0 z-50 glass-strong border-b border-white/20 h-16">
        <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="text-xl font-bold text-[#1a56db]">UCS <span className="font-normal text-[#374151]">service</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-3 py-2 rounded-lg no-underline transition-all ${
                  isActive(link.href)
                    ? 'text-[#1a56db] bg-[#1a56db]/10'
                    : 'text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
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
                  href={dashboardHref}
                  className="hidden md:flex items-center gap-2 no-underline"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center font-semibold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-[#374151] max-w-[100px] truncate">{user.name}</span>
                </Link>

                <button
                  onClick={logout}
                  className="hidden md:flex w-9 h-9 rounded-lg items-center justify-center text-[#6b7280] hover:text-[#dc2626] hover:bg-red-50 transition-all"
                  title="Выйти"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="glass-btn text-sm"
              >
                Войти
              </button>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/10 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden glass-strong border-t border-white/20 p-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium px-4 py-3 rounded-lg no-underline transition-all ${
                    isActive(link.href)
                      ? 'text-[#1a56db] bg-[#1a56db]/10'
                      : 'text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && user && (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium px-4 py-3 rounded-lg text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5 no-underline transition-all flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Личный кабинет
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="text-sm font-medium px-4 py-3 rounded-lg text-[#dc2626] hover:bg-red-50 transition-all flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" /> Выйти
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <button
                  onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                  className="glass-btn text-sm mt-2"
                >
                  Войти
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
