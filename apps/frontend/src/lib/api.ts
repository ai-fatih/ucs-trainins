import servicesData from '@/data/services.json';
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

export const api = {
  services: {
    list: async (): Promise<Service[]> => {
      await delay(100);
      return servicesData as Service[];
    },
  },

  specialists: {
    list: async (): Promise<Specialist[]> => {
      await delay(100);
      return specialistsData as Specialist[];
    },
  },

  slots: {
    getByDate: async (date: string): Promise<Slot[]> => {
      await delay(100);
      return (slotsData as Record<string, Slot[]>)[date] || [];
    },
  },

  bookings: {
    list: async (): Promise<Booking[]> => {
      await delay(100);
      return bookingsData as Booking[];
    },
    create: async (data: Partial<Booking>): Promise<Booking> => {
      await delay(150);
      return {
        id: `b${Date.now()}`,
        serviceId: data.serviceId || '',
        serviceName: data.serviceName || '',
        specialistId: data.specialistId || '',
        specialistName: data.specialistName || '',
        status: 'scheduled',
        date: data.date || '',
        time: data.time || '',
        durationMinutes: data.durationMinutes || 30,
        isFree: data.isFree ?? true,
        ...data,
      } as Booking;
    },
    cancel: async (_id: string): Promise<void> => {
      await delay(100);
    },
  },

  employees: {
    list: async (): Promise<Employee[]> => {
      await delay(50);
      return employeesData as Employee[];
    },
  },

  auth: {
    login: async (email: string, _password: string, type: 'company' | 'individual') => {
      await delay(300);
      return {
        id: 'user1',
        email,
        name: type === 'company' ? 'ООО «Ресторанъ»' : 'Иван Петров',
        phone: '+7 (999) 123-45-67',
        userType: type,
        role: type === 'company' ? 'company_admin' : 'user',
        ...(type === 'company' ? { companyId: 'comp1' } : {}),
      };
    },
    register: async (data: { name: string; email: string; phone: string; password: string }) => {
      await delay(300);
      return { id: `user${Date.now()}`, ...data, userType: 'individual' as const, role: 'user' as const };
    },
  },

  chat: {
    list: async (): Promise<ChatRoom[]> => {
      await delay(100);
      return chatsData as ChatRoom[];
    },
    getMessages: async (chatId: string) => {
      await delay(100);
      const chat = (chatsData as any[]).find((c) => c.id === chatId);
      return chat?.messages || [];
    },
  },

  reviews: {
    list: async (): Promise<Review[]> => {
      await delay(100);
      return reviewsData as Review[];
    },
    create: async (data: { bookingId: string; rating: number; text: string }) => {
      await delay(150);
      return { id: `r${Date.now()}`, ...data, date: new Date().toLocaleDateString('ru-RU') };
    },
  },

  notifications: {
    channels: async (): Promise<NotificationSetting[]> => {
      await delay(50);
      return notifChannelsData as NotificationSetting[];
    },
    events: async (): Promise<NotificationEvent[]> => {
      await delay(50);
      return notifEventsData as NotificationEvent[];
    },
  },

  admin: {
    dashboard: async (): Promise<AdminDashboard> => {
      await delay(100);
      const stats = adminStatsData as any;
      return {
        ...stats,
        recentReviews: reviewsData as Review[],
      };
    },
  },
};
