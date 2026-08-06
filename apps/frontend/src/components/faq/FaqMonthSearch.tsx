'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import type { YearlyCase } from '@/types';
import { PRODUCT_LABELS } from '@/data/products';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/data/categories';

interface Props {
  monthStr: string;
  cases: YearlyCase[];
  isPlanned: boolean;
}

export function FaqMonthSearch({ monthStr, cases, isPlanned }: Props) {
  const params = useParams<{ month: string }>();
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q') ?? '';
    setQuery(q);
  }, []);

  const updateQuery = (value: string) => {
    setQuery(value);
    const paramsObj = new URLSearchParams(window.location.search);
    if (value) paramsObj.set('q', value);
    else paramsObj.delete('q');
    router.replace(
      paramsObj.toString() ? `/faq/${params.month}?${paramsObj}` : `/faq/${params.month}`,
      { scroll: false },
    );
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return cases;
    const q = query.toLowerCase();
    return cases.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.product.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query, cases]);

  return (
    <>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
        <input
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          placeholder="Поиск по обращениям, темам, продуктам..."
          className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)] bg-white/80"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/faq/${monthStr}/${c.id}`}
            className="glass-card p-5 no-underline transition-all hover:-translate-y-0.5 block"
          >
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center text-sm font-semibold">
                {c.title[0]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-base font-medium text-[#1a56db]">{c.title}</span>
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      backgroundColor: CATEGORY_COLORS[c.category].bg,
                      color: CATEGORY_COLORS[c.category].text,
                    }}
                  >
                    {CATEGORY_LABELS[c.category]}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] font-semibold">
                    {PRODUCT_LABELS[c.product as keyof typeof PRODUCT_LABELS] || c.product}
                  </span>
                  {typeof c.count === 'number' && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold">
                      {c.count} обр.
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f4ff] text-[#1a56db]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#9ca3af]">
            {isPlanned ? 'Разборы этого месяца будут добавлены' : 'Ничего не найдено'}
          </div>
        )}
      </div>
    </>
  );
}
