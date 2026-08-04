import Link from 'next/link';
import { TrendingUp, Swords, CalendarDays } from 'lucide-react';
import { PageHelp } from '@/components/layout/PageHelp';
import casesYear from '@/data/cases/yearly.json';
import type { YearlyCases } from '@/types';

const year = casesYear as YearlyCases;

const CURRENT_MONTH = '2026-07';

function monthTitle(m: { label: string; monthLabel?: string }): string {
  return m.monthLabel ?? `${m.label} ${year.year}`;
}

export default function FaqYearPage() {
  const current = year.months.find((m) => m.month === CURRENT_MONTH);
  const prev = year.months[year.months.findIndex((m) => m.month === CURRENT_MONTH) - 1];
  const maxCount = Math.max(1, ...year.months.map((m) => m.count));
  const resolvedMonths = year.months.filter((m) => !m.planned);
  const totalResolved = resolvedMonths.reduce((s, m) => s + m.count, 0);
  const totalPlanned = year.months.filter((m) => m.planned).reduce((s, m) => s + m.count, 0);
  const delta = (current?.count ?? 0) - (prev?.count ?? 0);

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-[#111827]">Популярные обращения</h1>
          <PageHelp />
        </div>
        <p className="text-[#6b7280]">
          Годовой срез: {resolvedMonths.length} месяц(а) с разборами за {year.year} год. Из обращений
          формируются инструкции-процессы и тренировки в школе.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[#111827]">Итоги {year.year} года</h2>
              <p className="text-xs text-[#6b7280]">Всего обращений по месяцам</p>
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            <div>
              <div className="text-3xl font-bold text-[#111827] leading-none">{totalResolved}</div>
              <div className="text-xs text-[#6b7280] mt-1">обращений разобрано</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0d9488] leading-none">{current?.count ?? 0}</div>
              <div className="text-xs text-[#6b7280] mt-1">
                в {monthTitle(current!).toLowerCase()}
                {delta > 0 && (
                  <span className="ml-1.5 text-[11px] font-bold text-[#059669]">▲ +{delta}</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#111827] leading-none">{resolvedMonths.length}</div>
              <div className="text-xs text-[#6b7280] mt-1">месяцев с разборами</div>
            </div>
            {totalPlanned > 0 && (
              <span className="text-[11px] px-2 py-1 rounded-full bg-[#f3f4f6] text-[#9ca3af] font-semibold">
                + {totalPlanned} запланировано
              </span>
            )}
          </div>
        </div>

        <div className="glass-card p-5 flex flex-col justify-center">
          <div className="text-sm text-[#6b7280] mb-2">
            Топ-темы {monthTitle(current!).toLowerCase()}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {(current?.summary?.topTopics ?? []).slice(0, 3).map((t) => (
              <span key={t.label} className="text-xs px-3 py-1.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold">
                {t.label} · {t.count}
              </span>
            ))}
          </div>
          {current?.courseId && (
            <Link
              href={`/school/courses/${current.courseId}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a56db] hover:underline no-underline"
            >
              <Swords className="w-4 h-4" /> Потренироваться на кейсах
            </Link>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="w-4 h-4 text-[#1a56db]" />
        <h2 className="text-base font-semibold text-[#111827]">Обращения по месяцам</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {year.months.map((m) => {
          const isCurrent = m.month === CURRENT_MONTH;
          const width = Math.round((m.count / maxCount) * 100);
          const active = !m.planned;
          return (
            <Link
              key={m.month}
              href={`/faq/${m.month}`}
              className={`glass-card p-4 no-underline transition-all hover:-translate-y-0.5 flex flex-col gap-2 ${
                isCurrent
                  ? 'border-2 border-transparent bg-gradient-to-br from-[#1a56db]/10 to-[#0d9488]/10 [background-clip:padding-box]'
                  : ''
              } ${active ? '' : 'opacity-60 hover:opacity-90'}`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className={`text-sm font-semibold ${isCurrent ? 'text-[#0d9488]' : 'text-[#111827]'}`}>
                  {m.label}
                </span>
                <span className="text-xs font-bold text-[#6b7280]">{m.count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#f3f4f6] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1a56db] to-[#0d9488]"
                  style={{ width: `${width}%` }}
                />
              </div>
              <div className="text-[11px] text-[#9ca3af]">
                {active
                  ? `${m.count} обращений${m.cases?.length ? ` · ${m.cases.length} разбора` : ''}`
                  : 'запланировано'}
              </div>
              {isCurrent && (
                <span className="w-fit text-[10px] px-2 py-0.5 rounded-full bg-[#0d9488] text-white font-semibold">
                  текущий
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
