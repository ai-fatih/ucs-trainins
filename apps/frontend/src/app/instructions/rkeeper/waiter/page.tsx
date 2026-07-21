'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

const scenarios = [
  { title: 'Приём заказа через Waiter', desc: 'Авторизация, создание заказа у столика, отправка на кухню', href: '/instructions/rkeeper/waiter/take-order' },
  { title: 'Оплата счета через Cash Desk', desc: 'Приём оплаты наличными и картой у столика, печать чека', href: '/instructions/rkeeper/waiter/payment' },
  { title: 'Выход на смену и завершение', desc: 'Начало смены в приложении, синхронизация, закрытие смены', href: '/instructions/rkeeper/waiter/shift' },
];

export default function WaiterPage() {
  const [query, setQuery] = useState('');

  const filtered = scenarios.filter(
    (s) => s.title.toLowerCase().includes(query.toLowerCase()) || s.desc.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <span className="text-[#111827]">Waiter & Cash Desk</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Waiter &amp; Cash Desk</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Мобильные приложения для официантов и кассиров: приём и оплата заказа прямо у столика гостя.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по сценариям..."
          className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)] bg-white/80"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((s, i) => (
          <Link
            key={s.href}
            href={s.href}
            className="glass-card p-5 no-underline transition-all hover:-translate-y-0.5 flex items-start gap-4"
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center text-sm font-semibold">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-base font-medium text-[#1a56db] block">{s.title}</span>
              <span className="text-sm text-[#6b7280] mt-0.5 block">{s.desc}</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#9ca3af]">Ничего не найдено</div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-[#e5e7eb]">
        <Link href="/instructions" className="text-sm text-[#1a56db] hover:underline no-underline">
          &larr; Все инструкции
        </Link>
      </div>
    </div>
  );
}
