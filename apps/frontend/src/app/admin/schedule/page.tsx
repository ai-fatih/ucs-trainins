'use client';
import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function AdminSchedulePage() {
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
          {['Все', 'Иван Петров', 'Мария Соколова', 'Алексей Кузнецов'].map((name) => (
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

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e8effa] text-[#1a56db] flex items-center justify-center text-sm font-bold">ИП</div>
              <div>
                <div className="font-semibold">Иван Петров</div>
                <div className="text-xs text-[#6b7280]">Ведущий специалист</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">✏️ Редактировать</Button>
              <Button variant="secondary" size="sm">📅 Перерыв</Button>
              <Button variant="secondary" size="sm">🏖 Блокировать</Button>
            </div>
          </div>

          <div className="text-sm">
            <div className="flex border-b border-[#f3f4f6] py-2"><span className="w-24 text-[#6b7280] font-medium">Рабочие часы</span><span>Пн-Пт: 09:00 — 18:00 <Button variant="ghost" size="sm" className="ml-2">Изменить</Button></span></div>
            {[
              { day: 'Пн, 3 июл', slots: [
                { time: '10:00', status: 'booked', onClick: () => toast('Запись: Анна Смирнова') },
                { time: '11:00', status: 'booked', onClick: () => toast('Запись: ООО Ресторанъ') },
                { time: '12:00-13:00', status: 'blocked' },
                { time: '13:00', status: 'free', onClick: () => toast('Слот откроется') },
                { time: '14:00', status: 'free', onClick: () => toast('Слот откроется') },
                { time: '15:00', status: 'free', onClick: () => toast('Слот откроется') },
                { time: '16:00', status: 'booked', onClick: () => toast('Запись: VIP') },
              ]},
              { day: 'Вт, 4 июл', slots: [
                { time: '09:00', status: 'free', onClick: () => toast('Слот откроется') },
                { time: '10:00', status: 'free', onClick: () => toast('Слот откроется') },
                { time: '11:00-12:00', status: 'blocked' },
                { time: '13:00', status: 'booked', onClick: () => toast('Запись: Павел Иванов') },
                { time: '14:00', status: 'free', onClick: () => toast('Слот откроется') },
                { time: '15:00', status: 'free', onClick: () => toast('Слот откроется') },
                { time: '16:00', status: 'booked', onClick: () => toast('Запись') },
              ]},
              { day: 'Чт, 6 июл', slots: [], blocked: true },
              { day: 'Пт, 7 июл', slots: [
                { time: '09:00', status: 'free', onClick: () => toast('Слот откроется') },
                { time: '10:00', status: 'free', onClick: () => toast('Слот откроется') },
                { time: '11:00', status: 'free', onClick: () => toast('Слот откроется') },
                { time: '12:00-14:00', status: 'blocked' },
                { time: '14:00', status: 'free', onClick: () => toast('Слот откроется') },
                { time: '15:00', status: 'free', onClick: () => toast('Слот откроется') },
              ]},
            ].map((row) => (
              <div key={row.day} className="flex border-b border-[#f3f4f6] py-3">
                <span className="w-24 text-xs font-medium text-[#6b7280] pt-1">{row.day}</span>
                <div className="flex flex-wrap gap-1">
                  {row.blocked ? (
                    <span className="inline-flex items-center gap-1 bg-[#fef3c7] px-2 py-1 rounded text-xs">
                      🏖 <strong>Отпуск</strong>
                      <button className="text-[#dc2626] underline ml-1 bg-none border-none cursor-pointer text-xs" onClick={() => toast('Отпуск отменён')}>Отменить</button>
                    </span>
                  ) : row.slots.map((slot) => (
                    <span
                      key={slot.time}
                      onClick={slot.onClick}
                      className={`inline-block px-2 py-1 rounded text-xs cursor-pointer ${
                        slot.status === 'booked' ? 'bg-[#e8effa] text-[#1a56db]' :
                        slot.status === 'blocked' ? 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed' :
                        'bg-[#d1fae5] text-[#059669]'
                      }`}
                    >
                      {slot.time}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-4 text-xs text-[#6b7280] mt-4">
          <span><span className="inline-block w-3 h-3 bg-[#d1fae5] rounded-sm align-middle mr-1" /> Свободно</span>
          <span><span className="inline-block w-3 h-3 bg-[#e8effa] rounded-sm align-middle mr-1" /> Занято</span>
          <span><span className="inline-block w-3 h-3 bg-[#f3f4f6] rounded-sm align-middle mr-1" /> Заблокировано</span>
        </div>
      </div>
    </div>
  );
}
