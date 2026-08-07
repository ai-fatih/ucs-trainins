import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, ExternalLink, ListChecks, TrendingUp, CalendarDays } from 'lucide-react';
import { PageHelp } from '@/components/layout/PageHelp';
import casesYear from '@/data/cases/yearly.json';
import instructionsData from '@/data/instructions.json';
import type { YearlyCases, Instruction } from '@/types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/data/categories';
import { buildOpenGraph } from '@/lib/seo';

const year = casesYear as YearlyCases;
const instructions = instructionsData as unknown as Instruction[];

export const metadata: Metadata = {
  title: 'Топ-5 обращений по месяцам',
  description:
    'Топ-5 популярных обращений пользователей rkeeper по каждому месяцу: кейсы, разборы и связанные инструкции.',
  alternates: { canonical: 'https://ucs-service.vercel.app/faq-top' },
  openGraph: buildOpenGraph({
    title: 'Топ-5 обращений по месяцам',
    description:
      'Топ-5 популярных обращений пользователей rkeeper по каждому месяцу: кейсы, разборы и связанные инструкции.',
    url: 'https://ucs-service.vercel.app/faq-top',
  }),
};

export default function FaqTopListPage() {
  const topPerMonth = year.months.map((m) => {
    const cases = (m.cases ?? []).slice(0, 5);
    return {
      month: m,
      topCases: cases,
      instructionForCase: (caseId: string) => instructions.find((ins) => ins.sourceCaseIds.includes(caseId)),
    };
  });

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-[#111827]">Топ-5 обращений по месяцам</h1>
          <PageHelp />
        </div>
        <p className="text-[#6b7280]">
          Полный список самых частых запросов консультаций отдела за 2026 год. Для каждого обращения — краткое описание, ссылка на инструкцию-процесс и тренажёр в школе.
        </p>
      </div>

      <div className="space-y-8">
        {topPerMonth.map(({ month, topCases }) => {
          const title = month.monthLabel ?? `${month.label} ${year.year}`;
          return (
            <section key={month.month}>
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-[#1a56db]" />
                <h2 className="text-xl font-bold text-[#111827]">{title}</h2>
                <span className="text-sm text-[#6b7280]">({topCases.length} топовых)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topCases.map((c) => {
                  const instruction = instructions.find((ins) => ins.sourceCaseIds.includes(c.id));
                  return (
                    <div key={c.id} className="glass-card p-5">
                      <div className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center text-sm font-semibold">
                          {c.title[0]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium text-[#111827] mb-1">{c.title}</h3>
                          <p className="text-sm text-[#6b7280] mb-2 line-clamp-3">{c.request || '—'}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                              style={{
                                backgroundColor: CATEGORY_COLORS[c.category].bg,
                                color: CATEGORY_COLORS[c.category].text,
                              }}
                            >
                              {CATEGORY_LABELS[c.category]}
                            </span>
                            {c.tags.map((t) => (
                              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f4ff] text-[#1a56db]">{t}</span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            {instruction && (
                              <Link
                                href={`/docs/${instruction.id}`}
                                className="inline-flex items-center gap-1 text-xs text-[#1a56db] hover:underline no-underline"
                              >
                                <BookOpen className="w-3 h-3" /> Инструкция
                              </Link>
                            )}
                            {c.courseId && c.lessonId && (
                              <Link
                                href={`/school/courses/${c.courseId}/lessons/${c.lessonId}`}
                                className="inline-flex items-center gap-1 text-xs text-[#059669] hover:underline no-underline"
                              >
                                <TrendingUp className="w-3 h-3" /> Тренажёр
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-12 pt-6 border-t border-[#e5e7eb]">
        <h2 className="text-lg font-bold text-[#111827] mb-4">Полное наполнение инструкций</h2>
        <p className="text-sm text-[#6b7280] mb-4">
          Каждый топовый запрос теперь перерос в инструкцию-процесс с пошаговым решением и типичными ошибками.
          Список инструкций обновляется ежемесячно по мере поступления новых обращений.
        </p>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1a56db] to-[#0d9488] text-white text-sm font-bold no-underline hover:opacity-90 transition-opacity"
        >
          <BookOpen className="w-4 h-4" />
          Все инструкции
        </Link>
      </div>
    </div>
  );
}