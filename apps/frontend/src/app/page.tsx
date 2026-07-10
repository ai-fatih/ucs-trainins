'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import type { Specialist } from '@/types';
import {
  MessageCircle, GraduationCap, Video, Database, ArrowRight,
  Star, ChevronDown, Mail, Phone, CheckCircle, MoreHorizontal,
} from 'lucide-react';
import serviceCategoriesData from '@/data/service-categories.json';
import reviewsData from '@/data/reviews.json';
import newsData from '@/data/news.json';

const programTagColors: Record<string, { bg: string; text: string }> = {
  rkeeper: { bg: '#e8effa', text: '#1a56db' },
  'storehouse': { bg: '#fef3c7', text: '#d97706' },
  rk_delivery: { bg: '#ede9fe', text: '#7c3aed' },
  rk_event: { bg: '#fce7f3', text: '#be185d' },
};

const categoryMeta: Record<string, { icon: React.ElementType; badge: string; badgeVariant: string }> = {
  consultations: { icon: MessageCircle, badge: '30 мин', badgeVariant: 'bg-[#e8effa] text-[#1a56db]' },
  trainings: { icon: GraduationCap, badge: 'от 2 ч', badgeVariant: 'bg-[#fef3c7] text-[#d97706]' },
  video: { icon: Video, badge: '60 мин', badgeVariant: 'bg-[#ede9fe] text-[#7c3aed]' },
  directories: { icon: Database, badge: 'от 60 мин', badgeVariant: 'bg-[#ccfbf1] text-[#0d9488]' },
};

