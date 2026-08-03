import Link from 'next/link';
import { Tooltip } from '@/components/ui/Tooltip';
import { GraduationCap, BookOpen, TrendingUp, ChevronRight } from 'lucide-react';

const heroHighlights: { href: string; title: string; desc: string; icon: React.ElementType; accent: string }[] = [
  { href: '/docs', title: 'Документация', desc: 'Пошаговые инструкции по всем продуктам rkeeper', icon: BookOpen, accent: 'text-[#5eead4]' },
  { href: '/school', title: 'Школа', desc: 'Открытые курсы и тренажёры для ваших сотрудников', icon: GraduationCap, accent: 'text-[#93c5fd]' },
  { href: '/docs/cases', title: 'Кейсы месяца', desc: 'Разбор реальных обращений и типовых ошибок', icon: TrendingUp, accent: 'text-[#f59e0b]' },
];

export default function HomePage() {
  return (
    <div className="bg-[#0f172a] min-h-svh flex flex-col">
      <section id="hero" className="flex-1 grid grid-cols-1 lg:grid-cols-2 relative max-w-[1440px] mx-auto w-full">
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
              content="Пошаговые инструкции по продуктам rkeeper: r_keeper 7, StoreHouse, Delivery, Event, Waiter."
              side="top"
            >
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.06)] text-white text-sm font-bold hover:bg-[rgba(255,255,255,0.12)] transition-all no-underline"
              >
                <BookOpen className="w-4 h-4" />
                Документация
              </Link>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 p-6 md:p-16 bg-gradient-to-br from-[#1e293b] to-[#0f172a] relative overflow-hidden">
          <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(26,86,219,0.3)] top-[10%] left-[10%]" />
          <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(13,148,136,0.25)] bottom-[10%] right-[10%]" />
          {heroHighlights.map((h) => (
            <Link
              key={h.href}
              href={h.href}
              className="relative bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-4 md:p-5 flex items-start gap-4 no-underline hover:border-[#0d9488]/30 hover:bg-[rgba(255,255,255,0.08)] transition-all group"
            >
              <span className={`w-11 h-11 rounded-xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 ${h.accent}`}>
                <h.icon className="w-5 h-5" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm md:text-base font-semibold text-white">{h.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#0d9488] group-hover:translate-x-0.5 transition-all" />
                </span>
                <span className="text-xs text-[#94a3b8] leading-snug block mt-0.5">{h.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
