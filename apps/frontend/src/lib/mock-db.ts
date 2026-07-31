import type { User, Booking, Service, Specialist, Slot } from '@/types';
import servicesData from '@/data/services.json';
import specialistsData from '@/data/specialists.json';
import slotsData from '@/data/slots.json';

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
  private serviceMap: Map<string, Service>;
  private specialistMap: Map<string, Specialist>;
  private slotMap: Map<string, Slot>;
  private nextBookingId = 0;

  constructor() {
    this.users = new Map();
    this.passwords = new Map();
    this.bookings = new Map();
    this.serviceMap = new Map();
    this.specialistMap = new Map();
    this.slotMap = new Map();
    this.seed();
  }

  private seed() {
    for (const u of seedUsers) {
      this.users.set(u.email, u);
    }
    for (const [email, pw] of Object.entries(seedPasswords)) {
      this.passwords.set(email, pw);
    }
    for (const s of servicesData as Service[]) {
      this.serviceMap.set(s.id, s);
    }
    for (const s of specialistsData as Specialist[]) {
      this.specialistMap.set(s.id, s);
    }
    const allSlots = Object.values(slotsData as Record<string, Slot[]>).flat();
    for (const s of allSlots) {
      this.slotMap.set(s.id, s);
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

  rescheduleBooking(id: string, data: { date: string; time: string }): void {
    const b = this.bookings.get(id);
    if (!b) throw new MockApiError('Бронирование не найдено', 404);
    b.date = data.date;
    b.time = data.time;
    b.status = 'rescheduled';
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  submitReview(id: string, data: { rating: number; text: string }): void {
    const b = this.bookings.get(id);
    if (!b) throw new MockApiError('Бронирование не найдено', 404);
    b.rating = data.rating;
    b.feedbackCompleted = true;
    b.reviewText = data.text;
  }

  markSurveyDone(id: string): void {
    const b = this.bookings.get(id);
    if (!b) throw new MockApiError('Бронирование не найдено', 404);
    b.feedbackCompleted = true;
  }

  get services(): Service[] {
    return Array.from(this.serviceMap.values());
  }

  listServices(): Service[] {
    return Array.from(this.serviceMap.values());
  }

  createService(data: Omit<Service, 'id'>): Service {
    const service: Service = { ...data, id: `svc${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    this.serviceMap.set(service.id, service);
    return service;
  }

  updateService(id: string, data: Partial<Service>): Service {
    const existing = this.serviceMap.get(id);
    if (!existing) throw new MockApiError('Услуга не найдена', 404);
    const updated = { ...existing, ...data, id };
    this.serviceMap.set(id, updated);
    return updated;
  }

  deleteService(id: string): void {
    if (!this.serviceMap.delete(id)) throw new MockApiError('Услуга не найдена', 404);
  }

  listSpecialists(): Specialist[] {
    return Array.from(this.specialistMap.values());
  }

  createSpecialist(data: Omit<Specialist, 'id'>): Specialist {
    const specialist: Specialist = { ...data, id: `spc${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    this.specialistMap.set(specialist.id, specialist);
    return specialist;
  }

  updateSpecialist(id: string, data: Partial<Specialist>): Specialist {
    const existing = this.specialistMap.get(id);
    if (!existing) throw new MockApiError('Специалист не найден', 404);
    const updated = { ...existing, ...data, id };
    this.specialistMap.set(id, updated);
    return updated;
  }

  deleteSpecialist(id: string): void {
    if (!this.specialistMap.delete(id)) throw new MockApiError('Специалист не найден', 404);
  }

  listAllSlots(): Slot[] {
    return Array.from(this.slotMap.values());
  }

  setSlotAvailability(id: string, isAvailable: boolean): void {
    const slot = this.slotMap.get(id);
    if (!slot) throw new MockApiError('Слот не найден', 404);
    slot.isAvailable = isAvailable;
  }
}

export const mockDB = new MockDB();
