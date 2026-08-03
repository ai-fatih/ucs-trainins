'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SearchX, ArrowLeft, Swords, Stethoscope, Lightbulb, Wrench, ShieldCheck } from 'lucide-react';
import type { MonthlyCases } from '@/types';
import casesData from '@/data/cases/monthly.json';

const monthly = casesData as unknown as MonthlyCases;

const productLabels: Record<string, string> = {
  rk7: 'r_keeper 7',
  storehouse: 'StoreHouse Pro',
  delivery: 'Delivery',
  event: 'Event',
  waiter: 'Waiter & Cash Desk',
};

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const current = monthly.cases.find((c) => c.id === id);

  if (!current) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <SearchX className="w-12 h-12 mx-auto text-[#9ca3af] mb-4" />
        <p className="text-[#6b7280]">Кейс не найден</p>
        <Link href="/docs/cases" className="text-[#1a56db] text-sm mt-2 inline-block hover:underline">
          Вернуться к кейсам месяца
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3 flex-wrap">
          <Link href="/docs" className="text-[#1a56db] hover:underline no-underline">Документация</Link>
          <span>/</span>
          <Link href="/docs/cases" className="text-[#1a56db] hover:underline no-underline">Кейсы месяца</Link>
          <span>/</span>
          <span className="text-[#111827]">{current.title}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">{current.title}</h1>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] font-semibold">
            {productLabels[current.product] || current.product}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {current.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f4ff] text-[#1a56db] font-semibold">{t}</span>
          ))}
        </div>
      </div>

      <div className="glass-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Stethoscope className="w-4 h-4 text-[#1a56db]" />
          <h2 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider">Ситуация</h2>
        </div>
        <p className="text-[#111827] leading-relaxed">{current.situation}</p>
      </div>

      <div className="glass-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider mb-3">Симптомы</h2>
        <ul className="space-y-2">
          {current.symptoms.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-[#374151]">
              <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">!</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider mb-4">Диагностика</h2>
        <ol className="space-y-3">
          {current.diagnostics.map((d, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#e8effa] text-[#1a56db] flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="text-sm text-[#374151] leading-relaxed">{d}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl border border-[#fde68a] bg-[#fefce8] p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-[#ca8a04]" />
          <h2 className="text-sm font-semibold text-[#92400e] uppercase tracking-wider">Причина</h2>
        </div>
        <p className="text-sm text-[#92400e] leading-relaxed">{current.rootCause}</p>
      </div>

      <div className="glass-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-4 h-4 text-[#059669]" />
          <h2 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider">Решение</h2>
        </div>
        <ol className="space-y-3">
          {current.solution.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="text-sm text-[#374151] leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="glass-card p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-[#7c3aed]" />
          <h2 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider">Профилактика</h2>
        </div>
        <ul className="space-y-2">
          {current.prevention.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-[#374151]">
              <span className="text-[#7c3aed] mt-0.5">•</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={`/school/courses/cases-2026-07/lessons/${current.trainerLessonId}`}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white no-underline transition-all bg-gradient-to-r from-[#1a56db] to-[#0d9488] hover:shadow-lg hover:-translate-y-0.5 text-sm mb-8"
      >
        <Swords className="w-4 h-4" />
        Потренироваться на кейсе
      </Link>

      <div className="mt-4 pt-6 border-t border-[#e5e7eb]">
        <Link href="/docs/cases" className="inline-flex items-center gap-1 text-sm text-[#1a56db] hover:underline no-underline">
          <ArrowLeft className="w-4 h-4" /> Все кейсы месяца
        </Link>
      </div>
    </div>
  );
}
