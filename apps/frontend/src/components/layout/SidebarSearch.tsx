'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useUIStore } from '@/stores/ui';

interface Item {
  href: string;
  label: string;
  context: string;
}

const ITEMS: Item[] = [
  { href: '/', label: 'Главная', context: '' },
  { href: '/instructions', label: 'Инструкции', context: '' },
  { href: '/instructions/rkeeper/rk7', label: 'r_keeper 7', context: 'Десктоп' },
  { href: '/instructions/rkeeper/storehouse', label: 'StoreHouse Pro', context: 'Десктоп' },
  { href: '/instructions/rkeeper/delivery', label: 'Delivery', context: 'Облачные сервисы' },
  { href: '/instructions/rkeeper/event', label: 'Event', context: 'Облачные сервисы' },
  { href: '/instructions/rkeeper/waiter', label: 'Waiter & Cash Desk', context: 'Мобильные' },
  { href: '/booking', label: 'Консультации', context: 'Услуги' },
  { href: '/booking', label: 'Обучение', context: 'Услуги' },
  { href: '/chat', label: 'Чат с отделом', context: '' },
  { href: '/quiz', label: 'Викторина', context: '' },
  { href: '/profile', label: 'Личный кабинет', context: '' },
  { href: '/notifications', label: 'Уведомления', context: '' },
  { href: '/booking', label: 'Записаться', context: '' },
];

export function SidebarSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ITEMS.filter(
      (it) => it.label.toLowerCase().includes(q) || it.context.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        ref.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setQuery('');
        setOpen(false);
        ref.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const pick = (href: string) => {
    setQuery('');
    setOpen(false);
    setSidebarOpen(false);
    router.push(href);
  };

  return (
    <div className="relative px-3 pb-2">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f3f4f6] border border-transparent focus-within:border-[#1a56db] focus-within:bg-white transition-all">
        <Search className="w-4 h-4 text-[#9ca3af] shrink-0" />
        <input
          ref={ref}
          type="text"
          placeholder="Поиск... (Ctrl+K)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="flex-1 bg-transparent text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] min-w-0"
        />
      </div>
      {open && query.trim() && results.length > 0 && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-white rounded-lg shadow-lg border border-[#e5e7eb] py-1 z-50 max-h-64 overflow-y-auto">
          {results.map((it) => (
            <button
              key={`${it.href}-${it.label}`}
              onClick={() => pick(it.href)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[#f3f4f6] transition-colors"
            >
              <span className="text-[#374151]">{it.label}</span>
              {it.context && (
                <span className="text-[10px] text-[#9ca3af] ml-auto">{it.context}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
