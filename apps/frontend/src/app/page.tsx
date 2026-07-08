'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/Avatar';
import { AuthModal } from '@/components/auth/AuthModal';
import { api } from '@/lib/api';
import type { Specialist } from '@/types';
import {
  MessageCircle, GraduationCap, Video, Database, ArrowRight,
  Star, ChevronDown,
} from 'lucide-react';
import howItWorksData from '@/data/how-it-works.json';
import serviceCategoriesData from '@/data/service-categories.json';
import reviewsData from '@/data/reviews.json';

const programTagColors: Record<string, { bg: string; text: string }> = {
  rkeeper: { bg: '#e8effa', text: '#1a56db' },
  'storehouse pro': { bg: '#fef3c7', text: '#d97706' },
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

function StepSvg({ step }: { step: string }) {
  const svg = (() => {
    switch (step) {
      case '1': return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" className="w-full h-24 md:h-32 rounded-xl">
        <rect x="0" y="0" width="400" height="160" rx="12" fill="#e8effa" opacity="0.3" />
        <text x="20" y="28" fontSize="16" fontFamily="sans-serif" fill="#374151" fontWeight="700">Выберите услугу</text>
        <rect x="20" y="48" width="110" height="32" rx="6" fill="#ffffff" stroke="#374151" strokeWidth="2" />
        <circle cx="40" cy="64" r="6" fill="#1a56db" />
        <text x="60" y="68" fontSize="14" fontFamily="sans-serif" fill="#374151">Консультация</text>
        <rect x="20" y="88" width="110" height="32" rx="6" fill="#ffffff" stroke="#374151" strokeWidth="2" />
        <circle cx="40" cy="104" r="6" fill="#e8effa" stroke="#374151" strokeWidth="2" />
        <text x="60" y="108" fontSize="14" fontFamily="sans-serif" fill="#374151">Обучение</text>
        <rect x="20" y="128" width="110" height="32" rx="6" fill="#ffffff" stroke="#374151" strokeWidth="2" />
        <circle cx="40" cy="144" r="6" fill="#e8effa" stroke="#374151" strokeWidth="2" />
        <text x="60" y="148" fontSize="14" fontFamily="sans-serif" fill="#374151">Настройка</text>
        <rect x="160" y="60" width="80" height="32" rx="16" fill="#e8effa" stroke="#374151" strokeWidth="2" />
        <circle cx="180" cy="76" r="10" fill="#1a56db" />
        <text x="200" y="81" fontSize="12" fontFamily="sans-serif" fill="#374151">Онлайн</text>
      </svg>);
      case '2': return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" className="w-full h-24 md:h-32 rounded-xl">
        <rect x="0" y="0" width="400" height="160" rx="12" fill="#e8effa" opacity="0.3" />
        <rect x="20" y="20" width="160" height="120" rx="10" fill="#ffffff" stroke="#374151" strokeWidth="2" />
        <text x="40" y="60" fontSize="14" fontFamily="sans-serif" fill="#374151">5</text>
        <text x="80" y="60" fontSize="14" fontFamily="sans-serif" fill="#374151">6</text>
        <rect x="110" y="44" width="32" height="24" rx="4" fill="#1a56db" />
        <text x="126" y="60" fontSize="14" fontFamily="sans-serif" fill="#ffffff" textAnchor="middle" fontWeight="700">7</text>
        <text x="40" y="92" fontSize="14" fontFamily="sans-serif" fill="#374151">8</text>
        <text x="80" y="92" fontSize="14" fontFamily="sans-serif" fill="#374151">9</text>
        <text x="120" y="92" fontSize="14" fontFamily="sans-serif" fill="#374151">10</text>
        <rect x="210" y="32" width="140" height="96" rx="10" fill="#ffffff" stroke="#374151" strokeWidth="2" />
        <text x="230" y="60" fontSize="14" fontFamily="sans-serif" fill="#374151">10:00</text>
        <rect x="220" y="72" width="100" height="24" rx="6" fill="#1a56db" />
        <text x="250" y="88" fontSize="14" fontFamily="sans-serif" fill="#ffffff" textAnchor="middle" fontWeight="700">11:00</text>
        <text x="230" y="116" fontSize="14" fontFamily="sans-serif" fill="#374151">14:00</text>
        <rect x="210" y="120" width="140" height="28" rx="6" fill="#0d9488" />
        <text x="280" y="140" fontSize="14" fontFamily="sans-serif" fill="#ffffff" textAnchor="middle" fontWeight="700">Подтвердить</text>
      </svg>);
      case '3': return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" className="w-full h-24 md:h-32 rounded-xl">
        <rect x="0" y="0" width="400" height="160" rx="12" fill="#e8effa" opacity="0.3" />
        <circle cx="80" cy="80" r="32" fill="#e8effa" stroke="#374151" strokeWidth="2" />
        <circle cx="80" cy="74" r="16" fill="#ffffff" stroke="#374151" strokeWidth="1.5" />
        <rect x="60" y="92" width="40" height="20" rx="6" fill="#0d9488" />
        <circle cx="320" cy="80" r="32" fill="#e8effa" stroke="#374151" strokeWidth="2" />
        <circle cx="320" cy="74" r="16" fill="#ffffff" stroke="#374151" strokeWidth="1.5" />
        <rect x="300" y="92" width="40" height="20" rx="6" fill="#1a56db" />
        <rect x="150" y="50" width="100" height="60" rx="10" fill="#ffffff" stroke="#374151" strokeWidth="2" />
        <circle cx="170" cy="80" r="4" fill="#374151" />
        <circle cx="185" cy="80" r="4" fill="#374151" />
        <circle cx="200" cy="80" r="4" fill="#374151" />
      </svg>);
      case '4': return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" className="w-full h-24 md:h-32 rounded-xl">
        <rect x="0" y="0" width="400" height="160" rx="12" fill="#e8effa" opacity="0.3" />
        <rect x="20" y="20" width="160" height="120" rx="10" fill="#ffffff" stroke="#374151" strokeWidth="2" />
        <polyline points="40,120 80,100 120,80 150,50" fill="none" stroke="#1a56db" strokeWidth="3" />
        <circle cx="220" cy="60" r="24" fill="#e8effa" stroke="#374151" strokeWidth="2" />
        <path d="M210 60 L218 68 L234 52" stroke="#22c55e" strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="270" y="40" width="32" height="32" rx="6" fill="#ffffff" stroke="#374151" strokeWidth="2" />
        <rect x="310" y="40" width="32" height="32" rx="6" fill="#ffffff" stroke="#374151" strokeWidth="2" />
        <rect x="350" y="40" width="32" height="32" rx="6" fill="#ffffff" stroke="#374151" strokeWidth="2" />
        <circle cx="286" cy="56" r="6" fill="#22c55e" />
        <circle cx="326" cy="56" r="6" fill="#22c55e" />
        <circle cx="366" cy="56" r="6" fill="#22c55e" />
      </svg>);
      default: return null;
    }
  })();

  return (
    <div className="rounded-xl overflow-hidden h-24 md:h-32">
      {svg}
    </div>
  );
}

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

  const leader = specialists.find(s => s.role === 'Руководитель');
  const managers = specialists.filter(s => s.role !== 'Руководитель');

  return (
    <div>
      {/* 1. Hero — Split Layout */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a56db] via-[#1e40af] to-[#0d9488] text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0d9488]/20 rounded-full blur-3xl" />
        </div>

        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2">
          <img
            src="/images/hero-banner.webp"
            alt="UCS Service — поддержка rkeeper"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white z-10" />

        <div className="relative z-20 max-w-[1200px] mx-auto px-4 min-h-[500px] flex items-center">
          <div className="py-20 max-w-[600px]">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Экспертная поддержка
              <br /> пользователей rkeeper
            </h1>
            <ul className="space-y-3 max-w-lg mb-8">
              {[
                'Консультируем по вопросам с кассами, отчётами и складом',
                'Обучаем сотрудников',
                'Настраиваем справочники и номенклатуру',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-white/80 mt-[11px] shrink-0" />
                  <span className="text-lg md:text-xl opacity-90">{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link href="/services" className="inline-flex items-center gap-2 bg-white text-[#1a56db] font-bold px-8 py-3.5 rounded-xl text-base hover:bg-gray-100 no-underline transition-all shadow-lg hover:shadow-xl">
                Записаться <ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={() => setAuthOpen(true)} className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl text-base hover:bg-white/10 no-underline transition-all">
                Войти
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Team — 2+3 layout */}
      <section id="specialists" className="bg-white py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Отдел консультации и обучения</h2>
          <p className="text-center text-[#6b7280] mb-10 max-w-xl mx-auto">
            Профессионалы, которые помогут вам с любым вопросом по rkeeper
          </p>

          {leader && (
            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:overflow-visible md:grid md:grid-cols-2 md:gap-5 md:pb-0 mb-5">
              {/* Desktop: grid-2, Mobile: scroll */}
              <div className="snap-start shrink-0 w-[280px] md:w-auto">
                <div className="glass-card text-center p-6 h-full flex flex-col items-center">
                  <Avatar src={leader.avatarUrl} name={leader.name} size="lg" bg={leader.avatarBg} color={leader.avatarColor} className="mb-3" />
                  <h3 className="font-bold text-lg text-[#111827]">{leader.name}</h3>
                  <p className="text-sm text-[#6b7280] mt-0.5 mb-3">{leader.role}</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {leader.programTags?.map((tag) => {
                      const colors = programTagColors[tag] || { bg: '#f3f4f6', text: '#374151' };
                      return (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-1.5">
                    {leader.skillTags?.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {(() => {
                const elena = managers.find((s) => s.name === 'Елена');
                const others = managers.filter((s) => s.name !== 'Елена');
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
                          <p className="text-sm text-[#6b7280] mt-0.5 mb-3">{elena.role}</p>
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {elena.programTags?.map((tag) => {
                              const colors = programTagColors[tag] || { bg: '#f3f4f6', text: '#374151' };
                              return (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>
                                  {tag}
                                </span>
                              );
                            })}
                          </div>
                          <div className="flex flex-wrap justify-center gap-1.5 mt-1.5">
                            {elena.skillTags?.map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Desktop: grid-3 for others, Mobile: continue horizontal scroll */}
                    <div className="hidden md:grid md:grid-cols-3 md:gap-5 md:col-span-2 md:mt-5 md:w-full">
                      {others.map((spec) => (
                        <div key={spec.id} className="glass-card text-center p-5 flex flex-col items-center">
                          <Avatar src={spec.avatarUrl} name={spec.name} size="lg" bg={spec.avatarBg} color={spec.avatarColor} className="mb-3" />
                          <h3 className="font-semibold text-sm text-[#111827]">{spec.name}</h3>
                          <p className="text-xs text-[#6b7280] mt-0.5 mb-2">{spec.role}</p>
                          <div className="flex flex-wrap justify-center gap-1">
                            {spec.programTags?.map((tag) => {
                              const colors = programTagColors[tag] || { bg: '#f3f4f6', text: '#374151' };
                              return (
                                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>
                                  {tag}
                                </span>
                              );
                            })}
                          </div>
                          <div className="flex flex-wrap justify-center gap-1 mt-1">
                            {spec.skillTags?.map((tag) => (
                              <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
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
                            <p className="text-xs text-[#6b7280] mt-0.5 mb-2">{spec.role}</p>
                            <div className="flex flex-wrap justify-center gap-1">
                              {spec.programTags?.map((tag) => {
                                const colors = programTagColors[tag] || { bg: '#f3f4f6', text: '#374151' };
                                return (
                                  <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>
                                    {tag}
                                  </span>
                                );
                              })}
                            </div>
                            <div className="flex flex-wrap justify-center gap-1 mt-1">
                              {spec.skillTags?.map((tag) => (
                                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
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

      {/* 3. Services — 2x2 Grid */}
      <section id="services" className="bg-[#f9fafb] py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Наши услуги</h2>
          <p className="text-center text-[#6b7280] mb-10 max-w-xl mx-auto">
            Выберите формат поддержки, который подходит вашему бизнесу
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

      {/* 4. How It Works — Vertical Timeline */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Как это работает</h2>
          <p className="text-center text-[#6b7280] mb-14 max-w-xl mx-auto">
            Простой путь от заявки до результата
          </p>

          <div className="relative">
            <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1a56db] via-[#0d9488] to-[#1a56db]/10" />

            <div className="space-y-12">
              {howItWorksData.map((step, i) => (
                <div key={step.id} className="relative flex items-start gap-6 md:gap-10">
                  <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-lg font-bold shrink-0 relative z-10 bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white border-[3px] border-white shadow-md">
                    {step.icon}
                  </div>

                  <div className="min-w-0 flex-1 pt-1.5">
                    <h3 className="font-bold text-lg text-[#111827] mb-1.5">{step.title}</h3>
                    <p className="text-sm text-[#6b7280] mb-4">{step.description}</p>

                    <StepSvg step={step.icon} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="glass-btn text-base no-underline">
              Записаться сейчас <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Social Proof — Reviews Carousel */}
      <section id="reviews" className="bg-[#f9fafb] py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Что говорят клиенты</h2>
          <p className="text-center text-[#6b7280] mb-10 max-w-xl mx-auto">
            Реальные отзывы пользователей нашего сервиса
          </p>
          <ReviewsCarousel />
        </div>
      </section>

      {/* 6. FAQ — Accordion */}
      <section id="faq" className="bg-white py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Частые вопросы</h2>
          <p className="text-center text-[#6b7280] mb-10 max-w-xl mx-auto">
            Всё, что нужно знать перед записью
          </p>
          <FAQSection />
        </div>
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
