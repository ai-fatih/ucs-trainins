'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/Avatar';
import { AuthModal } from '@/components/auth/AuthModal';
import { ChatWidget } from '@/components/layout/ChatWidget';
import { PhoneLink } from '@/components/PhoneLink';
import { api } from '@/lib/api';
import type { Specialist } from '@/types';
import {
  MessageCircle, GraduationCap, Database, Monitor,
  Star, ChevronDown, ChevronRight, Mail, CheckCircle,
  BookOpen, Calendar, Truck, Smartphone, Bell,
  ArrowRight, Trophy, Award,
} from 'lucide-react';
import serviceCategoriesData from '@/data/service-categories.json';
import reviewsData from '@/data/reviews.json';
import newsData from '@/data/news.json';
import faqData from '@/data/faq.json';

const categoryMeta: Record<string, { icon: React.ElementType; gradient: string; badge: string; badgeVariant: string }> = {
  consultations: { icon: MessageCircle, gradient: 'from-[#1a56db] to-[#2563eb]', badge: '30 мин', badgeVariant: 'bg-[#e8effa] text-[#1a56db]' },
  trainings: { icon: GraduationCap, gradient: 'from-[#0d9488] to-[#14b8a6]', badge: 'от 2 ч', badgeVariant: 'bg-[#fef3c7] text-[#d97706]' },
  directories: { icon: Database, gradient: 'from-[#d97706] to-[#f59e0b]', badge: 'от 60 мин', badgeVariant: 'bg-[#ccfbf1] text-[#0d9488]' },
};

const serviceBullets: Record<string, string[]> = {
  consultations: ['По справочникам, учёту и отчётам', 'Звонок или видео-консультация', 'Запись за 1 минуту'],
  trainings: ['Персональное или групповое', 'Практика на реальной базе rkeeper', 'Сертификат по итогам'],
  directories: ['Номенклатура, цены, рецептуры', 'Выгрузка данных в 1С', 'Сопровождение после запуска'],
};

const docProducts: { label: string; href: string; icon: React.ElementType; gradient: string; desc: string; count: number; featured?: boolean; scenarios?: { title: string; href: string }[] }[] = [
  {
    label: 'r_keeper 7',
    href: '/docs/rkeeper/rk7',
    icon: Monitor,
    gradient: 'from-[#1a56db] to-[#2563eb]',
    desc: 'Кассовые операции, смены, скидки и возвраты',
    count: 3,
    featured: true,
    scenarios: [
      { title: 'Создание и оплата заказа', href: '/docs/rkeeper/rk7/create-order' },
      { title: 'Управление сменами', href: '/docs/rkeeper/rk7/shift-management' },
      { title: 'Скидки и возвраты', href: '/docs/rkeeper/rk7/discounts-returns' },
    ],
  },
  {
    label: 'StoreHouse Pro',
    href: '/docs/rkeeper/storehouse',
    icon: Database,
    gradient: 'from-[#0d9488] to-[#14b8a6]',
    desc: 'Складской учёт: списание, инвентаризация, оприходование',
    count: 3,
  },
  {
    label: 'Delivery',
    href: '/docs/rkeeper/delivery',
    icon: Truck,
    gradient: 'from-[#d97706] to-[#f59e0b]',
    desc: 'Приём заказов, колл-центр, приложение курьера',
    count: 3,
  },
  {
    label: 'Event',
    href: '/docs/rkeeper/event',
    icon: Bell,
    gradient: 'from-[#9ca3af] to-[#b0b7c3]',
    desc: 'Уведомления с кассы rk Cash Desk',
    count: 3,
  },
  {
    label: 'Waiter & Cash Desk',
    href: '/docs/rkeeper/waiter',
    icon: Smartphone,
    gradient: 'from-[#7c3aed] to-[#8b5cf6]',
    desc: 'Мобильные приложения для официантов и кассиров',
    count: 3,
  },
];

