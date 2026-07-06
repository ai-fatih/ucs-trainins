'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
  { href: '/admin', label: '📊 Дашборд' },
  { href: '/admin/schedule', label: '📅 Расписание' },
  { href: '/services', label: '📋 Услуги' },
  { href: '/bookings', label: '📝 Записи' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 bg-white border-r border-[#e5e7eb] p-4 hidden lg:block">
      <div className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wide px-3 pb-2">Навигация</div>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors no-underline',
            pathname === item.href
              ? 'bg-[#e8effa] text-[#1a56db] font-semibold border-l-[3px] border-[#1a56db]'
              : 'text-[#6b7280] hover:bg-[#f9fafb] border-l-[3px] border-transparent'
          )}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
