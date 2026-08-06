import type { Metadata } from 'next';
import Link from 'next/link';
import { Tooltip } from '@/components/ui/Tooltip';
import { GraduationCap, BookOpen } from 'lucide-react';
import casesYear from '@/data/cases/yearly.json';
import { HeroStatsCard } from '@/components/hero/HeroStatsCard';
import type { YearlyCases } from '@/types';

const casesData = casesYear as YearlyCases;

export const metadata: Metadata = {
  title: 'UCS Service — Обучение и документация по rkeeper',
  description:
    'Открытый портал: инструкции, тренажёры и курсы по rkeeper. Консультируем и обучаем сотрудников по работе с пользовательской частью rkeeper.',
  alternates: { canonical: 'https://ucs-service.vercel.app' },
  openGraph: {
    title: 'UCS Service — Обучение и документация по rkeeper',
    description:
      'Открытый портал: инструкции, тренажёры и курсы по rkeeper. Обучение и документация без регистрации.',
    url: 'https://ucs-service.vercel.app',
  },
};

export default function HomePage() {
  return (
    <div className="bg-[#0f172a] min-h-svh flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'UCS Service — ЦТО «ЮСИЭС сервис»',
            url: 'https://ucs-service.vercel.app',
            logo: 'https://ucs-service.vercel.app/icons/icon-512x512.png',
            description:
              'Обучение и документация по программам rkeeper. Консультации, тренажёры и инструкции.',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+7-495-777-01-20',
              contactType: 'customer service',
              email: 'school@ucs-service.ru',
              areaServed: 'RU',
            },
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'RU',
              addressLocality: 'Москва',
              streetAddress: 'пер. Большой Полуярославский, д. 10 стр. 1',
              postalCode: '105120',
            },
          }),
        }}
      />
      <section id="hero" className="flex-1 grid grid-cols-1 lg:grid-cols-2 relative max-w-[1440px] mx-auto w-full pt-24 lg:pt-0">
        <div className="text-white p-6 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-[rgba(13,148,136,0.2)] text-slate-50 px-3 py-1.5 rounded-full text-xs font-semibold w-fit mb-5">
            ✦ Консультации и обучение
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Экспертная поддержка <span className="text-[#0d9488]">пользователей rkeeper</span>
          </h1>
          <p className="text-base text-[#94a3b8] mb-4 max-w-md">
            Консультируем и обучаем сотрудников по работе с пользовательской частью rkeeper
          </p>
          <div className="flex gap-2 flex-wrap mb-8">
            <span className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4]">rkeeper</span>
            <span className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4]">storehouse</span>
            <span className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4]">delivery</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Tooltip
              content="Открытые курсы и тренажёры на реальных кейсах. Учиться можно без регистрации."
              side="top"
            >
              <Link
                href="/school"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1a56db] to-[#0d9488] text-white text-sm font-bold hover:scale-[1.02] hover:shadow-lg transition-all no-underline"
              >
                <GraduationCap className="w-4 h-4" />
                В школу
              </Link>
            </Tooltip>
            <Tooltip
              content="Инструкции-процессы на основе популярных запросов: как решить типовую задачу шаг за шагом."
              side="top"
            >
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.06)] text-white text-sm font-bold hover:bg-[rgba(255,255,255,0.12)] transition-all no-underline"
              >
                <BookOpen className="w-4 h-4" />
                Инструкции
              </Link>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 md:p-16 bg-gradient-to-br from-[#1e293b] to-[#0f172a] relative overflow-hidden">
          <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(26,86,219,0.3)] top-[10%] left-[10%]" />
          <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(13,148,136,0.25)] bottom-[10%] right-[10%]" />
          <div className="relative">
            <HeroStatsCard data={casesData} />
          </div>
        </div>
      </section>
    </div>
  );
}