const schoolCards: { title: string; desc: string; cta: string; href: string; icon: React.ElementType; gradient: string }[] = [
  { title: 'Мои курсы', desc: 'Учебные материалы, тесты и прогресс обучения', cta: 'К курсам', href: '/school/courses', icon: BookOpen, gradient: 'from-[#1a56db] to-[#2563eb]' },
  { title: 'Рейтинг', desc: 'Таблица лидеров, XP и достижения команды', cta: 'Смотреть рейтинг', href: '/school/leaderboard', icon: Trophy, gradient: 'from-[#d97706] to-[#f59e0b]' },
  { title: 'Бейджи и сертификаты', desc: 'Награды за обучение и подтверждение квалификации', cta: 'Мои награды', href: '/school', icon: Award, gradient: 'from-[#0d9488] to-[#14b8a6]' },
];

function ReviewsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviewsData.length);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const goTo = (index: number) => {
    setActiveIndex(index);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  const review = reviewsData[activeIndex];

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="glass-card p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-[#d1d5db]'}`} />
          ))}
        </div>
        <p className="text-[#374151] text-lg italic mb-6 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
        <p className="font-semibold text-sm text-[#111827]">{review.userName}</p>
        <p className="text-xs text-[#6b7280]">{review.serviceName}</p>
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        {reviewsData.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === activeIndex ? 'w-6 bg-[#1a56db]' : 'bg-[#d1d5db] hover:bg-[#9ca3af]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function FAQSection() {
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [openQ, setOpenQ] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-2">
      {faqData.map((cat, ci) => {
        const isCatOpen = openCat === ci;
        return (
          <div key={ci} className="glass-card overflow-hidden">
            <button
              onClick={() => {
                setOpenCat(isCatOpen ? null : ci);
                setOpenQ(null);
              }}
              className="w-full flex items-center justify-between px-6 py-3.5 text-left text-sm font-semibold text-[#111827] hover:bg-white/40 transition-all no-underline"
            >
              <span>{cat.category} <span className="font-normal text-[#6b7280]">({cat.items.length})</span></span>
              <ChevronDown className={`w-4 h-4 text-[#6b7280] transition-transform shrink-0 ${isCatOpen ? 'rotate-180' : ''}`} />
            </button>
            {isCatOpen && (
              <div className="border-t border-[#e5e7eb]">
                {cat.items.map((item, qi) => {
                  const isQOpen = openQ === qi;
                  return (
                    <div key={qi} className="border-b border-[#f3f4f6] last:border-b-0">
                      <button
                        onClick={() => setOpenQ(isQOpen ? null : qi)}
                        className="w-full flex items-center justify-between px-6 py-3 text-left text-sm font-medium text-[#374151] hover:bg-[#f9fafb] transition-all no-underline"
                      >
                        {item.question}
                        <ChevronDown className={`w-3.5 h-3.5 text-[#9ca3af] transition-transform shrink-0 ${isQOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isQOpen && (
                        <div className="px-6 pb-4 space-y-2">
                          <p className="text-xs text-[#6b7280] leading-relaxed">{item.description}</p>
                          <ol className="space-y-1.5">
                            {item.steps.map((step, si) => (
                              <li key={si} className="text-sm text-[#4b5563] leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-[#9ca3af]">
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EmployeeCarousel({ specialists }: { specialists: Specialist[] }) {
  const [active, setActive] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const total = specialists.length;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const getPos = (i: number) => {
    if (i === active) return 'active';
    const prevI = (active - 1 + total) % total;
    const nextI = (active + 1) % total;
    if (i === prevI) return 'prev';
    if (i === nextI) return 'next';
    const dist = (i - active + total) % total;
    return dist <= total / 2 ? 'hidden' : 'hidden-r';
  };

  const isElena = (name: string) => name.startsWith('Елена');

  const d = isMobile ? 150 : 200;
  const df = isMobile ? 280 : 380;
  const cardW = isMobile ? 220 : 280;

  const posStyles: Record<string, string> = {
    active: 'z-30 opacity-100 shadow-[0_20px_60px_rgba(26,86,219,0.3)] border-[rgba(255,255,255,0.25)]',
    prev: 'z-20 opacity-60',
    next: 'z-20 opacity-60',
    hidden: 'z-10 opacity-0 pointer-events-none',
    'hidden-r': 'z-10 opacity-0 pointer-events-none',
  };

  const transforms: Record<string, string> = {
    active: 'translateX(0) rotateY(0deg) scale(1)',
    prev: `translateX(-${d}px) rotateY(15deg) scale(0.85)`,
    next: `translateX(${d}px) rotateY(-15deg) scale(0.85)`,
    hidden: `translateX(-${df}px) rotateY(30deg) scale(0.7)`,
    'hidden-r': `translateX(${df}px) rotateY(-30deg) scale(0.7)`,
  };

  return (
    <>
      <div className="relative perspective-[1200px] flex items-center justify-center min-h-[360px] w-full overflow-hidden">
        {specialists.map((spec, i) => {
          const pos = getPos(i);
          const elena = isElena(spec.name);
          return (
            <div
              key={spec.id}
              className={`absolute rounded-2xl p-7 text-center text-white transition-all duration-[400ms] [transform-style:preserve-3d] cursor-default ${posStyles[pos]}`}
              style={{
                width: cardW,
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                transform: transforms[pos],
              }}
            >
              <div className="relative inline-block mb-3">
                <Avatar src={spec.avatarUrl} name={spec.name} size="lg" bg={spec.avatarBg} color={spec.avatarColor} />
                {elena && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-[#0d9488] to-[#059669] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-md">
                    9+ лет в UCS
                  </span>
                )}
              </div>
              <h3 className="text-[16px] font-bold">{spec.name}</h3>
              <p className="text-[13px] opacity-70">{spec.role}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={() => setActive((active - 1 + total) % total)}
          className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.06)] text-white text-[15px] cursor-pointer flex items-center justify-center hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.25)] transition-all"
        >
          ←
        </button>
        <div className="flex gap-1.5">
          {specialists.map((_, i) => (
            <span
              key={i}
              onClick={() => setActive(i)}
              className={`h-[7px] rounded-full cursor-pointer transition-all ${
                i === active ? 'w-[22px] bg-[#0d9488]' : 'w-[7px] bg-[rgba(255,255,255,0.2)]'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setActive((active + 1) % total)}
          className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.06)] text-white text-[15px] cursor-pointer flex items-center justify-center hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.25)] transition-all"
        >
          →
        </button>
      </div>
    </>
  );
}

export default function HomePage() {
  const { data: specialists = [] } = useQuery<Specialist[]>({
    queryKey: ['specialists'],
    queryFn: api.specialists.list,
  });
  const [authOpen, setAuthOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Редирект авторизованных с лендинга обрабатывает центральный AuthRouter
  // (см. src/components/layout/AuthRouter.tsx и docs/auth-redirects.md)

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 14);
  const date4 = new Date();
  date4.setDate(date4.getDate() + 4);
  const datePast = new Date();
  datePast.setDate(datePast.getDate() - 3);
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

  return (
    <div>
      {/* 0. Hero — Split Layout */}
      <div className="bg-[#0f172a]">
      <section id="hero" className="min-h-[520px] grid grid-cols-1 lg:grid-cols-2 relative max-w-[1440px] mx-auto">
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
          <div className="flex gap-2 flex-wrap mb-6">
            <span className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4]">rkeeper</span>
            <span className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4]">storehouse</span>
            <span className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4]">delivery</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1a56db] to-[#0d9488] text-white text-sm font-bold hover:scale-[1.02] hover:shadow-lg transition-all no-underline"
            >
              <Calendar className="w-4 h-4" />
              Записаться на консультацию
            </Link>
            <Link
              href="/request"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/15 transition-all no-underline"
            >
              <ChevronRight className="w-4 h-4" />
              Оставить заявку
            </Link>
          </div>

        </div>

        <div className="flex items-center justify-center bg-gradient-to-br from-[#1e293b] to-[#0f172a] relative overflow-hidden py-8 lg:py-0">
          <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(26,86,219,0.3)] top-[10%] left-[10%]" />
          <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(13,148,136,0.25)] bottom-[10%] right-[10%]" />
          <div className="flex flex-col gap-4">
            <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] border-[#0d9488]/30 rounded-2xl p-4 md:p-5 max-w-full">
              <div className="flex items-start gap-3">
                <div className="text-center min-w-[52px]">
                  <div className="text-xl md:text-3xl font-bold text-[#0d9488]">{date4.getDate()}</div>
                  <div className="text-[10px] text-[#94a3b8] uppercase">{months[date4.getMonth()]}</div>
                  <div className="text-xs font-medium text-[#64748b] mt-0.5">11:00</div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm md:text-base font-semibold text-white leading-tight">Консультация по StoreHouse</div>
                  <div className="text-xs text-[#94a3b8] mt-0.5 mb-1">Дмитрий Резников</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                    <span className="text-[11px] text-[#22c55e] font-semibold">Запланировано</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-4 hidden sm:block">
              <div className="flex items-start gap-3">
                <div className="text-center min-w-[52px]">
                  <div className="text-lg font-bold text-[#0d9488]">{nextDate.getDate()}</div>
                  <div className="text-[10px] text-[#94a3b8] uppercase">{months[nextDate.getMonth()]}</div>
                  <div className="text-[11px] font-medium text-[#64748b] mt-0.5">14:00</div>
                </div>
                <div className="min-w-0 pt-0.5">
                <div className="text-sm font-semibold text-white leading-tight mb-1">Обучение по rkeeper</div>
                <div className="text-xs text-[#94a3b8] mt-0.5">Владислав Фатихов</div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                  <span className="text-[11px] text-[#d97706] font-semibold">На согласовании</span>
                </div>
                </div>
              </div>
            </div>

            <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-4 hidden sm:block">
              <div className="flex items-start gap-3">
                <div className="text-center min-w-[52px]">
                  <div className="text-lg font-bold text-[#64748b]">{datePast.getDate()}</div>
                  <div className="text-[10px] text-[#64748b] uppercase">{months[datePast.getMonth()]}</div>
                  <div className="text-[11px] font-medium text-[#475569] mt-0.5">16:00</div>
                </div>
                <div className="min-w-0">
                <div className="text-sm font-semibold text-white leading-tight mb-1">Консультация по смене НДС</div>
                <div className="text-xs text-[#94a3b8] mt-0.5">Елизавета Галаган</div>
                <div className="flex items-center gap-1.5 mt-2">
                  <CheckCircle className="w-3 h-3 text-[#22c55e]" />
                  <span className="text-[11px] text-[#64748b] font-semibold">Проведено</span>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a href="#about" className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#64748b] text-xs hover:text-[#94a3b8] transition-colors no-underline">
          <span>О нас</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </section>
      </div>

      {/* 1. About — Vertical Stack */}
      <section id="about" className="bg-[#0f172a] py-16 px-4">
        <div className="max-w-[1200px] mx-auto space-y-12">
          {/* Header */}
          <div className="text-center max-w-[600px] mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-white">Отдел консультации и обучения</h2>
            <p className="text-sm text-[#94a3b8] mb-5 leading-relaxed">
              Помогаем ресторанам разобраться с rkeeper, StoreHouse и доставкой. Проводим обучение, заводим справочники, консультируем по любым вопросам.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <div className="bg-[rgba(255,255,255,0.06)] rounded-xl px-5 py-2.5 text-center min-w-[120px]">
                <div className="text-lg font-extrabold text-[#0d9488]">500+</div>
                <div className="text-[11px] text-[#94a3b8]">Клиентов</div>
              </div>
              <div className="bg-[rgba(255,255,255,0.06)] rounded-xl px-5 py-2.5 text-center min-w-[120px]">
                <div className="text-lg font-extrabold text-[#0d9488]">15+</div>
                <div className="text-[11px] text-[#94a3b8]">Лет опыта</div>
              </div>
            </div>
          </div>

          {/* Carousel */}
          <EmployeeCarousel specialists={specialists} />

          {/* Contacts Row */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-2xl px-6 py-5 text-white">
            <a href="mailto:school@ucs-service.ru" className="flex items-center gap-2.5 no-underline text-white hover:translate-x-1 transition-all">
              <span className="w-9 h-9 rounded-xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-[#0d9488]" />
              </span>
              <span className="text-[13px] font-semibold">school@ucs-service.ru</span>
            </a>

            <PhoneLink />

            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#1a56db] to-[#0d9488] text-white text-[13px] font-bold hover:scale-[1.02] hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Написать в чат
            </button>
          </div>
        </div>
      </section>

      {/* 2. Docs — Documentation preview */}
      <section id="docs" className="bg-white py-20 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8effa] text-[#1a56db] mb-4">
              <BookOpen className="w-3 h-3" /> База знаний
            </span>
            <h2 className="text-3xl font-bold mb-3 text-[#111827]">Документация</h2>
            <p className="text-[#6b7280] max-w-xl mx-auto">
              Пошаговые инструкции по всем продуктам r_keeper: касса, склад, доставка, мобильные приложения
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {docProducts.map((doc) => (
              <Link
                key={doc.href}
                href={doc.href}
                className={`glass-card p-6 no-underline group flex flex-col ${doc.featured ? 'md:col-span-2 md:flex-row md:items-center md:gap-8' : ''}`}
              >
                <div className={`flex items-start gap-4 ${doc.featured ? 'md:flex-1' : ''}`}>
                  <span className={`w-14 h-14 rounded-xl bg-gradient-to-br ${doc.gradient} text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md`}>
                    <doc.icon className="w-7 h-7" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-[#111827] group-hover:text-[#1a56db] transition-colors">{doc.label}</h3>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${doc.count > 0 ? 'bg-[#e8effa] text-[#1a56db]' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>
                        {doc.count > 0 ? `${doc.count} сценария` : 'Раздел'}
                      </span>
                    </span>
                    <p className="text-sm text-[#6b7280] mt-1.5">{doc.desc}</p>
                  </span>
                </div>
                {doc.featured && doc.scenarios && (
                  <ul className="mt-5 md:mt-0 md:min-w-[300px] space-y-2">
                    {doc.scenarios.map((sc) => (
                      <li key={sc.href} className="flex items-center gap-2 text-sm text-[#4b5563] group-hover:text-[#1a56db] transition-colors">
                        <CheckCircle className="w-4 h-4 text-[#0d9488] shrink-0" />
                        {sc.title}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white no-underline transition-all bg-gradient-to-r from-[#1a56db] to-[#0d9488] hover:shadow-lg hover:-translate-y-0.5"
            >
              Вся документация
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      <section id="services" className="bg-[#f9fafb] py-20 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ccfbf1] text-[#0d9488] mb-4">
              <MessageCircle className="w-3 h-3" /> Форматы работы
            </span>
            <h2 className="text-3xl font-bold mb-3 text-[#111827]">Наши услуги</h2>
            <p className="text-[#6b7280] max-w-xl mx-auto">
              Выберите подходящий формат обучения и поддержки
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {serviceCategoriesData.map((cat) => {
              const meta = categoryMeta[cat.id] || { icon: MessageCircle, gradient: 'from-[#1a56db] to-[#2563eb]', badge: '', badgeVariant: '' };
              const IconComp = meta.icon;
              const bullets = serviceBullets[cat.id] || [];
              return (
                <div key={cat.id} className="glass-card p-6 flex flex-col group">
                  <div className="flex items-center justify-between mb-5">
                    <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient} text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md`}>
                      <IconComp className="w-6 h-6" />
                    </span>
                    {meta.badge && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${meta.badgeVariant}`}>{meta.badge}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[#111827]">{cat.label}</h3>
                  <p className="text-sm text-[#6b7280] mb-5 flex-1">{cat.description}</p>
                  <ul className="space-y-2 mb-6">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-[#4b5563]">
                        <CheckCircle className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a56db] no-underline group-hover:gap-2.5 transition-all w-fit">
                    Подробнее
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. School section */}
      <section id="school" className="bg-white py-20 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#d97706] mb-4">
              <GraduationCap className="w-3 h-3" /> Обучение и рост
            </span>
            <h2 className="text-3xl font-bold mb-3 text-[#111827]">Школа UCS</h2>
            <p className="text-[#6b7280] max-w-xl mx-auto">
              Обучающие курсы, рейтинг, бейджи и сертификаты
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
            {[
              { value: '12+', label: 'Курсов' },
              { value: '50+', label: 'Сертификатов' },
              { value: '4.9', label: 'Рейтинг школы' },
            ].map((s) => (
              <div key={s.label} className="glass-card py-4 px-5 text-center">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-[#1a56db] to-[#0d9488] bg-clip-text text-transparent">{s.value}</div>
                <div className="text-xs text-[#6b7280] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {schoolCards.map((c) => (
              <Link key={c.href} href={c.href} className="glass-card p-6 no-underline group flex flex-col">
                <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md mb-5`}>
                  <c.icon className="w-6 h-6" />
                </span>
                <h3 className="text-lg font-semibold mb-2 text-[#111827] group-hover:text-[#1a56db] transition-colors">{c.title}</h3>
                <p className="text-sm text-[#6b7280] mb-5 flex-1">{c.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a56db] group-hover:gap-2.5 transition-all w-fit">
                  {c.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/school"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white no-underline transition-all bg-gradient-to-r from-[#1a56db] to-[#0d9488] hover:shadow-lg hover:-translate-y-0.5"
            >
              Перейти в школу
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. News — Blog */}
      <section id="news" className="bg-[#f9fafb] py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Новости отдела</h2>
          <p className="text-center text-[#6b7280] mb-10 max-w-xl mx-auto">
            Полезные материалы, обновления и анонсы
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {newsData.map((item) => (
              <div key={item.id} className="glass-card p-5 flex flex-col">
                <span className="text-[11px] font-semibold text-[#0d9488] bg-[rgba(13,148,136,0.1)] px-2.5 py-1 rounded-full inline-block w-fit mb-3">
                  {item.category}
                </span>
                <time className="text-xs text-[#94a3b8] mb-2">{item.date}</time>
                <h3 className="text-sm font-semibold text-[#111827] mb-2 leading-snug">{item.title}</h3>
                <p className="text-xs text-[#6b7280] leading-relaxed flex-1">{item.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Social Proof — Reviews Carousel */}
      <section id="reviews" className="bg-[#f9fafb] py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Что говорят клиенты</h2>
          <p className="text-center text-[#6b7280] mb-10 max-w-xl mx-auto">
            Реальные отзывы клиентов
          </p>
          <ReviewsCarousel />
        </div>
      </section>

      {/* 5. FAQ — Accordion */}
      <section id="faq" className="bg-white py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Частые вопросы по StoreHouse Pro</h2>
          <p className="text-center text-[#6b7280] mb-10 max-w-xl mx-auto">
            Ответы на основе анализа обращений в Service Desk
          </p>
          <FAQSection />
        </div>
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {chatOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setChatOpen(false)} />
          <ChatWidget onClose={() => setChatOpen(false)} />
        </div>
      )}
    </div>
  );
}
