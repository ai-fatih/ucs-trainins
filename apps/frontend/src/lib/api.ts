import { mockDB, MockApiError } from '@/lib/mock-db';
import specialistsData from '@/data/specialists.json';
import slotsData from '@/data/slots.json';
import bookingsData from '@/data/bookings.json';
import chatsData from '@/data/chats.json';
import reviewsData from '@/data/reviews.json';
import adminStatsData from '@/data/admin-stats.json';
import employeesData from '@/data/employees.json';
import notifChannelsData from '@/data/notification-channels.json';
import notifEventsData from '@/data/notification-events.json';
import type { Service, Specialist, Slot, Booking, ChatRoom, Review, AdminDashboard, Employee, NotificationSetting, NotificationEvent } from '@/types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function wrap<T>(fn: () => T): Promise<T> {
  await delay(200 + Math.random() * 200);
  const result = fn();
  return result;
}

export const api = {
  services: {
    list: async (): Promise<Service[]> => {
      return wrap(() => mockDB.services);
    },
  },

  specialists: {
    list: async (): Promise<Specialist[]> => {
      return wrap(() => specialistsData as Specialist[]);
    },
  },

  slots: {
    getByDate: async (date: string): Promise<Slot[]> => {
      return wrap(() => (slotsData as Record<string, Slot[]>)[date] || []);
    },
  },

  bookings: {
    list: async (): Promise<Booking[]> => {
      return wrap(() => {
        const seeded = bookingsData as Booking[];
        const created = mockDB.listBookings();
        return [...created, ...seeded.filter((s) => !created.find((c) => c.id === s.id))];
      });
    },
    create: async (data: Partial<Booking>): Promise<Booking> => {
      return wrap(() => mockDB.createBooking(data as any));
    },
    cancel: async (id: string): Promise<void> => {
      return wrap(() => { mockDB.cancelBooking(id); });
    },
  },

  employees: {
    list: async (): Promise<Employee[]> => {
      return wrap(() => employeesData as Employee[]);
    },
  },

  auth: {
    login: async (email: string, password: string): Promise<{ user: any }> => {
      return wrap(() => {
        const user = mockDB.login(email, password);
        return { user };
      });
    },
    register: async (data: { name: string; email: string; phone: string; password: string; userType?: 'company' | 'individual' }): Promise<{ user: any }> => {
      return wrap(() => {
        const user = mockDB.register(data);
        return { user };
      });
    },
  },

  chat: {
    list: async (): Promise<ChatRoom[]> => {
      return wrap(() => chatsData as ChatRoom[]);
    },
    getMessages: async (chatId: string) => {
      return wrap(() => {
        const chat = (chatsData as any[]).find((c) => c.id === chatId);
        return chat?.messages || [];
      });
    },
  },

  reviews: {
    list: async (): Promise<Review[]> => {
      return wrap(() => reviewsData as Review[]);
    },
    create: async (data: { bookingId: string; rating: number; text: string }) => {
      return wrap(() => ({ id: `r${Date.now()}`, ...data, date: new Date().toLocaleDateString('ru-RU') }));
    },
  },

  notifications: {
    channels: async (): Promise<NotificationSetting[]> => {
      return wrap(() => notifChannelsData as NotificationSetting[]);
    },
    events: async (): Promise<NotificationEvent[]> => {
      return wrap(() => notifEventsData as NotificationEvent[]);
    },
  },

  admin: {
    dashboard: async (): Promise<AdminDashboard> => {
      return wrap(() => {
        const stats = adminStatsData as any;
        return { ...stats, recentReviews: reviewsData as Review[] };
      });
    },
  },
};
