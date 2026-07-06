'use client';
import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notifications';

export function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e7eb] h-16">
      <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-xl font-bold text-[#1a56db]">UCS <span className="font-normal text-[#374151]">service</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/services" className="text-sm font-medium text-[#6b7280] no-underline hover:text-[#1a56db] transition-colors border-b-2 border-transparent hover:border-[#1a56db] py-1">
            Услуги
          </Link>
          <Link href="/bookings" className="text-sm font-medium text-[#6b7280] no-underline hover:text-[#1a56db] transition-colors border-b-2 border-transparent hover:border-[#1a56db] py-1">
            Мои записи
          </Link>
          <Link href="/chat/chat1" className="text-sm font-medium text-[#6b7280] no-underline hover:text-[#1a56db] transition-colors border-b-2 border-transparent hover:border-[#1a56db] py-1">
            Чат
          </Link>
          <Link href="/notifications" className="text-sm font-medium text-[#6b7280] no-underline hover:text-[#1a56db] transition-colors border-b-2 border-transparent hover:border-[#1a56db] py-1 relative">
            Уведомления
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-3 w-4 h-4 bg-[#dc2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <Link href="/profile" className="flex items-center gap-3 no-underline">
              <span className="text-sm text-[#6b7280] hidden md:inline">{user.name}</span>
              <div className="w-9 h-9 rounded-full bg-[#e8effa] text-[#1a56db] flex items-center justify-center font-semibold text-sm">
                {user.name.charAt(0)}
              </div>
            </Link>
          ) : (
            <Link href="/auth/login" className="text-sm font-semibold text-white bg-[#1a56db] px-4 py-2 rounded-md hover:bg-[#1648c0] no-underline transition-colors">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
