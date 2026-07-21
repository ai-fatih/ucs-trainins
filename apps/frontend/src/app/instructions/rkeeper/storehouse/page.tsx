'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

const sections = [
  {
    title: 'Документы складского учёта',
    items: [
      { href: '/instructions/rkeeper/storehouse/write-off', label: 'Списание товаров', desc: 'Создание и проведение документа списания' },
      { href: '/instructions/rkeeper/storehouse/inventory', label: 'Инвентаризация', desc: 'Проведение инвентаризации склада' },
      { href: '/instructions/rkeeper/storehouse/arrival', label: 'Оприходование товаров', desc: 'Оформление поступления товаров на склад' },
    ],
  },
];

export default function StoreHousePage() {
  const [query, setQuery] = useState('');

  const filtered = sections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (it) => it.label.toLowerCase().includes(query.toLowerCase()) || it.desc.toLowerCase().includes(query.toLowerCase()),
      ),
    }))
    .filter((sec) => sec.items.length > 0);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <span className="text-[#111827]">StoreHouse Pro</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">StoreHouse Pro</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Система управления складом, производством и кухней. В этом разделе &mdash; инструкции по основным операциям в приложении StoreHouse Pro.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по инструкциям..."
          className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)] bg-white/80"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-[#111827] mb-3">{section.title}</h2>
            <div className="grid gap-3">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="glass-card p-5 no-underline transition-all hover:-translate-y-0.5"
                >
                  <span className="text-base font-medium text-[#1a56db]">{item.label}</span>
                  <span className="block text-sm text-[#6b7280] mt-1">{item.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#9ca3af]">Ничего не найдено</div>
        )}
      </div>
    </div>
  );
}
