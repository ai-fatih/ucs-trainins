'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Swords } from 'lucide-react';
import type { MonthlyCases } from '@/types';
import casesData from '@/data/cases/monthly.json';

const monthly = casesData as unknown as MonthlyCases;

const productLabels: Record<string, string> = {
  rk7: 'r_keeper 7',
  storehouse: 'StoreHouse Pro',
  delivery: 'Delivery',
  event: 'Event',
  waiter: 'Waiter & Cash Desk',
};

export default function CasesPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return monthly.cases;
    const q = query.toLowerCase();
    return monthly.cases.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.product.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.situation.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/docs" className="text-[#1a56db] hover:underline no-underline">Документация</Link>
          <span>/</span>
          <span className="text-[#111827]">Кейсы месяца</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Кейсы месяца</h1>
        <p className="text-[#6b7280]">Разбор реальных обращений за {monthly.monthLabel.toLowerCase()}: диагностика, причины и решения</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[#111827]">Итоги {monthly.monthLabel.toLowerCase()}</h2>
              <p className="text-xs text-[#6b7280]">Топ тем обращений в консультациях отдела</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {monthly.summary.topTopics.map((t) => (
              <span key={t.label} className="text-xs px-3 py-1.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold">
                {t.label} · {t.count}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 flex flex-col justify-center">
          <div className="text-3xl font-bold text-[#111827] mb-1">{monthly.summary.totalCases}</div>
          <div className="text-sm text-[#6b7280]">кейсов разобрано за месяц</div>
          <Link href="/school/courses/cases-2026-07" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a56db] hover:underline">
            <Swords className="w-4 h-4" /> Потренироваться на кейсах
          </Link>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по кейсам, темам, продуктам..."
          className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)] bg-white/80"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/docs/cases/${c.id}`}
            className="glass-card p-5 no-underline transition-all hover:-translate-y-0.5 block"
          >
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center text-sm font-semibold">
                {c.title[0]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-base font-medium text-[#1a56db]">{c.title}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] font-semibold">
                    {productLabels[c.product] || c.product}
                  </span>
                </div>
                <p className="text-sm text-[#6b7280] line-clamp-2">{c.situation}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {c.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f4ff] text-[#1a56db]">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
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