const faqData = [
  { question: 'Как записаться на консультацию?', answer: 'Выберите услугу, укажите удобные дату и время — мы подберём свободный слот. После подтверждения вы получите уведомление.' },
  { question: 'Сколько стоят услуги?', answer: 'Консультации — от 1500 ₽, обучение — от 5000 ₽. Стоимость зависит от формата и длительности.' },
  { question: 'Работаете ли с ИП и ООО?', answer: 'Да, мы работаем с юрлицами и ИП. Заключаем договор, предоставляем закрывающие документы.' },
  { question: 'Как отменить или перенести запись?', answer: 'В личном кабинете вы можете отменить запись не позднее чем за 2 часа до начала.' },
  { question: 'Предоставляете ли документы для налоговой?', answer: 'Да, после оказания услуг мы предоставляем акт и чек. Для юрлиц — счёт-фактуру.' },
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {faqData.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="glass-card overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-[#111827] hover:bg-white/40 transition-all no-underline"
            >
              {item.question}
              <ChevronDown className={`w-4 h-4 text-[#6b7280] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`px-6 transition-all ${isOpen ? 'pb-4' : 'max-h-0 pb-0'}`}>
              {isOpen && <p className="text-sm text-[#6b7280] leading-relaxed">{item.answer}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const { data: specialists = [] } = useQuery<Specialist[]>({
    queryKey: ['specialists'],
    queryFn: api.specialists.list,
  });
  const [authOpen, setAuthOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  const leader = specialists.find(s => s.role === 'Руководитель');
  const managers = specialists.filter(s => s.role !== 'Руководитель');
  const elena = managers.find(s => s.name.startsWith('Елена'));

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
      <section className="min-h-[520px] grid grid-cols-1 lg:grid-cols-2 relative max-w-[1440px] mx-auto">
        <div className="text-white p-8 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-[rgba(13,148,136,0.2)] text-slate-50 px-3 py-1.5 rounded-full text-xs font-semibold w-fit mb-5">
            ✦ Консультации и обучение
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
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
          <button
            onClick={() => {
              if (isAuthenticated) {
                router.push('/dashboard');
              } else {
                setAuthOpen(true);
              }
            }}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#1a56db] to-[#0d9488] text-white rounded-lg font-bold text-sm w-fit hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgba(26,86,219,0.4)] transition-all"
          >
            Личный кабинет <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center bg-gradient-to-br from-[#1e293b] to-[#0f172a] relative overflow-hidden py-8 lg:py-0">
          <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(26,86,219,0.3)] top-[10%] left-[10%]" />
          <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(13,148,136,0.25)] bottom-[10%] right-[10%]" />
          <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-start">
            {/* Left: Booking cards (unchanged) */}
            <div className="flex flex-col gap-5 w-full lg:w-auto">
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-4">
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

              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-5 scale-105 lg:scale-105 max-w-full">
                <div className="flex items-start gap-3">
                  <div className="text-center min-w-[56px]">
                    <div className="text-3xl font-bold text-[#0d9488]">{date4.getDate()}</div>
                    <div className="text-xs text-[#94a3b8] uppercase">{months[date4.getMonth()]}</div>
                    <div className="text-sm font-medium text-[#64748b] mt-1">11:00</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-white leading-tight">Консультация по StoreHouse</div>
                    <div className="text-xs text-[#94a3b8] mt-0.5 mb-1">Дмитрий Резников</div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                      <span className="text-[11px] text-[#22c55e] font-semibold">Запланировано</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-4">
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

            {/* Right: Chat preview */}
            <div className="flex flex-col justify-center w-full lg:w-auto lg:min-w-[220px] lg:max-w-[280px]">
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                {/* Header */}
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                  <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#d97706] to-[#f59e0b] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                    ЕП
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-white">Елена Попова</div>
                    <div className="flex items-center gap-1 text-[10px] text-[#22c55e]">
                      <span className="w-1 h-1 rounded-full bg-[#22c55e]" /> Онлайн
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-[#64748b]" />
                </div>

                {/* Messages with fade effect */}
                <div className="relative px-4 py-3 flex flex-col gap-2">
                  <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-[#0f172a] to-transparent pointer-events-none z-10" />
                  <div className="max-w-[88%] self-start bg-[rgba(255,255,255,0.08)] text-[#e2e8f0] rounded-[10px] rounded-bl px-3.5 py-2.5 text-[12px] leading-relaxed" style={{ opacity: 0.3 }}>
                    Добрый день! Чем могу помочь?
                  </div>
                  <div className="max-w-[88%] self-end bg-gradient-to-r from-[#1a56db] to-[#0d9488] text-white rounded-[10px] rounded-br px-3.5 py-2.5 text-[12px] leading-relaxed" style={{ opacity: 0.75 }}>
                    Добрый день! Нужно обучение персонала по StoreHouse Pro, будет алкоголь и импорт в 1С. Есть такое?
                  </div>
                  <div className="max-w-[88%] self-start bg-[rgba(255,255,255,0.08)] text-[#e2e8f0] rounded-[10px] rounded-bl px-3.5 py-2.5 text-[12px] leading-relaxed" style={{ opacity: 1 }}>
                    Здравствуйте! Есть базовый курс 4 ч по складскому учёту, включает ЕГАИС и импорт в 1С. Можем начать в четверг в 11:00?
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="flex-1 px-3 py-2 rounded-md bg-[rgba(255,255,255,0.06)] text-[#64748b] text-[11px] border border-[rgba(255,255,255,0.06)]">
                    Напишите сообщение...
                  </div>
                  <button className="w-[30px] h-[30px] rounded-md bg-gradient-to-r from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white hover:scale-105 transition-transform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
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

      {/* 1. About — 2+3 layout */}
      <section id="about" className="bg-white py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Отдел консультации и обучения</h2>
          <p className="text-center text-[#6b7280] mb-10 max-w-xl mx-auto">
            Помогаем ресторанам разобраться с rkeeper, StoreHouse и доставкой. В команде 5 специалистов. Проводим обучение персонала, заводим справочники, консультируем по любым вопросам.
          </p>

          {leader && (
            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:overflow-visible md:grid md:grid-cols-2 md:gap-5 md:pb-0 mb-5">
              {/* Desktop: grid-2, Mobile: scroll */}
              <div className="snap-start shrink-0 w-[280px] md:w-auto">
                <div className="glass-card text-center p-6 h-full flex flex-col items-center">
                  <Avatar src={leader.avatarUrl} name={leader.name} size="lg" bg={leader.avatarBg} color={leader.avatarColor} className="mb-3" />
                  <h3 className="font-bold text-lg text-[#111827]">{leader.name}</h3>
                  <p className="text-sm text-[#6b7280] mt-0.5">{leader.role}</p>
                </div>
              </div>

              {(() => {
                const others = managers.filter((s) => !s.name.startsWith('Елена'));
                const seniority = elena?.startDate
                  ? 2026 - new Date(elena.startDate).getFullYear()
                  : null;
                return (
                  <>
                    {elena && (
                      <div className="snap-start shrink-0 w-[280px] md:w-auto">
                        <div className="glass-card text-center p-6 h-full flex flex-col items-center">
                          <div className="relative mb-3">
                            <Avatar src={elena.avatarUrl} name={elena.name} size="lg" bg={elena.avatarBg} color={elena.avatarColor} />
                            {seniority && (
                              <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#0d9488] to-[#059669] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-md">
                                {seniority}+ лет в UCS
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-lg text-[#111827]">{elena.name}</h3>
                          <p className="text-sm text-[#6b7280] mt-0.5">{elena.role}</p>
                        </div>
                      </div>
                    )}

                    {/* Desktop: grid-3 for others, Mobile: continue horizontal scroll */}
                    <div className="hidden md:grid md:grid-cols-3 md:gap-5 md:col-span-2 md:mt-5 md:w-full">
                      {others.map((spec) => (
                        <div key={spec.id} className="glass-card text-center p-5 flex flex-col items-center">
                          <Avatar src={spec.avatarUrl} name={spec.name} size="lg" bg={spec.avatarBg} color={spec.avatarColor} className="mb-3" />
                          <h3 className="font-semibold text-sm text-[#111827]">{spec.name}</h3>
                          <p className="text-xs text-[#6b7280] mt-0.5">{spec.role}</p>
                        </div>
                      ))}
                    </div>

                    {/* Mobile: rest as scroll items */}
                    <div className="md:hidden flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                      {others.map((spec) => (
                        <div key={spec.id} className="snap-start shrink-0 w-[220px]">
                          <div className="glass-card text-center p-5 h-full flex flex-col items-center">
                            <Avatar src={spec.avatarUrl} name={spec.name} size="lg" bg={spec.avatarBg} color={spec.avatarColor} className="mb-3" />
                            <h3 className="font-semibold text-sm text-[#111827]">{spec.name}</h3>
                            <p className="text-xs text-[#6b7280] mt-0.5">{spec.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Tags — all unique from all specialists */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 pt-6 border-t border-[#e5e7eb]">
            {Array.from(new Set(specialists.flatMap((s) => s.programTags ?? []))).map((tag) => {
              const colors = programTagColors[tag] || { bg: '#f3f4f6', text: '#374151' };
              return (
                <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>
                  {tag}
                </span>
              );
            })}
            {Array.from(new Set(specialists.flatMap((s) => s.skillTags ?? []))).map((tag) => (
              <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. News — Blog */}
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

      {/* 3. Services — 2x2 Grid */}
      <section id="services" className="bg-[#f9fafb] py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Наши услуги</h2>
          <p className="text-center text-[#6b7280] mb-10 max-w-xl mx-auto">
            Выберите подходящий формат обучения
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {serviceCategoriesData.map((cat) => {
              const meta = categoryMeta[cat.id] || { icon: MessageCircle, badge: '', badgeVariant: '' };
              const IconComp = meta.icon;
              return (
                <Link
                  key={cat.id}
                  href="/services"
                  className="glass-card text-left p-6 no-underline group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold mb-1.5 text-[#111827] group-hover:text-[#1a56db] transition-colors">{cat.label}</h3>
                      <p className="text-sm text-[#6b7280] mb-3">{cat.description}</p>
                      {meta.badge && (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${meta.badgeVariant}`}>
                          {meta.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
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
          <h2 className="text-3xl font-bold text-center mb-4">Частые вопросы</h2>
          <p className="text-center text-[#6b7280] mb-10 max-w-xl mx-auto">
            Всё, что нужно знать перед записью
          </p>
          <FAQSection />
        </div>
      </section>

      {/* 6. Contacts — Hero-style dark */}
      <section id="contacts" className="bg-[#0f172a] py-16 px-4 relative overflow-hidden">
        <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(13,148,136,0.2)] top-[10%] -left-[10%]" />
        <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(26,86,219,0.2)] bottom-[10%] -right-[10%]" />
        <div className="relative z-10 max-w-[500px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#f1f5f9]">Контакты отдела обучения</h2>
          <p className="text-center text-[#64748b] mb-10 max-w-md mx-auto">
            Свяжитесь с нами любым удобным способом
          </p>
          <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 space-y-6">
            <a href="mailto:school@ucs-service.ru" className="flex items-center gap-4 no-underline group">
              <div className="w-12 h-12 rounded-xl bg-[rgba(13,148,136,0.15)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-[#5eead4]" />
              </div>
              <div>
                <p className="text-xs text-[#64748b] mb-0.5">Электронная почта</p>
                <p className="text-base font-semibold text-[#f1f5f9] group-hover:text-[#5eead4] transition-colors">school@ucs-service.ru</p>
              </div>
            </a>
            <div className="border-t border-[rgba(255,255,255,0.08)]" />
            <a href="tel:+74959214770" className="flex items-center gap-4 no-underline group">
              <div className="w-12 h-12 rounded-xl bg-[rgba(13,148,136,0.15)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-[#5eead4]" />
              </div>
              <div>
                <p className="text-xs text-[#64748b] mb-0.5">Телефон:</p>
                <p className="text-base font-semibold text-[#f1f5f9] group-hover:text-[#5eead4] transition-colors">+7 (495) 921-47-70</p>
              </div>
            </a>
            <p className="text-[11px] text-[#64748b] ml-[68px] mt-1">
              добавочный{' '}
              <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-[rgba(13,148,136,0.25)] text-[#5eead4] text-[10px] font-bold">2</span>
              {' '}— отдел консультации и обучения
            </p>
          </div>
        </div>
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
