import Link from 'next/link';
import { ArrowRight, BookOpen, ExternalLink, ListChecks } from 'lucide-react';
import { PageHelp } from '@/components/layout/PageHelp';
import instructionsData from '@/data/instructions.json';
import type { Instruction } from '@/types';

const instructions = instructionsData as unknown as Instruction[];

const productLabels: Record<string, string> = {
  rk7: 'r_keeper 7',
  storehouse: 'StoreHouse Pro',
  delivery: 'Delivery',
  event: 'Event',
  waiter: 'Waiter & Cash Desk',
};

export default function InstructionsPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-[#111827]">Инструкции</h1>
          <PageHelp />
        </div>
        <p className="text-[#6b7280]">
          Инструкции-процессы на основе популярных запросов: как решить типовую задачу шаг за шагом
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <Link
          href="/faq"
          className="flex items-center gap-4 glass-card p-5 no-underline transition-all hover:-translate-y-0.5"
        >
          <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white text-lg">📊</span>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-[#111827]">Популярные обращения</div>
            <div className="text-sm text-[#6b7280]">
              Годовой срез обращений по месяцам — из них формируются инструкции-процессы
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#1a56db] shrink-0" />
        </Link>

        <a
          href="https://docs.rkeeper.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 glass-card p-5 no-underline transition-all hover:-translate-y-0.5"
        >
          <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center text-white">📖</span>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-[#111827]">Официальная документация</div>
            <div className="text-sm text-[#6b7280]">docs.rkeeper.ru — справка по продуктам r_keeper</div>
          </div>
          <ExternalLink className="w-5 h-5 text-[#0d9488] shrink-0" />
        </a>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <ListChecks className="w-4 h-4 text-[#1a56db]" />
        <h2 className="text-base font-semibold text-[#111827]">Инструкции-процессы</h2>
      </div>

      <div className="space-y-3">
        {instructions.map((ins) => (
          <Link
            key={ins.id}
            href={`/docs/${ins.id}`}
            className="glass-card p-5 no-underline transition-all hover:-translate-y-0.5 block"
          >
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center text-sm font-semibold">
                {ins.title[0]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-base font-medium text-[#1a56db]">{ins.title}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] font-semibold">
                    {productLabels[ins.product] || ins.product}
                  </span>
                </div>
                <p className="text-sm text-[#6b7280] line-clamp-2">{ins.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ins.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f4ff] text-[#1a56db]">{t}</span>
                  ))}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669]">{ins.steps.length} шагов</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-xs text-[#9ca3af] flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5" />
        Официальная справка: docs.rkeeper.ru. Здесь — инструкции-процессы отдела поддержки.
      </p>
    </div>
  );
}