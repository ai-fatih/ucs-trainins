'use client';
import React from 'react';
import Link from 'next/link';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  subtitle?: string;
}

export default function ComingSoon({ title, subtitle }: ComingSoonProps) {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-16">
      <div className="glass-card p-10 text-center">
        <span className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white mb-6">
          <Construction className="w-8 h-8" />
        </span>
        <h1 className="text-2xl font-bold text-[#111827] mb-2">{title}</h1>
        <p className="text-sm text-[#6b7280] max-w-md mx-auto mb-8 leading-relaxed">
          {subtitle ?? 'Раздел станет доступен после подключения личного кабинета. Сейчас портал работает в информационно-обучающем режиме.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="glass-btn">
            На главную
          </Link>
          <Link href="/docs" className="glass-btn">
            Документация
          </Link>
          <Link href="/school" className="glass-btn">
            Школа и тренажёры
          </Link>
        </div>
      </div>
    </div>
  );
}
