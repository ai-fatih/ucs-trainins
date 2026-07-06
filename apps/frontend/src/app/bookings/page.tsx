'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Stars } from '@/components/ui/Stars';
import { Tabs } from '@/components/ui/Tabs';
import { getStatusLabel } from '@/lib/utils';
import type { Booking } from '@/types';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'all', label: 'Все' },
  { id: 'scheduled', label: 'Предстоящие' },
  { id: 'completed', label: 'Завершённые' },
  { id: 'cancelled', label: 'Отменённые' },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { api.bookings.list().then(setBookings); }, []);

  const filtered = activeTab === 'all' ? bookings : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Мои записи</h1>
          <p className="text-sm text-[#6b7280]">Всего записей: {bookings.length} • Предстоящих: {bookings.filter((b) => b.status === 'scheduled').length}</p>
        </div>
        <Link href="/services" className="btn-primary">+ Новая запись</Link>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Waitlist alert */}
      {activeTab === 'all' && (
        <div className="bg-[#fef3c7] border border-[#f59e0b] rounded-md p-3 mb-4 text-sm flex items-center justify-between">
          <span>⏳ Вы в листе ожидания к специалисту <strong>Мария Соколова</strong> с 28 июня.</span>
          <button className="text-xs text-[#6b7280] underline bg-none border-none cursor-pointer" onClick={() => toast('Вы отписались от листа ожидания')}>Отписаться</button>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((booking) => {
          const status = getStatusLabel(booking.status);
          return (
            <div key={booking.id} className={`flex items-center gap-4 p-4 border rounded-md transition-all bg-white hover:border-[#1a56db] ${booking.status === 'scheduled' ? 'border-[#1a56db] bg-[#e8effa]' : 'border-[#e5e7eb]'}`}>
              <div className="text-center min-w-[56px]">
                <div className="text-2xl font-bold text-[#1a56db]">{new Date(booking.date).getDate()}</div>
                <div className="text-[10px] text-[#6b7280] uppercase">{new Date(booking.date).toLocaleDateString('ru-RU', { month: 'short' })}</div>
                <div className="text-xs font-medium text-[#6b7280]">{booking.time}</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{booking.serviceName}</div>
                <div className="text-xs text-[#6b7280]">{booking.specialistName} • {booking.durationMinutes} мин</div>
                {booking.topic && <div className="text-xs text-[#6b7280]">Тема: {booking.topic}</div>}
                {booking.employeeName && <div className="text-xs text-[#6b7280]">Сотрудник: {booking.employeeName}</div>}
              </div>
              <div className="text-right">
                <Badge variant={status.variant}>{status.label}</Badge>
                {booking.rating && <div className="mt-1 flex items-center gap-1 justify-end"><Stars rating={booking.rating} /></div>}
                <div className="flex gap-1 mt-2">
                  {booking.status === 'scheduled' && (
                    <>
                      <Link href="/chat/chat1" className="btn-secondary !py-1 !px-2 !text-xs">Чат</Link>
                      <Button variant="ghost" size="sm" className="!text-[#dc2626] !text-xs" onClick={() => { toast.success('Запись отменена'); }}>Отменить</Button>
                    </>
                  )}
                  {booking.status === 'completed' && !booking.rating && (
                    <Link href="/review" className="text-xs text-[#1a56db]">⭐ Оценить</Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
