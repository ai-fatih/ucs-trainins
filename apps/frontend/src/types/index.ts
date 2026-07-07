export type UserType = 'company' | 'individual';
export type BookingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
export type ServiceType = 'consultation' | 'training' | 'setup' | 'video';
export type NotificationChannel = 'email' | 'telegram' | 'sms' | 'in_app';
export type UserRole = 'user' | 'company_admin' | 'specialist' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  userType: UserType;
  role: UserRole;
  avatar?: string;
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;
  inn: string;
  contractNumber: string;
  contractStatus: 'active' | 'expired' | 'terminated';
  contractValidUntil: string;
  employees: Employee[];
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  bookingCount: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  type: ServiceType;
  durationMinutes: number;
  priceRub: number | null;
  isFree: boolean;
  category: string;
  icon: string;
  iconBg: string;
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  avatar: string;
  avatarBg: string;
  avatarColor: string;
  avatarUrl?: string;
  startDate?: string;
}

export interface Slot {
  id: string;
  specialistId: string;
  date: string;
  time: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  specialistId?: string;
  specialistName?: string;
  employeeId?: string;
  employeeName?: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: BookingStatus;
  topic?: string;
  rating?: number;
  reviewText?: string;
  isFree: boolean;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  isSent: boolean;
}

export interface ChatRoom {
  id: string;
  specialistName: string;
  specialistAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
  bookingRef: string;
  bookingRefLabel: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  specialistName: string;
  serviceName: string;
}

export interface NotificationSetting {
  channel: NotificationChannel;
  enabled: boolean;
  label: string;
  value: string;
}

export interface NotificationEvent {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'booking' | 'message' | 'reminder' | 'review' | 'system';
  read: boolean;
  createdAt: string;
}

export interface MonthlyStat {
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  waitlist: number;
}

export interface AdminDashboard {
  todayConsultations: number;
  onlineSpecialists: number;
  avgRating: number;
  weeklyBookings: number;
  specialistLoad: { name: string; load: number; color: string }[];
  stats: MonthlyStat;
  recentReviews: Review[];
}
