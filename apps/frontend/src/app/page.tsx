import Link from 'next/link';
import { Tooltip } from '@/components/ui/Tooltip';
import { GraduationCap, BookOpen } from 'lucide-react';
import casesYear from '@/data/cases/yearly.json';
import type { YearlyCases } from '@/types';

const year = casesYear as YearlyCases;
const july = year.months.find((m) => m.month === '2026-07');
const june = year.months.find((m) => m.month === '2026-06');
const delta = (july?.count ?? 0) - (june?.count ?? 0);
const topCases = (july?.cases ?? []).slice(0, 3);

export default function HomePage() {
  return (
    <div className="bg-[#0f172a] min-h-svh flex flex-col">
      <section id="hero" className="flex-1 grid grid-cols-1 lg:grid-cols-2 relative max-w-[1440px] mx-auto w-full pt-24 lg:pt-0">
        <div className="text-white p-6 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-[rgba(13,148,136,0.2)] text-slate-50 px-3 py-1.5 rounded-full text-xs font-semibold w-fit mb-5">
            ✦ Консультации и обучение
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Экспертная поддержка <span className="text-[#0d9488]">пользователей rkeeper</span>
          </h1>
          <p className="text-base text-[#94a3b8] mb-4 max-w-md">
            Консультируем и обучаем сотрудников по работе с пользовательской частью rkeeper
          </p>
          <div className="flex gap-2 flex-wrap mb-8">
            <span className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4]">rkeeper</span>
            <span className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4]">storehouse</span>
            <span className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4]">delivery</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Tooltip
              content="Открытые курсы и тренажёры на реальных кейсах. Учиться можно без регистрации."
              side="top"
            >
              <Link
                href="/school"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1a56db] to-[#0d9488] text-white text-sm font-bold hover:scale-[1.02] hover:shadow-lg transition-all no-underline"
              >
                <GraduationCap className="w-4 h-4" />
                В школу
              </Link>
            </Tooltip>
            <Tooltip
              content="Инструкции-процессы на основе популярных запросов: как решить типовую задачу шаг за шагом."
              side="top"
            >
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.06)] text-white text-sm font-bold hover:bg-[rgba(255,255,255,0.12)] transition-all no-underline"
              >
                <BookOpen className="w-4 h-4" />
                Инструкции
              </Link>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 md:p-16 bg-gradient-to-br from-[#1e293b] to-[#0f172a] relative overflow-hidden">
          <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(26,86,219,0.3)] top-[10%] left-[10%]" />
          <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(13,148,136,0.25)] bottom-[10%] right-[10%]" />
          <div className="relative bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-5 md:p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">📅</span>
              <div>
                <div className="text-sm md:text-base font-semibold text-white">Популярное · {july?.monthLabel ?? ''}</div>
                <div className="text-xs text-[#94a3b8]">сравнение с прошлым месяцем</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className={`bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-xl px-3 py-2.5 ${june ? 'opacity-45' : 'opacity-30'}`}>
                <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wide">{june?.label ?? '—'}</div>
                <div className="text-[22px] font-extrabold text-white leading-none mt-0.5">{june?.count ?? 0}</div>
                <div className="text-[9.5px] text-[#94a3b8]">обращений</div>
              </div>
              <div className="bg-[rgba(13,148,136,0.08)] border border-[rgba(45,212,191,0.25)] rounded-xl px-3 py-2.5">
                <div className="text-[10px] font-bold text-[#5eead4] uppercase tracking-wide">{july?.label}</div>
                <div className="text-[22px] font-extrabold text-white leading-none mt-0.5">{july?.count ?? 0}</div>
                <div className="text-[9.5px] text-[#94a3b8]">обращений</div>
                <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-[#34d399] bg-[rgba(52,211,153,0.12)]">
                  ▲ +{delta}
                </div>
              </div>
            </div>

            {(july?.summary?.topTopics ?? []).slice(0, 2).map((t) => (
              <span
                key={t.label}
                className="inline-block mr-1.5 mb-1.5 text-[11px] px-2.5 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4] last:mr-0"
              >
                {t.label} · {t.count}
              </span>
            ))}

            <div className="space-y-1.5 mt-1 mb-4">
              {topCases.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/docs/cases/${c.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 no-underline hover:bg-[rgba(255,255,255,0.06)] transition-all group"
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-white/90 group-hover:text-[#5eead4] transition-colors">{c.title}</span>
                </Link>
              ))}
            </div>

            <Link
              href="/docs/cases"
              className="flex items-center gap-1 text-sm font-semibold text-[#2dd4bf] hover:gap-2 hover:text-[#5eead4] transition-all no-underline"
            >
              Смотреть все →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
