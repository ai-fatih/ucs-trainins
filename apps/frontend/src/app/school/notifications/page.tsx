'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Новый курс доступен', body: 'Курс «Решение ошибок RK7» теперь доступен для прохождения.', time: '2 часа назад', read: false },
  { id: 'n2', title: 'Достижение получено', body: 'Вы получили бейдж «Первый шаг»!', time: '1 день назад', read: false },
  { id: 'n3', title: 'Напоминание', body: 'Продолжите обучение на курсе «ЕГАИС: Учёт алкоголя».', time: '2 дня назад', read: true },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link href="/school" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> На главную
      </Link>

      <h1 className="text-2xl font-bold mb-6">Уведомления</h1>

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((n) => (
          <div key={n.id} className={`glass-card p-4 flex items-start gap-3 ${!n.read ? 'border-l-4 border-l-[#1a56db]' : ''}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-[#f9fafb]' : 'bg-[#f0f4ff]'}`}>
              <Bell className={`w-5 h-5 ${n.read ? 'text-[#9ca3af]' : 'text-[#1a56db]'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${n.read ? 'text-[#6b7280]' : 'font-semibold text-[#374151]'}`}>{n.title}</p>
              <p className="text-xs text-[#9ca3af] mt-0.5">{n.body}</p>
              <p className="text-[10px] text-[#9ca3af] mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}