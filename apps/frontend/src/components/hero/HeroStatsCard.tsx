'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import type { YearlyCases } from '@/types';

const MONTH_SHORT: Record<string, string> = {
  '2026-01': 'Янв',
  '2026-02': 'Фев',
  '2026-03': 'Мар',
  '2026-04': 'Апр',
  '2026-05': 'Май',
  '2026-06': 'Июн',
  '2026-07': 'Июл',
  '2026-08': 'Авг',
  '2026-09': 'Сен',
  '2026-10': 'Окт',
  '2026-11': 'Ноя',
  '2026-12': 'Дек',
};

interface HeroStatsCardProps {
  data: YearlyCases;
}

export function HeroStatsCard({ data }: HeroStatsCardProps) {
  const years = useMemo(() => {
    // «текущий» — последний месяц с фактическими данными
    const current =
      data.months.filter((m) => !m.planned).at(-1) ?? data.months.at(-1);
    // 3 столбца: 2 предыдущих + текущий по календарю (независимо от planned)
    const chartMonths = current
      ? data.months.slice(Math.max(0, data.months.indexOf(current) - 2), data.months.indexOf(current) + 1)
      : [];
    const maxCount = Math.max(1, ...chartMonths.map((m) => m.totalRequests ?? 0));
    const topics = (current?.summary?.topTopics ?? []).slice(0, 4);
    const topCases = (current?.cases ?? []).slice(0, 3);
    return { chartMonths, current, maxCount, topics, topCases };
  }, [data]);

  const { chartMonths, current, maxCount, topics, topCases } = years;

  if (!current) return null;

  const currentMonthKey = current.month;

  return (
    <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-5 md:p-6 max-w-md w-full mx-auto lg:mx-0">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">📅</span>
        <div>
          <div className="text-sm md:text-base font-semibold text-white">
            Популярное · {current.monthLabel ?? current.label ?? ''}
          </div>
          <div className="text-xs text-[#94a3b8]">Активность пользователей за последние 3 месяца</div>
        </div>
      </div>

      {/* Bar chart: 2 предыдущих + текущий, текущий — акцентный */}
      <div className="flex items-end gap-2 mb-5">
        {chartMonths.map((m, i) => {
          const isCurrent = m.month === currentMonthKey;
          const heightPct = Math.max(8, Math.round(((m.totalRequests ?? 0) / maxCount) * 100));
          return (
            <div key={m.month} className="flex-1 flex flex-col items-center">
              <div className="hero-bar-value text-[11px] font-bold text-white leading-none mb-1.5">
                {m.totalRequests ?? 0}
              </div>
              {/* фиксированная зона баров — высота привязана только к значению */}
              <div className="w-full h-24 flex flex-col justify-end">
                <div
                  className={`hero-bar w-full rounded-t-md transition-shadow duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-t from-[#1a56db] to-[#0d9488] shadow-[0_0_16px_rgba(13,148,136,0.4)]'
                      : 'bg-[rgba(255,255,255,0.12)]'
                  }`}
                  style={{ height: `${heightPct}%`, animationDelay: `${i * 90}ms` }}
                />
              </div>
              <div
                className={`mt-1.5 text-[10px] font-semibold ${
                  isCurrent ? 'text-[#5eead4]' : 'text-[#94a3b8]'
                }`}
              >
                {(MONTH_SHORT[m.month] ?? m.label ?? '').slice(0, 3)}
              </div>
            </div>
          );
        })}
      </div>

      {topics.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">
            Популярные темы
          </div>
          <div>
            {topics.map((t) => (
              <span
                key={t.label}
                className="inline-block mr-1.5 mb-1.5 text-[11px] px-2.5 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4] last:mr-0"
              >
                {t.label} · {t.count}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1.5 mb-4">
        {topCases.map((c, i) => (
          <Link
            key={c.id}
            href={`/faq/${currentMonthKey}/${c.id}`}
            className="flex items-center gap-3 rounded-lg p-2 no-underline hover:bg-[rgba(255,255,255,0.06)] transition-all group"
          >
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-white/90 group-hover:text-[#5eead4] transition-colors line-clamp-2">
              {c.title}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href={`/faq/${currentMonthKey}`}
        className="flex items-center gap-1 text-sm font-semibold text-[#2dd4bf] hover:gap-2 hover:text-[#5eead4] transition-all no-underline"
      >
        Смотреть все →
      </Link>
    </div>
  );
}