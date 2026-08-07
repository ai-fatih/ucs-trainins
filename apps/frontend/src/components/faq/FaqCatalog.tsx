'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, RotateCcw, ArrowRight } from 'lucide-react';
import type { YearMonth, CaseCategory } from '@/types';
import { CATEGORY_LABELS, CATEGORY_OPTIONS, CATEGORY_COLORS } from '@/data/categories';
import { PRODUCT_LABELS, PRODUCT_OPTIONS } from '@/data/products';

type SortKey = 'count-desc' | 'count-asc' | 'month-desc' | 'month-asc' | 'title-asc' | 'category-asc';

interface FlattenedItem {
  monthKey: string;
  monthLabel: string;
  caseData: NonNullable<YearMonth['cases']>[number];
}

interface Props {
  months: YearMonth[];
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'count-desc', label: 'Сначала частые' },
  { value: 'count-asc', label: 'Сначала редкие' },
  { value: 'month-desc', label: 'Новые месяцы' },
  { value: 'month-asc', label: 'Старые месяцы' },
  { value: 'title-asc', label: 'По алфавиту' },
  { value: 'category-asc', label: 'По категории' },
];

export function FaqCatalog({ months }: Props) {
  const router = useRouter();

  const [products, setProducts] = useState<string[]>([]);
  const [categories, setCategories] = useState<CaseCategory[]>([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('count-desc');

  const availableMonths = useMemo(
    () => months.filter((m) => !m.planned && (m.cases ?? []).length > 0),
    [months],
  );
  const monthOptions = useMemo(
    () =>
      availableMonths.map((m) => ({
        value: m.month,
        label: m.monthLabel ?? `${m.label} ${m.month.slice(0, 4)}`,
      })),
    [availableMonths],
  );

  // инициализация из URL один раз
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const product = sp.get('product');
    const cat = sp.get('cat');
    const fromP = sp.get('from');
    const toP = sp.get('to');
    const q = sp.get('q');
    const sortP = sp.get('sort');
    if (product) setProducts(product.split(',').filter(Boolean));
    if (cat) setCategories(cat.split(',') as CaseCategory[]);
    if (fromP) setFrom(fromP);
    if (toP) setTo(toP);
    if (q) setQuery(q);
    if (sortP && SORT_OPTIONS.some((o) => o.value === sortP)) setSort(sortP as SortKey);
  }, []);

  const syncUrl = (patch: Record<string, string>) => {
    const sp = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(patch)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    const qs = sp.toString();
    router.replace(qs ? `/faq?${qs}` : '/faq', { scroll: false });
  };

  const allItems = useMemo<FlattenedItem[]>(() => {
    const items: FlattenedItem[] = [];
    for (const m of availableMonths) {
      for (const c of m.cases ?? []) {
        items.push({
          monthKey: m.month,
          monthLabel: m.monthLabel ?? `${m.label} ${m.month.slice(0, 4)}`,
          caseData: c,
        });
      }
    }
    return items;
  }, [availableMonths]);

  const filtered = useMemo(() => {
    let items = allItems;

    if (products.length > 0) {
      items = items.filter((i) => products.includes(i.caseData.product));
    }
    if (categories.length > 0) {
      items = items.filter((i) => categories.includes(i.caseData.category));
    }
    if (from) items = items.filter((i) => i.monthKey >= from);
    if (to) items = items.filter((i) => i.monthKey <= to);

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (i) =>
          i.caseData.title.toLowerCase().includes(q) ||
          i.caseData.tags.some((t) => t.toLowerCase().includes(q)) ||
          CATEGORY_LABELS[i.caseData.category].toLowerCase().includes(q),
      );
    }

    const sorted = [...items];
    switch (sort) {
      case 'count-desc':
        sorted.sort((a, b) => (b.caseData.count ?? 0) - (a.caseData.count ?? 0));
        break;
      case 'count-asc':
        sorted.sort((a, b) => (a.caseData.count ?? 0) - (b.caseData.count ?? 0));
        break;
      case 'month-desc':
        sorted.sort((a, b) => b.monthKey.localeCompare(a.monthKey));
        break;
      case 'month-asc':
        sorted.sort((a, b) => a.monthKey.localeCompare(b.monthKey));
        break;
      case 'title-asc':
        sorted.sort((a, b) => a.caseData.title.localeCompare(b.caseData.title, 'ru'));
        break;
      case 'category-asc':
        sorted.sort(
          (a, b) =>
            CATEGORY_LABELS[a.caseData.category].localeCompare(
              CATEGORY_LABELS[b.caseData.category],
              'ru',
            ) || b.monthKey.localeCompare(a.monthKey),
        );
        break;
    }
    return sorted;
  }, [allItems, products, categories, from, to, query, sort]);

  const hasActiveFilters =
    products.length > 0 || categories.length > 0 || !!from || !!to || !!query.trim();

  const reset = () => {
    setProducts([]);
    setCategories([]);
    setFrom('');
    setTo('');
    setQuery('');
    setSort('count-desc');
    syncUrl({ product: '', cat: '', from: '', to: '', q: '', sort: '' });
  };

  const toggleList = (key: 'products' | 'categories', value: string) => {
    if (key === 'products') {
      const next = products.includes(value)
        ? products.filter((p) => p !== value)
        : [...products, value];
      setProducts(next);
      syncUrl({ product: next.join(',') });
    } else {
      const next = categories.includes(value as CaseCategory)
        ? categories.filter((c) => c !== value)
        : [...categories, value as CaseCategory];
      setCategories(next);
      syncUrl({ cat: next.join(',') });
    }
  };

  return (
    <div>
      {/* Панель фильтров */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#1a56db]" />
            <h3 className="text-sm font-semibold text-[#111827]">Фильтры</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a56db] hover:underline no-underline cursor-pointer bg-transparent border-0"
            >
              <RotateCcw className="w-3 h-3" /> Сбросить
            </button>
          )}
        </div>

        {/* Поиск */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              syncUrl({ q: e.target.value });
            }}
            placeholder="Поиск по названию, тегам, категории..."
            className="w-full pl-12 pr-4 py-2.5 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)] bg-white/80"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Категории */}
          <div>
            <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-2">
              Категория
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_OPTIONS.map((opt) => {
                const active = categories.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleList('categories', opt.value)}
                    className={`px-2.5 py-1 text-[11px] rounded-full font-semibold border transition-all cursor-pointer ${
                      active
                        ? 'border-[#1a56db] bg-[#e8effa] text-[#1a56db]'
                        : 'border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] hover:border-[#1a56db]/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Продукты */}
          <div>
            <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-2">
              Программа
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRODUCT_OPTIONS.map((opt) => {
                const active = products.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleList('products', opt.value)}
                    className={`px-2.5 py-1 text-[11px] rounded-full font-semibold border transition-all cursor-pointer ${
                      active
                        ? 'border-[#0d9488] bg-[#ecfdf5] text-[#0d9488]'
                        : 'border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] hover:border-[#0d9488]/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Диапазон месяцев + сортировка */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <label className="block">
            <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-1 block">
              С месяца
            </span>
            <select
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                syncUrl({ from: e.target.value });
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] bg-white/80"
            >
              <option value="">Все</option>
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-1 block">
              По месяц
            </span>
            <select
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                syncUrl({ to: e.target.value });
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] bg-white/80"
            >
              <option value="">Все</option>
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-1 block">
              Сортировка
            </span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                syncUrl({ sort: e.target.value });
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] bg-white/80"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Счётчик */}
      <div className="text-sm text-[#6b7280] mb-4">
        Найдено: <span className="font-bold text-[#111827]">{filtered.length}</span>{' '}
        {filtered.length === 1 ? 'обращение' : 'обращений'}
      </div>

      {/* Результаты — плоский список */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(({ monthKey, monthLabel, caseData: c }) => {
            const cat = CATEGORY_COLORS[c.category];
            return (
              <Link
                key={`${monthKey}/${c.id}`}
                href={`/faq/${monthKey}/${c.id}`}
                className="glass-card p-5 no-underline transition-all hover:-translate-y-0.5 block group"
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
                        style={{ backgroundColor: cat.bg, color: cat.text }}
                      >
                        {CATEGORY_LABELS[c.category]}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] font-semibold">
                        {PRODUCT_LABELS[c.product as keyof typeof PRODUCT_LABELS] || c.product}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f0f4ff] text-[#1a56db] font-semibold">
                        {monthLabel}
                      </span>
                      {typeof c.count === 'number' && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold">
                          {c.count} обр.
                        </span>
                      )}
                    </div>
                    {c.request && <p className="text-sm text-[#6b7280] line-clamp-2 mb-2">{c.request}</p>}
                    <div className="flex flex-wrap gap-1.5">
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
                  <ArrowRight className="w-4 h-4 text-[#9ca3af] shrink-0 mt-1 transition-all group-hover:text-[#1a56db] group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-[#9ca3af]">
          <div className="text-4xl mb-2">🔍</div>
          <p className="mb-3">По выбранным фильтрам ничего не найдено</p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#1a56db] hover:underline no-underline cursor-pointer bg-transparent border-0"
          >
            <RotateCcw className="w-3 h-3" /> Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}