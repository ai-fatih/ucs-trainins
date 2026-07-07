'use client';
import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import type { Booking, ChatRoom } from '@/types';
import { ArrowRight, Calendar, MessageCircle, List, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const statusMeta: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  scheduled: { label: 'Предстоит', icon: Clock, color: 'text-[#1a56db] bg-[#e8effa]' },
  completed: { label: 'Завершена', icon: CheckCircle, color: 'text-[#059669] bg-[#d1fae5]' },
  cancelled: { label: 'Отменена', icon: XCircle, color: 'text-[#dc2626] bg-[#fee2e2]' },
  in_progress: { label: 'В работе', icon: AlertCircle, color: 'text-[#d97706] bg-[#fef3c7]' },
};

function BookingStatus({ status }: { status: string }) {
  const meta = statusMeta[status] || { label: status, icon: Clock, color: 'text-[#6b7280] bg-[#f3f4f6]' };
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.color}`}>
      <Icon className="w-3 h-3" /> {meta.label}
    </span>
  );
}

export default function ClientDashboardPage() {
  const { user } = useAuthStore();

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: api.bookings.list,
  });

  const { data: chats = [] } = useQuery<ChatRoom[]>({
    queryKey: ['chats'],
    queryFn: api.chats.list,
  });

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const nextBooking = bookings
    .filter((b) => b.status === 'scheduled' && b.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0] || null;

  const recent: { date: string; time?: string; type: string; title: string; detail: string; href: string }[] = [
    ...bookings.slice(0, 4).map((b) => ({
      date: b.date,
      time: b.time,
      type: 'booking',
      title: `${b.serviceName} — ${b.specialistName || 'Специалист'}`,
      detail: b.topic || b.status,
      href: '/bookings',
    })),
    ...chats.slice(0, 2).map((c) => ({
      date: '',
      time: c.lastMessageTime,
      type: 'chat',
      title: `Чат с ${c.specialistName}`,
      detail: c.lastMessage,
      href: `/chat/${c.id}`,
    })),
  ].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date) || (b.time || '').localeCompare(a.time || '');
  }).slice(0, 5);

  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">
      {/* Welcome + Stats B */}
      <section className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-1">
          Добро пожаловать{user ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-sm text-[#6b7280]">Рады видеть вас снова</p>
      </section>

      {nextBooking ? (
        <section className="mb-10">
          <div className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#6b7280] font-semibold mb-1">СЛЕДУЮЩАЯ ЗАПИСЬ</p>
                <h3 className="font-bold text-lg text-[#111827] mb-1">{nextBooking.serviceName}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#6b7280] mb-3">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#1a56db]" /> {nextBooking.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#0d9488]" /> {nextBooking.time}</span>
                  {nextBooking.specialistName && <span>👤 {nextBooking.specialistName}</span>}
                </div>
                {nextBooking.topic && (
                  <p className="text-sm text-[#374151] bg-[#f9fafb] rounded-lg px-3 py-2 mb-3">{nextBooking.topic}</p>
                )}
                <Link href="/bookings" className="text-sm font-semibold text-[#1a56db] hover:text-[#1648c0] no-underline transition-colors inline-flex items-center gap-1">
                  Подробнее <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-10">
          <div className="glass-card p-6 text-center">
            <Calendar className="w-10 h-10 text-[#d1d5db] mx-auto mb-3" />
            <p className="text-[#6b7280] mb-4">У вас пока нет активных записей</p>
            <Link href="/booking" className="glass-btn text-sm inline-flex">
              Записаться сейчас <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Quick Actions B */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/booking"
            className="glass-card p-5 flex items-center gap-4 no-underline group hover:bg-white"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#111827]">Новая запись</h3>
              <p className="text-xs text-[#6b7280]">Выбрать услугу и время</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#d1d5db] ml-auto group-hover:text-[#1a56db] transition-colors" />
          </Link>

          <Link
            href="/chat"
            className="glass-card p-5 flex items-center gap-4 no-underline group hover:bg-white"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#059669] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#111827]">Открыть чат</h3>
              <p className="text-xs text-[#6b7280]">{chats.length > 0 ? `${chats.length} активных чатов` : 'Написать специалисту'}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#d1d5db] ml-auto group-hover:text-[#0d9488] transition-colors" />
          </Link>

          <Link
            href="/bookings"
            className="glass-card p-5 flex items-center gap-4 no-underline group hover:bg-white"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#6366f1] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <List className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#111827]">Мои записи</h3>
              <p className="text-xs text-[#6b7280]">{bookings.length > 0 ? `${bookings.filter(b => b.status !== 'cancelled').length} активных` : 'Посмотреть историю'}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#d1d5db] ml-auto group-hover:text-[#7c3aed] transition-colors" />
          </Link>
        </div>
      </section>

      {/* Recent Activity C */}
      <section>
        <h2 className="text-lg font-bold text-[#111827] mb-4">Последние активности</h2>
        <div className="space-y-2">
          {recent.length > 0 ? recent.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="glass-card p-4 flex items-start gap-3 no-underline hover:bg-white group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                item.type === 'booking' ? 'bg-[#e8effa] text-[#1a56db]' : 'bg-[#ccfbf1] text-[#0d9488]'
              }`}>
                {item.type === 'booking' ? <Calendar className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#111827] group-hover:text-[#1a56db] transition-colors">{item.title}</p>
                <p className="text-xs text-[#6b7280] truncate mt-0.5">{item.detail}</p>
              </div>
              <div className="text-[10px] text-[#9ca3af] whitespace-nowrap mt-1">{item.date || item.time}</div>
            </Link>
          )) : (
            <div className="glass-card p-6 text-center">
              <p className="text-sm text-[#6b7280]">У вас пока нет активностей</p>
            </div>
          )}
        </div>
        {bookings.length > 0 && (
          <div className="text-center mt-4">
            <Link href="/bookings" className="text-sm font-semibold text-[#1a56db] hover:text-[#1648c0] no-underline transition-colors inline-flex items-center gap-1">
              Все записи <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
