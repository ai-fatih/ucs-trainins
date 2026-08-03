'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { docSections } from '@/data/docs/catalog';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const q = query.trim().toLowerCase();
  const filteredSections = q
    ? docSections
        .map((s) => ({
          ...s,
          items: s.items
            .map((item) => ({
              ...item,
              children: item.children?.filter((c) => c.label.toLowerCase().includes(q)),
            }))
            .filter(
              (item) => item.label.toLowerCase().includes(q) || (item.children?.length ?? 0) > 0,
            ),
        }))
        .filter((s) => s.items.length > 0)
    : docSections;

  const sidebar = (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по документации..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#e5e7eb] outline-none focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)] bg-white/80"
        />
      </div>

      <nav className="flex flex-col gap-5">
        <div className="flex flex-col gap-0.5">
          <Link
            href="/docs"
            aria-current={pathname === '/docs' ? 'page' : undefined}
            className={`text-sm font-semibold px-2 py-1.5 rounded-lg no-underline transition-colors ${
              pathname === '/docs'
                ? 'text-[#1a56db] bg-[#1a56db]/10'
                : 'text-[#111827] hover:bg-[#1a56db]/5'
            }`}
          >
            Все инструкции
          </Link>
        </div>

        {filteredSections.map((section) => (
          <div key={section.label}>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] px-2 mb-2">
              {section.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const itemActive = isActive(item.href);
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={itemActive ? 'page' : undefined}
                      className={`text-sm font-semibold px-2 py-1.5 rounded-lg no-underline transition-colors ${
                        itemActive
                          ? 'text-[#1a56db] bg-[#1a56db]/10'
                          : 'text-[#111827] hover:bg-[#1a56db]/5'
                      }`}
                    >
                      {item.label}
                    </Link>
                    {item.children && item.children.length > 0 && (
                      <div className="mt-0.5 ml-3 pl-3 border-l border-[#e5e7eb] flex flex-col gap-0.5">
                        {item.children.map((c) => {
                          const childActive = isActive(c.href);
                          return (
                            <Link
                              key={c.href}
                              href={c.href}
                              aria-current={childActive ? 'page' : undefined}
                              className={`text-[13px] px-2 py-1.5 rounded-lg no-underline transition-colors ${
                                childActive
                                  ? 'text-[#1a56db] bg-[#1a56db]/10 font-medium'
                                  : 'text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5'
                              }`}
                            >
                              {c.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="px-2 py-6 text-center text-sm text-[#9ca3af]">
            Ничего не найдено
          </div>
        )}
      </nav>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto flex items-start">
      <aside className="hidden lg:block w-[264px] shrink-0 border-r border-[#e5e7eb] px-4 py-8 sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
        {sidebar}
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-[#111827]">Документация</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:bg-[#f3f4f6]"
                aria-label="Закрыть навигацию"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="lg:hidden px-4 pt-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-[#1a56db] bg-[#1a56db]/10 hover:bg-[#1a56db]/15 transition-colors"
          >
            <Menu className="w-4 h-4" />
            Навигация по документации
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
