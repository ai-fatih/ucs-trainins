'use client';
import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Stars } from '@/components/ui/Stars';
import { api } from '@/lib/api';
import type { AdminDashboard } from '@/types';

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  useEffect(() => { api.admin.dashboard().then(setData); }, []);

  if (!data) return <div className="p-8 text-center text-sm text-[#6b7280]">Загрузка...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="section-title">Дашборд отдела консультации</h1>
        <p className="section-subtitle">Оперативная статистика за сегодня, 3 июля 2026</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { value: data.todayConsultations, label: 'Консультаций сегодня', trend: '↑ 2 с прошлой недели', color: '#1a56db' },
            { value: `${data.onlineSpecialists}`, label: 'Специалиста онлайн', trend: '◉ Все доступны', color: '#059669' },
            { value: data.avgRating.toFixed(2), label: 'Средняя оценка', trend: '↑ За месяц: 4.72', color: '#1a56db' },
            { value: data.weeklyBookings, label: 'Записей на неделе', trend: '↑ 8.3% к прошлой', color: '#1a56db' },
          ].map((stat) => (
            <Card key={stat.label} className="text-center py-5">
              <div className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-[#6b7280] mt-1">{stat.label}</div>
              <div className="text-[11px] mt-1" style={{ color: stat.color }}>{stat.trend}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader><h3 className="font-semibold">Загрузка специалистов</h3></CardHeader>
            <div className="space-y-3">
              {data.specialistLoad.map((sl) => (
                <div key={sl.name}>
                  <div className="flex justify-between text-sm mb-1"><span>{sl.name}</span><span className="font-semibold">{sl.load}%</span></div>
                  <div className="h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${sl.load}%`, background: sl.color }} />
                  </div>
                  {sl.load > 90 && <div className="text-[11px] text-[#d97706] mt-1">⚠ Высокая загрузка</div>}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader><h3 className="font-semibold">Статусы записей</h3></CardHeader>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>✅ Завершено</span><span className="font-bold text-[#059669]">{data.stats.completed}</span></div>
              <div className="flex justify-between"><span>🔄 Предстоит</span><span className="font-bold text-[#0284c7]">{data.stats.total - data.stats.completed - data.stats.cancelled - data.stats.noShow}</span></div>
              <div className="flex justify-between"><span>❌ Отменено</span><span className="font-bold">{data.stats.cancelled}</span></div>
              <div className="flex justify-between"><span>⚠ No-show</span><span className="font-bold text-[#dc2626]">{data.stats.noShow}</span></div>
              <div className="flex justify-between"><span>⏳ В листе ожидания</span><span className="font-bold">{data.stats.waitlist}</span></div>
              <hr className="border-[#e5e7eb] my-2" />
              <div className="flex justify-between"><span className="font-semibold">Итого за месяц</span><span className="font-bold">{data.stats.total}</span></div>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Последние отзывы</h3>
            <button className="btn-secondary !text-xs !px-3 !py-1.5" onClick={() => alert('Экспорт отчёта')}>📥 Экспорт</button>
          </CardHeader>
          <div className="space-y-3">
            {data.recentReviews.map((r, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-[#f3f4f6] last:border-0">
                <div>
                  <Stars rating={r.rating} />{' '}
                  <span className="text-sm text-[#6b7280]">«{r.text}»</span>
                </div>
                <span className="text-xs text-[#6b7280] shrink-0 ml-2">— {r.userName}, {r.date}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
