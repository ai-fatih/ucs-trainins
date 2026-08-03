import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { docProducts } from '@/data/docs/catalog';
import { PageHelp } from '@/components/layout/PageHelp';

export default function InstructionsPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-[#111827]">Документация</h1>
          <PageHelp />
        </div>
        <p className="text-[#6b7280]">Документация и пошаговые руководства по продуктам r_keeper</p>
      </div>

      <Link
        href="/docs/cases"
        className="flex items-center gap-4 glass-card p-5 mb-8 no-underline transition-all hover:-translate-y-0.5"
      >
        <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white text-lg">📊</span>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-[#111827]">Кейсы месяца</div>
          <div className="text-sm text-[#6b7280]">Разбор реальных обращений за прошлый месяц и тренажёр на их основе</div>
        </div>
        <ArrowRight className="w-5 h-5 text-[#1a56db] shrink-0" />
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docProducts.map((p) => (
          <div key={p.id} className="glass-card p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${p.bgGradient} flex items-center justify-center text-white font-bold text-lg`}
              >
                {p.label[0]}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">{p.label}</h2>
                <p className="text-xs text-[#6b7280]">{p.desc}</p>
              </div>
            </div>

            <ul className="space-y-2.5 flex-1">
              {p.scenarios.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="no-underline group">
                    <span className="text-sm font-medium text-[#1a56db] group-hover:underline flex items-start gap-1.5">
                      <span className="text-[#0d9488] shrink-0">›</span>
                      <span>{s.label}</span>
                    </span>
                    {s.desc && <p className="text-xs text-[#6b7280] pl-4">{s.desc}</p>}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={p.href}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1a56db] no-underline hover:underline"
            >
              Все сценарии {p.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
