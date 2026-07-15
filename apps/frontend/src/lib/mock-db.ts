import type { User, Booking, Service } from '@/types';
import servicesData from '@/data/services.json';

const seedUsers: User[] = [
  { id: 'u1', name: 'Амир', email: 'root@ucs.ru', phone: '+7 (999) 000-00-00', userType: 'company', role: 'company_admin' },
  { id: 'u2', name: 'Иван Петров', email: 'user@ucs.ru', phone: '+7 (999) 111-11-11', userType: 'individual', role: 'user' },
  { id: 'u3', name: 'Елена Смирнова', email: 'staff@ucs.ru', phone: '+7 (999) 222-22-22', userType: 'individual', role: 'specialist' },
];

const seedPasswords: Record<string, string> = {
  'root@ucs.ru': 'admin',
  'user@ucs.ru': 'admin',
  'staff@ucs.ru': 'admin',
};

export class MockApiError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
    this.name = 'MockApiError';
  }
}

class MockDB {
  private users: Map<string, User>;
  private passwords: Map<string, string>;
  private bookings: Map<string, Booking>;
  private nextBookingId = 0;

  constructor() {
    this.users = new Map();
    this.passwords = new Map();
    this.bookings = new Map();
    this.seed();
  }

  private seed() {
    for (const u of seedUsers) {
      this.users.set(u.email, u);
    }
    for (const [email, pw] of Object.entries(seedPasswords)) {
      this.passwords.set(email, pw);
    }
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.get(email);
  }

  findUserById(id: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.id === id);
  }

  login(email: string, password: string): User {
    const user = this.users.get(email);
    if (!user) throw new MockApiError('Пользователь не найден', 401);
    const stored = this.passwords.get(email);
    if (stored !== password) throw new MockApiError('Неверный пароль', 401);
    return user;
  }

  register(data: { name: string; email: string; phone: string; password?: string; userType?: 'company' | 'individual' }): User {
    if (this.users.has(data.email)) {
      throw new MockApiError('Пользователь с таким email уже зарегистрирован', 409);
    }
    const user: User = {
      id: `u${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      userType: data.userType || 'individual',
      role: data.userType === 'company' ? 'company_admin' : 'user',
    };
    this.users.set(user.email, user);
    if (data.password) this.passwords.set(user.email, data.password);
    return user;
  }

  listBookings(): Booking[] {
    return Array.from(this.bookings.values()).sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0));
  }

  createBooking(data: { serviceId: string; serviceName: string; specialistId?: string; specialistName?: string; date: string; time: string; durationMinutes: number; isFree: boolean; topic?: string; employeeName?: string; employeeId?: string }): Booking {
    this.nextBookingId++;
    const booking: Booking = {
      id: `b${Date.now()}-${this.nextBookingId}`,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      specialistId: data.specialistId || '',
      specialistName: data.specialistName || '',
      date: data.date,
      time: data.time,
      durationMinutes: data.durationMinutes,
      status: 'scheduled',
      isFree: data.isFree,
      topic: data.topic,
      employeeName: data.employeeName,
      employeeId: data.employeeId,
      createdAt: new Date().toISOString(),
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  cancelBooking(id: string): void {
    const b = this.bookings.get(id);
    if (!b) throw new MockApiError('Бронирование не найдено', 404);
    b.status = 'cancelled';
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  get services(): Service[] {
    return servicesData as Service[];
  }
}

export const mockDB = new MockDB();
