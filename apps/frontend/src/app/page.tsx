'use client';
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import howItWorksData from '@/data/how-it-works.json';
import serviceCategoriesData from '@/data/service-categories.json';

const categoryMeta: Record<string, { icon: string; badge: string; badgeVariant: string }> = {
  consultations: { icon: '💬', badge: '30 мин', badgeVariant: 'bg-[#d1fae5] text-[#059669]' },
  trainings: { icon: '📚', badge: 'от 2 часов', badgeVariant: 'bg-[#fef3c7] text-[#d97706]' },
  setup: { icon: '⚙️', badge: 'Бесплатно*', badgeVariant: 'bg-[#d1fae5] text-[#059669]' },
  video: { icon: '🎥', badge: 'Бесплатно', badgeVariant: 'bg-[#ede9fe] text-[#7c3aed]' },
};

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-[#1a56db] to-[#1e40af] text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Профессиональные консультации и обучение по rkeeper</h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto mb-8">
          Быстрая запись на консультации, тренинги и настройку. Бесплатно при активном договоре поддержки.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/services" className="bg-white text-[#1a56db] font-bold px-8 py-3.5 rounded-md text-base hover:bg-gray-100 no-underline transition-colors">
            Записаться
          </Link>
          <Link href="/auth/login" className="border-2 border-white text-white font-semibold px-8 py-3.5 rounded-md text-base hover:bg-white/10 no-underline transition-colors">
            Войти
          </Link>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Наши услуги</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCategoriesData.map((cat) => {
            const meta = categoryMeta[cat.id] || { icon: '📋', badge: '', badgeVariant: '' };
            return (
              <Card key={cat.id} hoverable className="text-center" onClick={() => window.location.href = '/services'}>
                <div className="text-4xl mb-4">{meta.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{cat.label}</h3>
                <p className="text-sm text-[#6b7280] mb-4">{cat.description}</p>
                {meta.badge && <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${meta.badgeVariant}`}>{meta.badge}</span>}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-12 border-t border-[#e5e7eb]">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
            {howItWorksData.map((step) => (
              <div key={step.id}>
                <div className="w-12 h-12 bg-[#e8effa] text-[#1a56db] rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{step.icon}</div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-[#6b7280]">{step.description}</p>
              </div>
            ))}
          </div>
          <Link href="/services" className="btn-primary mt-8 inline-block">Записаться сейчас</Link>
        </div>
      </section>

      <footer className="text-center py-8 text-sm text-[#9ca3af] border-t border-[#e5e7eb]">
        <p>UCS service — Консультации и Обучения © 2026</p>
        <p className="mt-1">* Бесплатно для клиентов с активным договором пользовательской поддержки</p>
      </footer>
    </div>
  );
}
