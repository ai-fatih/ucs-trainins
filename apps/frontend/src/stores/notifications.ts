'use client';
import { create } from 'zustand';
import type { AppNotification } from '@/types';
import notificationsData from '@/data/notifications.json';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  /** Заполнить стор mock-уведомлениями (заглушка до backend). Идемпотентно. */
  seed: () => void;
  addNotification: (n: AppNotification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  seed: () => {
    if (get().notifications.length > 0) return;
    const items = notificationsData as AppNotification[];
    set({
      notifications: items,
      unreadCount: items.filter((n) => !n.read).length,
    });
  },
  addNotification: (n) =>
    set((s) => ({
      notifications: [n, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    })),
  markRead: (id) =>
    set((s) => {
      const updated = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
    }),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((s) => {
      const updated = s.notifications.filter((n) => n.id !== id);
      return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
    }),
}));
