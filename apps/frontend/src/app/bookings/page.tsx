'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Booking } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { getStatusLabel } from '@/lib/utils';
import { Calendar, MessageCircle, XCircle, Star, ClipboardList, HeartHandshake } from 'lucide-react';
import { QualitySurveyModal } from '@/components/features/QualitySurveyModal';
import { TipModal } from '@/components/features/TipModal';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'all', label: 'Все' },
  { id: 'scheduled', label: 'Предстоящие' },
  { id: 'completed', label: 'Завершённые' },
  { id: 'cancelled', label: 'Отменённые' },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [surveyBooking, setSurveyBooking] = useState<Booking | null>(null);
  const [tipBooking, setTipBooking] = useState<Booking | null>(null);
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: api.bookings.list,
  });

  const cancelMutation = useMutation({
    mutationFn: api.bookings.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Запись отменена');
    },
  });

  const filtered = activeTab === 'all' ? bookings : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Мои записи</h1>
          <p className="text-sm text-[#6b7280]">Всего записей: {bookings.length} • Предстоящих: {bookings.filter((b) => b.status === 'scheduled').length}</p>
        </div>
        <Link href="/services" className="glass-btn text-sm">
          <Calendar className="w-4 h-4" /> Новая запись
        </Link>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'all' && (
        <div className="glass-card border-l-4 border-l-[#f59e06] p-4 mb-4 flex items-center justify-between">
          <span className="text-sm">⏳ Вы в листе ожидания к специалисту <strong>Мария Соколова</strong> с 28 июня.</span>
          <button className="text-xs text-[#6b7280] hover:text-[#dc2626] transition-colors" onClick={() => toast('Вы отписались от листа ожидания')}>Отписаться</button>
        </div>
      )}

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
          : filtered.map((booking) => {
              const status = getStatusLabel(booking.status);
              return (
                <div
                  key={booking.id}
                  className={`glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
                    booking.status === 'scheduled' ? 'ring-2 ring-[#1a56db]/20' : ''
                  }`}
                >
                  <div className="text-center min-w-[56px]">
                    <div className="text-2xl font-bold text-[#1a56db]">{new Date(booking.date).getDate()}</div>
                    <div className="text-[10px] text-[#6b7280] uppercase">{new Date(booking.date).toLocaleDateString('ru-RU', { month: 'short' })}</div>
                    <div className="text-xs font-medium text-[#6b7280]">{booking.time}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-[#111827]">{booking.serviceName}</div>
                    <div className="text-xs text-[#6b7280]">{booking.specialistName} • {booking.durationMinutes} мин</div>
                    {booking.topic && <div className="text-xs text-[#6b7280]">Тема: {booking.topic}</div>}
                    {booking.employeeName && <div className="text-xs text-[#6b7280]">Сотрудник: {booking.employeeName}</div>}
                  </div>
                  <div className="text-left sm:text-right">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    {booking.rating && <div className="mt-1 flex items-center gap-1 sm:justify-end"><span className="text-xs">⭐</span></div>}
                    <div className="flex gap-1 mt-2">
                      {booking.status === 'scheduled' && (
                        <>
                          <Link href="/chat/chat1" className="glass-btn !py-1 !px-2 !text-xs">
                            <MessageCircle className="w-3 h-3" /> Чат
                          </Link>
                          <button
                            onClick={() => cancelMutation.mutate(booking.id)}
                            className="text-xs text-[#dc2626] hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                          >
                            <XCircle className="w-3 h-3 inline mr-1" /> Отменить
                          </button>
                        </>
                      )}
                      {booking.status === 'completed' && (
                        <>
                          {!booking.rating && (
                            <Link href="/review" className="text-xs text-[#1a56db] hover:bg-[#e8effa] px-2 py-1 rounded-md transition-colors">
                              <Star className="w-3 h-3 inline mr-1" /> Оценить
                            </Link>
                          )}
                          {!booking.feedbackCompleted && (
                            <button
                              onClick={() => setSurveyBooking(booking)}
                              className="text-xs text-[#0d9488] hover:bg-[#ecfdf5] px-2 py-1 rounded-md transition-colors"
                            >
                              <ClipboardList className="w-3 h-3 inline mr-1" /> Опрос
                            </button>
                          )}
                          <button
                            onClick={() => setTipBooking(booking)}
                            className="text-xs text-[#dc2626] hover:bg-[#fef2f2] px-2 py-1 rounded-md transition-colors"
                          >
                            <HeartHandshake className="w-3 h-3 inline mr-1" /> Чаевые
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <QualitySurveyModal
        open={!!surveyBooking}
        onClose={() => setSurveyBooking(null)}
        specialistName={surveyBooking?.specialistName}
        onComplete={() => {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
        }}
      />

      <TipModal
        open={!!tipBooking}
        onClose={() => setTipBooking(null)}
        specialistName={tipBooking?.specialistName}
        bookingId={tipBooking?.id || ''}
      />
    </div>
  );
}
