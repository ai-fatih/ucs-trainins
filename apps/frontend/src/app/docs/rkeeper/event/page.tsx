'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

const sections = [
  {
    title: 'Настройка и работа',
    items: [
      { href: '/docs/rkeeper/event/notifications', label: 'Настройка оповещений с кассы', desc: 'Выбор типов событий, каналы оповещения, звук и приоритет' },
      { href: '/docs/rkeeper/event/event-screen', label: 'Экран событий', desc: 'Просмотр ленты событий, фильтры, подтверждение и история' },
    ],
  },
  {
    title: 'Подключение устройств',
    items: [
      { href: '/docs/rkeeper/event/devices', label: 'Подключение внешних устройств', desc: 'Табло заказов, звуковые оповещения, проверка подключения' },
    ],
  },
];

export default function EventPage() {
  const [query, setQuery] = useState('');

  const filtered = sections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (it) => it.label.toLowerCase().includes(query.toLowerCase()) || it.desc.toLowerCase().includes(query.toLowerCase()),
      ),
    }))
    .filter((sec) => sec.items.length > 0);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/docs" className="text-[#1a56db] hover:underline no-underline">Документация</Link>
          <span>/</span>
          <span className="text-[#111827]">Event</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Event</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Приложение для уведомлений с кассы rk Cash Desk. Инструкции по настройке оповещений, работе с экраном событий и подключению внешних устройств.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по инструкциям..."
          className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)] bg-white/80"
        />
      </div>

      <div className="space-y-6">
        {filtered.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-[#111827] mb-3">{section.title}</h2>
            <div className="grid gap-3">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="glass-card p-5 no-underline transition-all hover:-translate-y-0.5"
                >
                  <span className="text-base font-medium text-[#1a56db]">{item.label}</span>
                  <span className="block text-sm text-[#6b7280] mt-1">{item.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#9ca3af]">Ничего не найдено</div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-[#e5e7eb]">
        <Link href="/docs" className="text-sm text-[#1a56db] hover:underline no-underline">
          &larr; Все инструкции
        </Link>
      </div>
    </div>
  );
}
