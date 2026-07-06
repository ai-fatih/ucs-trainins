import servicesData from '@/data/services.json';
import specialistsData from '@/data/specialists.json';
import slotsData from '@/data/slots.json';
import bookingsData from '@/data/bookings.json';
import chatsData from '@/data/chats.json';
import reviewsData from '@/data/reviews.json';
import type { Service, Specialist, Slot, Booking, ChatRoom, Review, AdminDashboard } from '@/types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const api = {
  services: {
    list: async (): Promise<Service[]> => {
      await delay(200);
      return servicesData as Service[];
    },
  },

  specialists: {
    list: async (): Promise<Specialist[]> => {
      await delay(200);
      return specialistsData as Specialist[];
    },
  },

  slots: {
    getByDate: async (date: string): Promise<Slot[]> => {
      await delay(150);
      return (slotsData as Record<string, Slot[]>)[date] || [];
    },
  },

  bookings: {
    list: async (): Promise<Booking[]> => {
      await delay(200);
      return bookingsData as Booking[];
    },
    create: async (data: Partial<Booking>): Promise<Booking> => {
      await delay(300);
      return {
        id: `b${Date.now()}`,
        serviceName: data.serviceName || '',
        specialistName: data.specialistName || '',
        status: 'scheduled',
        date: data.date || '',
        time: data.time || '',
        durationMinutes: data.durationMinutes || 30,
        isFree: data.isFree ?? true,
        ...data,
      } as Booking;
    },
    cancel: async (id: string): Promise<void> => {
      await delay(200);
    },
  },

  auth: {
    login: async (email: string, _password: string, type: 'company' | 'individual') => {
      await delay(500);
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
      await delay(500);
      return { id: `user${Date.now()}`, ...data, userType: 'individual' as const, role: 'user' as const };
    },
  },

  chat: {
    list: async (): Promise<ChatRoom[]> => {
      await delay(150);
      return chatsData as ChatRoom[];
    },
    getMessages: async (chatId: string) => {
      await delay(150);
      const chat = (chatsData as any[]).find((c) => c.id === chatId);
      return chat?.messages || [];
    },
  },

  reviews: {
    list: async (): Promise<Review[]> => {
      await delay(200);
      return reviewsData as Review[];
    },
    create: async (data: { bookingId: string; rating: number; text: string }) => {
      await delay(300);
      return { id: `r${Date.now()}`, ...data, date: new Date().toLocaleDateString('ru-RU') };
    },
  },

  admin: {
    dashboard: async (): Promise<AdminDashboard> => {
      await delay(200);
      return {
        todayConsultations: 12,
        onlineSpecialists: 3,
        avgRating: 4.85,
        weeklyBookings: 45,
        specialistLoad: [
          { name: 'Иван Петров', load: 80, color: '#059669' },
          { name: 'Мария Соколова', load: 95, color: '#d97706' },
          { name: 'Алексей Кузнецов', load: 45, color: '#9ca3af' },
        ],
        stats: { total: 57, completed: 38, cancelled: 5, noShow: 2, waitlist: 3 },
        recentReviews: reviewsData as Review[],
      };
    },
  },
};
