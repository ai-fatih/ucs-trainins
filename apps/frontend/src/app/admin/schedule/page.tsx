'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageSkeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function AdminSchedulePage() {
  const { data: schedule, isLoading } = useQuery({
    queryKey: ['admin', 'schedule'],
    queryFn: async () => {
      const res = await import('@/data/schedule.json');
      return res.default;
    },
  });

  if (isLoading) return <div className="flex"><Sidebar /><div className="flex-1 p-8"><PageSkeleton /></div></div>;
  if (!schedule) return null;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">Управление расписанием</h1>
            <p className="section-subtitle">Настройка рабочих часов, слотов и перерывов специалистов</p>
          </div>
          <div className="flex gap-3">
            <select className="form-input text-sm !w-auto">
              <option>Эта неделя</option>
              <option>Следующая неделя</option>
            </select>
            <Button variant="primary">+ Создать слоты</Button>
          </div>
        </div>

        <div className="flex gap-1 mb-6 border-b border-[#e5e7eb]">
          {['Все', ...schedule.specialists.map((s: any) => s.name)].map((name) => (
            <button key={name} className={`px-4 py-2.5 text-sm font-medium transition-all border-none bg-transparent cursor-pointer ${name === 'Иван Петров' ? 'text-[#1a56db] border-b-2 border-[#1a56db]' : 'text-[#9ca3af] hover:text-[#4b5563] border-b-2 border-transparent'}`}>
              {name}
            </button>
          ))}
        </div>

        <Card className="mb-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">← 3 — 9 июля 2026 →</span>
          </div>
        </Card>

        {schedule.specialists.map((spec: any) => (
          <Card key={spec.id} className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8effa] text-[#1a56db] flex items-center justify-center text-sm font-bold">{spec.name.split(' ').map((n: string) => n[0]).join('')}</div>
                <div>
                  <div className="font-semibold">{spec.name}</div>
                  <div className="text-xs text-[#6b7280]">Специалист</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">✏️ Редактировать</Button>
                <Button variant="secondary" size="sm">📅 Перерыв</Button>
                <Button variant="secondary" size="sm">🏖 Блокировать</Button>
              </div>
            </div>

            <div className="text-sm">
              <div className="flex border-b border-[#f3f4f6] py-2">
                <span className="w-24 text-[#6b7280] font-medium">Рабочие часы</span>
                <span>{schedule.weekdays.join('-')}: {schedule.workHours.start} — {schedule.workHours.end}</span>
              </div>
              {Object.entries(spec.schedule).map(([day, periods]: [string, any]) => (
                <div key={day} className="flex border-b border-[#f3f4f6] py-3">
                  <span className="w-24 text-xs font-medium text-[#6b7280] pt-1">{day}</span>
                  <div className="flex flex-wrap gap-1">
                    {periods.map((period: any, idx: number) => (
                      <span
                        key={idx}
                        className={`inline-block px-2 py-1 rounded text-xs cursor-pointer ${
                          period.type === 'break' ? 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed' :
                          'bg-[#d1fae5] text-[#059669]'
                        }`}
                        onClick={() => period.type !== 'break' && toast(`${day} ${period.start}–${period.end}`)}
                      >
                        {period.start}–{period.end}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        <div className="flex gap-4 text-xs text-[#6b7280] mt-4">
          <span><span className="inline-block w-3 h-3 bg-[#d1fae5] rounded-sm align-middle mr-1" /> Свободно</span>
          <span><span className="inline-block w-3 h-3 bg-[#f3f4f6] rounded-sm align-middle mr-1" /> Перерыв</span>
        </div>
      </div>
    </div>
  );
}
