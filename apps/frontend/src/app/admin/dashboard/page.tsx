'use client';
import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import type { Booking, AdminDashboard } from '@/types';
import { ArrowRight, Calendar, Users, Star, TrendingUp } from 'lucide-react';

const statusMeta: Record<string, { label: string; color: string }> = {
  new: { label: 'Новая', color: 'text-[#1a56db] bg-[#e8effa]' },
  scheduled: { label: 'В работе', color: 'text-[#d97706] bg-[#fef3c7]' },
  in_progress: { label: 'В работе', color: 'text-[#d97706] bg-[#fef3c7]' },
  completed: { label: 'Выполнена', color: 'text-[#059669] bg-[#d1fae5]' },
  cancelled: { label: 'Отклонена', color: 'text-[#dc2626] bg-[#fee2e2]' },
};

function StatusBadge({ status }: { status: string }) {
  const meta = statusMeta[status] || { label: status, color: 'text-[#6b7280] bg-[#f3f4f6]' };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.color}`}>
      {meta.label}
    </span>
  );
}

function BarItem({ name, load, color }: { name: string; load: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#6b7280] w-28 truncate shrink-0">{name}</span>
      <div className="flex-1 h-2.5 rounded-full bg-[#f3f4f6] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${load}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold text-[#374151] w-8 text-right">{load}%</span>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, gradient }: { label: string; value: string | number; icon: React.ElementType; gradient: string }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${gradient} text-white flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#111827]">{value}</p>
        <p className="text-xs text-[#6b7280]">{label}</p>
      </div>
    </div>
  );
}

export default function StaffDashboardPage() {
  const { user } = useAuthStore();

  const { data: stats } = useQuery<AdminDashboard>({
    queryKey: ['admin-stats'],
    queryFn: api.admin.dashboard,
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: api.bookings.list,
  });

  const today = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter((b) => b.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const recentRequests = bookings.slice(-6).reverse();

  const myName = user?.name || '';
  const myBookings = todayBookings.filter((b) => b.specialistName === myName);

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-1">
        Панель управления
      </h1>
      <p className="text-sm text-[#6b7280] mb-8">
        {user?.name ? `${user.name.split(' ')[0]}, сегодня ${new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}` : ''}
      </p>

      {/* Stats — гибрид A+B+C */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Заявок сегодня" value={stats?.todayConsultations ?? 0} icon={Calendar} gradient="bg-gradient-to-br from-[#1a56db] to-[#2563eb]" />
          <StatCard label="Специалистов online" value={stats?.onlineSpecialists ?? 0} icon={Users} gradient="bg-gradient-to-br from-[#0d9488] to-[#059669]" />
          <StatCard label="Средний рейтинг" value={stats?.avgRating ?? 0} icon={Star} gradient="bg-gradient-to-br from-[#d97706] to-[#f59e0b]" />
          <StatCard label="Записей за неделю" value={stats?.weeklyBookings ?? 0} icon={TrendingUp} gradient="bg-gradient-to-br from-[#7c3aed] to-[#6366f1]" />
        </div>

        {stats && stats.specialistLoad && stats.specialistLoad.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Загрузка специалистов</h3>
            <div className="space-y-3">
              {stats.specialistLoad.map((s) => (
                <BarItem key={s.name} name={s.name} load={s.load} color={s.color} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Requests — гибрид A+B+C */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#111827]">Последние заявки</h2>
          <Link href="/admin/requests" className="text-sm font-semibold text-[#1a56db] hover:text-[#1648c0] no-underline inline-flex items-center gap-1">
            Все заявки <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentRequests.map((b) => (
            <Link
              key={b.id}
              href={`/admin/requests/${b.id}`}
              className="glass-card p-5 no-underline hover:bg-white group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-semibold text-[#6b7280]">#{b.id.toUpperCase()}</span>
                <StatusBadge status={b.status} />
              </div>
              <h3 className="font-semibold text-sm text-[#111827] mb-1 group-hover:text-[#1a56db] transition-colors">{b.serviceName}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6b7280]">
                <span>👤 {b.employeeName || b.specialistName || '—'}</span>
                <span>📅 {b.date}</span>
                <span>⏰ {b.time}</span>
              </div>
              {b.topic && <p className="text-xs text-[#9ca3af] mt-2 truncate">{b.topic}</p>}
            </Link>
          ))}
        </div>
      </section>

      {/* Personal Load C — today's timeline */}
      <section>
        <h2 className="text-lg font-bold text-[#111827] mb-4">Расписание на сегодня</h2>
        {todayBookings.length > 0 ? (
          <div className="space-y-1">
            {Array.from({ length: 9 }, (_, i) => i + 9).map((hour) => {
              const hh = hour.toString().padStart(2, '0');
              const hhEnd = (hour + 1).toString().padStart(2, '0');
              const slot = todayBookings.find((b) => b.time.startsWith(hh));
              const isBreak = false; // we don't have break data per booking
              return (
                <div
                  key={hour}
                  className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all ${
                    slot ? 'glass-card hover:bg-white' : ''
                  } ${isBreak ? 'opacity-50' : ''}`}
                >
                  <span className="text-xs font-semibold text-[#6b7280] w-10 shrink-0">{hh}:00</span>
                  <div className="h-px flex-1 bg-[#e5e7eb]" />
                  {slot ? (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <div>
                        <span className="text-sm font-semibold text-[#111827]">{slot.serviceName}</span>
                        <span className="text-xs text-[#6b7280] ml-2">
                          {slot.employeeName || slot.specialistName || ''}
                        </span>
                      </div>
                      <StatusBadge status={slot.status} />
                    </div>
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-6 text-center">
            <Calendar className="w-8 h-8 text-[#d1d5db] mx-auto mb-2" />
            <p className="text-sm text-[#6b7280]">Сегодня записей нет</p>
          </div>
        )}
      </section>
    </div>
  );
}
