'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SearchX, ArrowLeft, BookOpen, Swords, TrendingUp } from 'lucide-react';
import casesYear from '@/data/cases/yearly.json';
import instructionsData from '@/data/instructions.json';
import type { YearlyCases, Instruction } from '@/types';

const year = casesYear as YearlyCases;
const instructions = instructionsData as unknown as Instruction[];

const productLabels: Record<string, string> = {
  rk7: 'r_keeper 7',
  storehouse: 'StoreHouse Pro',
  delivery: 'Delivery',
  event: 'Event',
  waiter: 'Waiter & Cash Desk',
};

export default function FaqCasePage() {
  const params = useParams<{ month: string; caseId: string }>();
  const month = year.months.find((m) => m.month === params.month);
  const current = month?.cases?.find((c) => c.id === params.caseId);
  const instruction = current?.instructionId
    ? instructions.find((i) => i.id === current.instructionId)
    : undefined;

  if (!current || !month) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <SearchX className="w-12 h-12 mx-auto text-[#9ca3af] mb-4" />
        <p className="text-[#6b7280]">Обращение не найдено</p>
        <Link href={`/faq/${params.month}`} className="text-[#1a56db] text-sm mt-2 inline-block hover:underline no-underline">
          Вернуться к обращениям месяца
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href={`/faq/${params.month}`}
          className="inline-flex items-center gap-1 text-sm text-[#1a56db] hover:underline no-underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Обращения · {month.monthLabel}
        </Link>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">{current.title}</h1>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] font-semibold">
            {productLabels[current.product] || current.product}
          </span>
          {typeof current.count === 'number' && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold">
              {current.count} обращений за месяц
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {current.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f4ff] text-[#1a56db] font-semibold">{t}</span>
          ))}
        </div>
      </div>

      {(current.request || instruction) && (
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#1a56db]" />
            <h2 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider">Обращение</h2>
          </div>
          <p className="text-[#374151] leading-relaxed">
            {current.request || instruction?.description}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {current.instructionId && (
          <Link
            href={`/docs/${current.instructionId}`}
            className="flex items-center gap-4 glass-card p-5 no-underline transition-all hover:-translate-y-0.5"
          >
            <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-semibold text-[#111827]">Читать инструкцию</span>
              <span className="block text-sm text-[#6b7280]">Полный процесс: шаги и типовые ошибки</span>
            </span>
          </Link>
        )}
        {current.courseId && current.lessonId && (
          <Link
            href={`/school/courses/${current.courseId}/lessons/${current.lessonId}`}
            className="flex items-center gap-4 glass-card p-5 no-underline transition-all hover:-translate-y-0.5"
          >
            <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center text-white">
              <Swords className="w-5 h-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-semibold text-[#111827]">Потренироваться в школе</span>
              <span className="block text-sm text-[#6b7280]">Тренажёр по этому кейсу</span>
            </span>
          </Link>
        )}
      </div>

      <div className="mt-4 pt-6 border-t border-[#e5e7eb]">
        <Link href="/faq" className="inline-flex items-center gap-1 text-sm text-[#1a56db] hover:underline no-underline">
          <ArrowLeft className="w-4 h-4" /> Все месяцы {year.year}
        </Link>
      </div>
    </div>
  );
}