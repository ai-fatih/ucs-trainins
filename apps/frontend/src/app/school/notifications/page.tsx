'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, CheckCheck, X } from 'lucide-react';
import { useNotificationStore } from '@/stores/notifications';
import type { AppNotification } from '@/types';

const SEED: Omit<AppNotification, 'read'>[] = [
  { id: 'schn1', title: 'Новый курс доступен', body: 'Курс «Решение ошибок RK7» теперь доступен для прохождения.', type: 'reminder', createdAt: new Date(Date.now() - 2 * 3600e3).toISOString() },
  { id: 'schn2', title: 'Достижение получено', body: 'Вы получили бейдж «Первый шаг»!', type: 'system', createdAt: new Date(Date.now() - 24 * 3600e3).toISOString() },
  { id: 'schn3', title: 'Напоминание', body: 'Продолжите обучение на курсе «ЕГАИС: Учёт алкоголя».', type: 'reminder', createdAt: new Date(Date.now() - 48 * 3600e3).toISOString() },
];

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'только что';
  if (mins < 60) return `${mins} мин назад`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'вчера';
  return `${days} дн назад`;
}

export default function NotificationsPage() {
  const { notifications, unreadCount, addNotification, markRead, markAllRead, removeNotification } = useNotificationStore();
  const seeded = useRef(false);

  useEffect(() => {
    if (!seeded.current) {
      seeded.current = true;
      if (useNotificationStore.getState().notifications.length === 0) {
        SEED.forEach((n) => addNotification({ ...n, read: false }));
      }
    }
  }, [addNotification]);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/school" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] transition-colors">
          <ArrowLeft className="w-4 h-4" /> В школу
        </Link>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a56db] hover:underline cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" /> Отметить все прочитанными
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Уведомления</h1>
        {unreadCount > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e8effa] text-[#1a56db]">
            {unreadCount} новых
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Bell className="w-10 h-10 mx-auto text-[#9ca3af] mb-3" />
          <p className="text-[#6b7280]">Уведомлений пока нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...notifications]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`glass-card p-4 flex items-start gap-3 group ${!n.read ? 'border-l-4 border-l-[#1a56db] cursor-pointer hover:bg-white/60 transition-colors' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-[#f9fafb]' : 'bg-[#f0f4ff]'}`}>
                  <Bell className={`w-5 h-5 ${n.read ? 'text-[#9ca3af]' : 'text-[#1a56db]'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? 'text-[#6b7280]' : 'font-semibold text-[#374151]'}`}>{n.title}</p>
                  <p className="text-xs text-[#9ca3af] mt-0.5">{n.body}</p>
                  <p className="text-[10px] text-[#9ca3af] mt-1">{formatRelative(n.createdAt)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                  aria-label="Удалить уведомление"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9ca3af] hover:text-[#dc2626] hover:bg-[#fef2f2] transition-colors opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
