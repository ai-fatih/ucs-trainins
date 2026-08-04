'use client';
import Link from 'next/link';
import { Search, Home, BookOpen, GraduationCap, FileText } from 'lucide-react';
import { useUIStore } from '@/stores/ui';

export default function NotFound() {
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="glass-card p-8 rounded-3xl">
          <div className="text-6xl font-extrabold bg-gradient-to-r from-[#1a56db] to-[#0d9488] bg-clip-text text-transparent mb-3">
            404
          </div>
          <h1 className="text-lg font-bold text-[#111827] mb-2">Страница не найдена</h1>
          <p className="text-sm text-[#6b7280] mb-6">
            Такой страницы нет — возможно, она переехала или ссылка устарела. Начните с поиска или
            одного из разделов.
          </p>

          <button
            onClick={() => setSearchOpen(true)}
            className="glass-btn w-full justify-center mb-4"
          >
            <Search className="w-4 h-4" /> Поиск по сайту
            <kbd className="ml-1 px-1.5 py-0.5 rounded border border-white/20 text-[10px]">Ctrl + 5</kbd>
          </button>

          <div className="grid grid-cols-1 gap-2">
            <Link href="/" className="glass-card p-3 flex items-center gap-3 no-underline hover:-translate-y-0.5 transition-all text-left">
              <Home className="w-4 h-4 text-[#1a56db] shrink-0" />
              <span className="text-sm text-[#374151]">На главную</span>
            </Link>
            <Link href="/docs" className="glass-card p-3 flex items-center gap-3 no-underline hover:-translate-y-0.5 transition-all text-left">
              <BookOpen className="w-4 h-4 text-[#1a56db] shrink-0" />
              <span className="text-sm text-[#374151]">Инструкции</span>
            </Link>
            <Link href="/school" className="glass-card p-3 flex items-center gap-3 no-underline hover:-translate-y-0.5 transition-all text-left">
              <GraduationCap className="w-4 h-4 text-[#0d9488] shrink-0" />
              <span className="text-sm text-[#374151]">Школа</span>
            </Link>
            <Link href="/faq" className="glass-card p-3 flex items-center gap-3 no-underline hover:-translate-y-0.5 transition-all text-left">
              <FileText className="w-4 h-4 text-[#0d9488] shrink-0" />
              <span className="text-sm text-[#374151]">Популярные обращения</span>
            </Link>
          </div>
        </div>

        <p className="mt-4 text-xs text-[#9ca3af]">
          Подсказка: нажмите <span className="text-[#6b7280]">1</span>,{' '}
          <span className="text-[#6b7280]">2</span> или <span className="text-[#6b7280]">3</span> на
          главной, чтобы перейти в разделы.
        </p>
      </div>
    </div>
  );
}
