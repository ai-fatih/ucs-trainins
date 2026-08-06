import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TrendingUp, Swords, ArrowLeft } from 'lucide-react';
import casesYear from '@/data/cases/yearly.json';
import type { YearlyCases } from '@/types';
import { FaqMonthSearch } from '@/components/faq/FaqMonthSearch';

const year = casesYear as YearlyCases;

export function generateStaticParams() {
  return year.months.map((m) => ({ month: m.month }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ month: string }>;
}): Promise<Metadata> {
  const { month: monthStr } = await params;
  const month = year.months.find((m) => m.month === monthStr);
  if (!month) return { title: 'Месяц не найден' };

  const title = month.monthLabel ?? `${month.label} ${year.year}`;
  const url = `https://ucs-service.vercel.app/faq/${monthStr}`;
  const description = `Разбор реальных обращений консультаций rkeeper за ${title.toLowerCase()}. ${month.totalRequests ?? 0} обращений.`;

  return {
    title: `Обращения · ${title}`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `Обращения · ${title}`, description, url },
  };
}

export default async function FaqMonthPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month: monthStr } = await params;
  const idx = year.months.findIndex((m) => m.month === monthStr);
  const month = idx >= 0 ? year.months[idx] : undefined;
  const prev = month ? year.months[idx - 1] : undefined;
  const delta = (month?.totalRequests ?? 0) - (prev?.totalRequests ?? 0);

  if (!month) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <p className="text-[#6b7280]">Месяц не найден</p>
        <Link
          href="/faq"
          className="text-[#1a56db] text-sm mt-2 inline-block hover:underline no-underline"
        >
          Вернуться к годовому срезу
        </Link>
      </div>
    );
  }

  const title = month.monthLabel ?? `${month.label} ${year.year}`;
  const isPlanned = month.planned;

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/faq"
          className="inline-flex items-center gap-1 text-sm text-[#1a56db] hover:underline no-underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Все месяцы {year.year}
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-[#111827]">Обращения · {title}</h1>
        </div>
        <p className="text-[#6b7280]">
          Разбор реальных обращений консультаций за {title.toLowerCase()}
          {delta > 0 && (
            <span className="ml-1.5 text-[11px] font-bold text-[#059669]">
              ▲ +{delta} к прошлому месяцу
            </span>
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
              <h2 className="text-base font-semibold text-[#111827]">
                Итоги {title.toLowerCase()}
              </h2>
              <p className="text-xs text-[#6b7280]">Топ тем обращений в консультациях отдела</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(month.summary?.topTopics ?? []).map((t) => (
              <span
                key={t.label}
                className="text-xs px-3 py-1.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold"
              >
                {t.label} · {t.count}
              </span>
            ))}
            {isPlanned && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-[#f3f4f6] text-[#9ca3af] font-semibold">
                данные появятся позже
              </span>
            )}
          </div>
        </div>

        <div className="glass-card p-5 flex flex-col justify-center">
          <div className="text-3xl font-bold text-[#111827] mb-1">{month.totalRequests ?? 0}</div>
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

      <FaqMonthSearch monthStr={monthStr} cases={month.cases ?? []} isPlanned={isPlanned ?? false} />
    </div>
  );
}
