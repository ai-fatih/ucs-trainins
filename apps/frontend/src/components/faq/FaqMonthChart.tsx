'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import type { YearMonth } from '@/types';
import { monthShortLabel } from '@/lib/months';

interface FaqMonthChartProps {
  months: YearMonth[];
  currentMonth: string;
}

export function FaqMonthChart({ months, currentMonth }: FaqMonthChartProps) {
  const maxCount = useMemo(() => Math.max(1, ...months.map((m) => m.totalRequests ?? 0)), [months]);

  return (
    <div>
      <div className="flex items-end gap-1.5 sm:gap-2">
        {months.map((m, i) => {
          const isCurrent = m.month === currentMonth;
          const planned = !!m.planned;
          const heightPct = planned
            ? 8
            : Math.max(10, Math.round(((m.totalRequests ?? 0) / maxCount) * 100));
          return (
            <Link
              key={m.month}
              href={`/faq/${m.month}`}
              aria-label={`${m.monthLabel ?? m.label}: ${m.totalRequests ?? 0} обращений`}
              className={`flex-1 flex flex-col items-center no-underline group ${
                planned ? 'opacity-50 hover:opacity-80' : 'hover:opacity-90'
              }`}
            >
              <div className="hero-bar-value text-[10px] font-bold leading-none mb-1.5 h-3.5 flex items-center justify-center text-[#111827] tabular-nums">
                {planned ? 'план' : m.totalRequests ?? 0}
              </div>
              <div className="w-full h-16 flex flex-col justify-end">
                <div
                  className={`hero-bar w-full rounded-t-sm transition-shadow duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-t from-[#1a56db] to-[#0d9488] shadow-[0_0_12px_rgba(13,148,136,0.35)]'
                      : planned
                        ? 'bg-[#e5e7eb]'
                        : 'bg-[#93a4b8] group-hover:bg-[#1a56db]'
                  }`}
                  style={{ height: `${heightPct}%`, animationDelay: `${i * 40}ms` }}
                />
              </div>
              <div
                className={`mt-1.5 text-[10px] font-semibold ${
                  isCurrent ? 'text-[#0d9488]' : 'text-[#6b7280]'
                }`}
              >
                {monthShortLabel(m.month)}
              </div>
              {isCurrent && (
                <span className="w-fit text-[9px] px-1.5 py-0.5 rounded-full bg-[#0d9488] text-white font-semibold">
                  текущий
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-[11px] text-[#6b7280]">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#93a4b8]" /> разобрано
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#e5e7eb]" /> запланировано
        </span>
      </div>
    </div>
  );
}
