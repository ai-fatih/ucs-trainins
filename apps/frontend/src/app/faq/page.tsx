import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, Swords, BookOpen, SlidersHorizontal } from 'lucide-react';
import { PageHelp } from '@/components/layout/PageHelp';
import casesYear from '@/data/cases/yearly.json';
import type { YearlyCases } from '@/types';
import { FaqCatalog } from '@/components/faq/FaqCatalog';
import { FaqMonthChart } from '@/components/faq/FaqMonthChart';
import { buildOpenGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Популярные обращения',
  description:
    'Годовой срез обращений пользователей rkeeper по месяцам. Из обращений формируются инструкции-процессы и тренировки в школе.',
  alternates: { canonical: 'https://ucs-service.vercel.app/faq' },
  openGraph: buildOpenGraph({
    title: 'Популярные обращения — UCS Service',
    description:
      'Годовой срез обращений пользователей rkeeper по месяцам. Разборы типовых ситуаций.',
    url: 'https://ucs-service.vercel.app/faq',
  }),
};

const year = casesYear as YearlyCases;

const CURRENT_MONTH =
  year.months.filter((m) => !m.planned && (m.totalRequests ?? 0) > 0).at(-1)?.month ?? '2026-01';

function monthTitle(m: { label: string; monthLabel?: string }): string {
  return m.monthLabel ?? `${m.label} ${year.year}`;
}

export default function FaqYearPage() {
  const current = year.months.find((m) => m.month === CURRENT_MONTH);
  const prev = year.months[year.months.findIndex((m) => m.month === CURRENT_MONTH) - 1];
  const resolvedMonths = year.months.filter((m) => !m.planned);
  const delta = (current?.totalRequests ?? 0) - (prev?.totalRequests ?? 0);
  const topCase = (current?.cases ?? []).slice().sort((a, b) => (b.count ?? 0) - (a.count ?? 0))[0];

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

      {/* Текущий месяц */}
      {current && (
        <div className="glass-card p-5 lg:col-span-2 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[#111827]">{monthTitle(current)}</h2>
              <p className="text-xs text-[#6b7280]">
                {current.totalRequests ?? 0} обращений
                {delta !== 0 && (
                  <span
                    className={`ml-1.5 text-[11px] font-bold ${
                      delta > 0 ? 'text-[#059669]' : 'text-[#dc2626]'
                    }`}
                  >
                    {delta > 0 ? '▲ +' : '▼ '}
                    {Math.abs(delta)} к прошлому месяцу
                  </span>
                )}
              </p>
            </div>
          </div>

          {(current.summary?.topTopics ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {(current.summary?.topTopics ?? []).slice(0, 4).map((t) => (
                <span
                  key={t.label}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold"
                >
                  {t.label} · {t.count}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {current.courseId && (
              <Link
                href={`/school/courses/${current.courseId}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a56db] hover:underline no-underline"
              >
                <Swords className="w-4 h-4" /> Потренироваться на кейсах
              </Link>
            )}
            {topCase?.instructionId && (
              <Link
                href={`/docs/${topCase.instructionId}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0d9488] hover:underline no-underline"
              >
                <BookOpen className="w-4 h-4" /> Подробнее в инструкции
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Активность по месяцам */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#1a56db]" />
          <h2 className="text-base font-semibold text-[#111827]">Активность по месяцам</h2>
        </div>
        <FaqMonthChart months={year.months} currentMonth={CURRENT_MONTH} />
      </div>

      <div className="mt-14 mb-6 flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-[#1a56db]" />
        <h2 className="text-xl font-bold text-[#111827]">Все обращения</h2>
        <span className="text-sm text-[#6b7280]">фильтр, поиск и сортировка по категориям, программам и месяцам</span>
      </div>

      <FaqCatalog months={year.months} />
    </div>
  );
}
