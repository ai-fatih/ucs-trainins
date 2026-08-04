'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Search, TrendingUp, Swords, ArrowLeft } from 'lucide-react';
import casesYear from '@/data/cases/yearly.json';
import type { YearlyCases } from '@/types';

const year = casesYear as YearlyCases;

const productLabels: Record<string, string> = {
  rk7: 'r_keeper 7',
  storehouse: 'StoreHouse Pro',
  delivery: 'Delivery',
  event: 'Event',
  waiter: 'Waiter & Cash Desk',
};

export default function FaqMonthPage() {
  const params = useParams<{ month: string }>();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const idx = year.months.findIndex((m) => m.month === params.month);
  const month = idx >= 0 ? year.months[idx] : undefined;
  const prev = month ? year.months[idx - 1] : undefined;
  const delta = (month?.count ?? 0) - (prev?.count ?? 0);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q') ?? '';
    setQuery(q);
  }, []);

  const updateQuery = (value: string) => {
    setQuery(value);
    const paramsObj = new URLSearchParams(window.location.search);
    if (value) paramsObj.set('q', value);
    else paramsObj.delete('q');
    router.replace(paramsObj.toString() ? `/faq/${params.month}?${paramsObj}` : `/faq/${params.month}`, {
      scroll: false,
    });
  };

  const filtered = useMemo(() => {
    const cases = month?.cases ?? [];
    if (!query.trim()) return cases;
    const q = query.toLowerCase();
    return cases.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.product.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query, month]);

  const title = month?.monthLabel ?? `${month?.label ?? params.month} ${year.year}`;
  const isPlanned = month?.planned;

  if (!month) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <p className="text-[#6b7280]">Месяц не найден</p>
        <Link href="/faq" className="text-[#1a56db] text-sm mt-2 inline-block hover:underline no-underline">
          Вернуться к годовому срезу
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/faq" className="inline-flex items-center gap-1 text-sm text-[#1a56db] hover:underline no-underline mb-4">
          <ArrowLeft className="w-4 h-4" /> Все месяцы {year.year}
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-[#111827]">Обращения · {title}</h1>
        </div>
        <p className="text-[#6b7280]">
          Разбор реальных обращений консультаций за {title.toLowerCase()}
          {delta > 0 && (
            <span className="ml-1.5 text-[11px] font-bold text-[#059669]">▲ +{delta} к прошлому месяцу</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[#111827]">Итоги {title.toLowerCase()}</h2>
              <p className="text-xs text-[#6b7280]">Топ тем обращений в консультациях отдела</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(month.summary?.topTopics ?? []).map((t) => (
              <span key={t.label} className="text-xs px-3 py-1.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold">
                {t.label} · {t.count}
              </span>
            ))}
            {isPlanned && <span className="text-xs px-3 py-1.5 rounded-full bg-[#f3f4f6] text-[#9ca3af] font-semibold">данные появятся позже</span>}
          </div>
        </div>

        <div className="glass-card p-5 flex flex-col justify-center">
          <div className="text-3xl font-bold text-[#111827] mb-1">{month.count}</div>
          <div className="text-sm text-[#6b7280]">обращений за месяц</div>
          {month.courseId && !isPlanned && (
            <Link
              href={`/school/courses/${month.courseId}`}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a56db] hover:underline no-underline"
            >
              <Swords className="w-4 h-4" /> Потренироваться на кейсах
            </Link>
          )}
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
        <input
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          placeholder="Поиск по обращениям, темам, продуктам..."
          className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)] bg-white/80"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/faq/${params.month}/${c.id}`}
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
                  {typeof c.count === 'number' && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold">
                      {c.count} обр.
                    </span>
                  )}
                </div>
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
          <div className="text-center py-12 text-[#9ca3af]">
            {isPlanned ? 'Разборы этого месяца будут добавлены' : 'Ничего не найдено'}
          </div>
        )}
      </div>
    </div>
  );
}