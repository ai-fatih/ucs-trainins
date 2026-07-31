'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, CheckCheck, ChevronRight } from 'lucide-react';
import { useNotificationStore } from '@/stores/notifications';

const typeMeta: Record<string, { label: string; color: string }> = {
  booking: { label: 'Запись', color: 'bg-[#e8effa] text-[#1a56db]' },
  message: { label: 'Чат', color: 'bg-[#ccfbf1] text-[#0d9488]' },
  reminder: { label: 'Напоминание', color: 'bg-[#fef3c7] text-[#d97706]' },
  review: { label: 'Отзыв', color: 'bg-[#f3e8ff] text-[#7c3aed]' },
  system: { label: 'Система', color: 'bg-[#f3f4f6] text-[#6b7280]' },
};

export function NotificationsDropdown() {
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const seed = useNotificationStore((s) => s.seed);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const seededRef = useRef(false);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    const before = useNotificationStore.getState().notifications.length;
    seed();
    const after = useNotificationStore.getState().notifications.length;
    if (before === 0 && after > 0) {
      console.info(`[Notifications] seeded: ${after} items`);
    }
  }, [seed]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/10 transition-all cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Уведомления"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#dc2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-xl py-2 shadow-xl border border-white/20 z-50"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#e5e7eb]">
            <span className="text-sm font-semibold text-[#111827]">Уведомления</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#1a56db] hover:underline cursor-pointer flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Прочитать все
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-[#6b7280] text-center">Уведомлений нет</p>
          ) : (
            <div className="max-h-[320px] overflow-y-auto">
              {notifications.slice(0, 6).map((n) => {
                const meta = typeMeta[n.type] || typeMeta.system;
                return (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#1a56db]/5 transition-colors cursor-pointer ${n.read ? 'opacity-60' : ''}`}
                  >
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 mt-0.5 ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-[#111827] truncate">{n.title}</span>
                      <span className="block text-xs text-[#6b7280] truncate">{n.body}</span>
                      <span className="block text-[10px] text-[#9ca3af] mt-0.5">
                        {new Date(n.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1 px-4 py-2.5 text-sm font-semibold text-[#1a56db] hover:bg-[#1a56db]/5 transition-colors no-underline border-t border-[#e5e7eb]"
          >
            Все уведомления <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
