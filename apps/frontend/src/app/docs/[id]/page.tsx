import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Swords, Link2, Wrench, AlertTriangle } from 'lucide-react';
import { PageHelp } from '@/components/layout/PageHelp';
import DocPageToolbar from '@/components/docs/DocPageToolbar';
import instructionsData from '@/data/instructions.json';
import casesYear from '@/data/cases/yearly.json';
import type { Instruction, YearlyCases } from '@/types';
import { PRODUCT_LABELS } from '@/data/products';

const instructions = instructionsData as unknown as Instruction[];
const year = casesYear as YearlyCases;

export function generateStaticParams() {
  return instructions.map((i) => ({ id: i.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const ins = instructions.find((i) => i.id === id);
  if (!ins) return { title: 'Инструкция не найдена' };

  const url = `https://ucs-service.vercel.app/docs/${ins.id}`;
  return {
    title: ins.title,
    description: ins.description,
    alternates: { canonical: url },
    openGraph: {
      title: ins.title,
      description: ins.description,
      url,
      type: 'article',
    },
  };
}

export default async function InstructionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = instructions.findIndex((i) => i.id === id);
  const current = index >= 0 ? instructions[index] : undefined;

  if (!current) notFound();

  const prev = index > 0 ? instructions[index - 1] : undefined;
  const next = index < instructions.length - 1 ? instructions[index + 1] : undefined;

  const sourceCases = year.months.flatMap((m) =>
    (m.cases ?? [])
      .filter((c) => current.sourceCaseIds.includes(c.id))
      .map((c) => ({
        month: m.month,
        monthLabel: m.monthLabel ?? `${m.label} ${year.year}`,
        caseId: c.id,
        title: c.title,
      })),
  );

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: current.title,
            description: current.description,
            step: current.steps.map((step, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: step.title,
              text: step.body,
            })),
          }),
        }}
      />
      <div className="mb-8">
        <Link href="/docs" className="inline-flex items-center gap-1 text-sm text-[#1a56db] hover:underline no-underline mb-4">
          <ArrowLeft className="w-4 h-4" /> Все инструкции
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">{current.title}</h1>
          <PageHelp />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] font-semibold">
            {PRODUCT_LABELS[current.product as keyof typeof PRODUCT_LABELS] || current.product}
          </span>
          {current.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f4ff] text-[#1a56db] font-semibold">{t}</span>
          ))}
        </div>
        <p className="mt-3 text-[#6b7280] leading-relaxed">{current.description}</p>
      </div>

      {current.stub ? (
        <div className="glass-card p-6 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-5 h-5 text-[#9ca3af]" />
            <h2 className="text-xl font-semibold text-[#111827]">Инструкция</h2>
          </div>
          <p className="text-[#6b7280] leading-relaxed">
            Скоро здесь будет инструкция. Мы готовим пошаговый разбор этого обращения.
          </p>
        </div>
      ) : (
        <>
      <DocPageToolbar steps={current.steps} />

      <div className="glass-card p-6 mb-10">
        <h2 id="steps" className="text-xl font-semibold text-[#111827] mb-6">Пошаговая инструкция</h2>
        <ol className="space-y-6">
          {current.steps.map((step, i) => (
            <li key={i} id={`step-${i}`} className="pl-2">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center text-sm font-semibold">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-[#111827] mb-1">{step.title}</h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="glass-card p-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-5 h-5 text-[#059669]" />
          <h2 id="errors" className="text-xl font-semibold text-[#111827]">Типовые ошибки</h2>
        </div>
        <div className="space-y-4">
          {current.commonErrors.map((err, i) => (
            <div key={i} className="border border-[#e5e7eb] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">!</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111827] mb-1">{err.error}</p>
                  <p className="text-xs text-[#6b7280] mb-2">{err.reason}</p>
                  <p className="text-sm text-[#1a56db]">{err.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}

      {sourceCases.length > 0 && (
        <div className="glass-card p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-5 h-5 text-[#1a56db]" />
            <h2 className="text-xl font-semibold text-[#111827]">Из каких обращений</h2>
          </div>
          <ul className="space-y-2">
            {sourceCases.map((c) => (
              <li key={`${c.month}/${c.caseId}`}>
                <Link
                  href={`/faq/${c.month}/${c.caseId}`}
                  className="text-sm text-[#1a56db] hover:underline no-underline inline-flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> {c.title}
                </Link>
                <span className="ml-1 text-[10px] text-[#9ca3af]">{c.monthLabel}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="no-print mt-8 pt-6 border-t border-[#e5e7eb]">
        <div className="flex items-stretch gap-3 mb-6">
          {prev ? (
            <Link
              href={`/docs/${prev.id}`}
              className="group flex items-start gap-2 flex-1 rounded-lg border border-[#e5e7eb] p-3 hover:border-[#1a56db]/40 no-underline transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#9ca3af] mt-0.5 shrink-0" />
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-wider text-[#9ca3af]">Предыдущая</span>
                <span className="block text-sm font-semibold text-[#374151]">{prev.title}</span>
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next && (
            <Link
              href={`/docs/${next.id}`}
              className="group flex items-start justify-end gap-2 flex-1 rounded-lg border border-[#e5e7eb] p-3 hover:border-[#1a56db]/40 no-underline transition-colors text-right"
            >
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-wider text-[#9ca3af]">Следующая</span>
                <span className="block text-sm font-semibold text-[#374151]">{next.title}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-[#9ca3af] mt-0.5 shrink-0" />
            </Link>
          )}
        </div>

        <Link
          href={`/school/courses/${current.courseId}/lessons/${current.lessonId}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1a56db] to-[#0d9488] text-white text-sm font-bold no-underline hover:opacity-90 transition-opacity"
        >
          <Swords className="w-4 h-4" />
          Потренироваться в школе
        </Link>
      </div>
    </div>
  );
}