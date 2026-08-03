import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { docProducts } from '@/data/docs/catalog';

interface Props {
  productId: string;
  currentHref: string;
}

export default function InstructionPager({ productId, currentHref }: Props) {
  const product = docProducts.find((p) => p.id === productId);
  if (!product) return null;

  const scenarios = product.scenarios;
  const idx = scenarios.findIndex((s) => s.href === currentHref);
  if (idx === -1) return null;

  const prev = idx > 0 ? scenarios[idx - 1] : undefined;
  const next = idx < scenarios.length - 1 ? scenarios[idx + 1] : undefined;

  return (
    <div className="no-print mt-8 pt-6 border-t border-[#e5e7eb]">
      <div className="flex items-stretch gap-3">
        <div className="flex-1 min-w-0">
          {prev ? (
            <Link
              href={prev.href}
              className="group flex items-start gap-2 h-full rounded-lg border border-[#e5e7eb] p-3 no-underline hover:bg-[#f0f4ff] hover:border-[#bfdbfe] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#9ca3af] mt-0.5 shrink-0 group-hover:text-[#1a56db]" />
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-wider text-[#9ca3af]">Предыдущая</span>
                <span className="block text-sm font-semibold text-[#374151] truncate">{prev.label}</span>
              </span>
            </Link>
          ) : null}
        </div>
        <div className="flex-1 min-w-0">
          {next ? (
            <Link
              href={next.href}
              className="group flex items-start justify-end gap-2 h-full rounded-lg border border-[#e5e7eb] p-3 no-underline hover:bg-[#f0f4ff] hover:border-[#bfdbfe] transition-colors text-right"
            >
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-wider text-[#9ca3af]">Следующая</span>
                <span className="block text-sm font-semibold text-[#374151] truncate">{next.label}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-[#9ca3af] mt-0.5 shrink-0 group-hover:text-[#1a56db]" />
            </Link>
          ) : null}
        </div>
      </div>
      <Link href={product.href} className="inline-block mt-4 text-sm text-[#1a56db] hover:underline no-underline">
        &larr; Все инструкции {product.label}
      </Link>
    </div>
  );
}