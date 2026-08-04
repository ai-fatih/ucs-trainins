'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CornerDownLeft } from 'lucide-react';
import { useUIStore } from '@/stores/ui';
import { searchIndex } from '@/data/search-index';

function groupOf(href: string): string {
  if (href === '/') return 'Главная';
  if (href.startsWith('/docs')) return 'Инструкции';
  if (href.startsWith('/faq')) return 'Популярные обращения';
  if (href.startsWith('/school')) return 'Школа';
  return 'Разделы';
}

const GROUP_ORDER = ['Главная', 'Инструкции', 'Популярные обращения', 'Школа', 'Разделы'];

export function SearchDialog() {
  const open = useUIStore((s) => s.searchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex.slice(0, 8);
    return searchIndex
      .filter((it) => it.label.toLowerCase().includes(q) || it.context.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof searchIndex>();
    for (const it of results) {
      const g = groupOf(it.href);
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(it);
    }
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({ label: g, items: map.get(g)! }));
  }, [results]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  const goTo = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) goTo(item.href);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh] bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#e5e7eb] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#f3f4f6]">
          <Search className="w-4 h-4 text-[#9ca3af] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по сайту..."
            className="flex-1 bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-[10px] px-1.5 py-0.5 rounded border border-[#e5e7eb] text-[#9ca3af] hover:text-[#111827]"
            aria-label="Закрыть поиск"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-1">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-[#9ca3af]">Ничего не найдено</div>
          ) : (
            (() => {
              let flatIdx = 0;
              return groups.map((g) => (
                <div key={g.label}>
                  <div className="px-4 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                    {g.label}
                  </div>
                  {g.items.map((it) => {
                    const i = flatIdx++;
                    return (
                      <button
                        key={`${it.href}-${it.label}`}
                        onClick={() => goTo(it.href)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          i === activeIndex ? 'bg-[#1a56db]/5' : ''
                        }`}
                      >
                        <span className="text-sm text-[#111827]">{it.label}</span>
                        {it.context && (
                          <span className="text-[10px] text-[#9ca3af] ml-auto">{it.context}</span>
                        )}
                        {i === activeIndex && (
                          <CornerDownLeft className="w-3.5 h-3.5 text-[#9ca3af] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ));
            })()
          )}
        </div>
      </div>
    </div>
  );
}
