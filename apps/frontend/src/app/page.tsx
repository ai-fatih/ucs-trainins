'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/Avatar';
import { AuthModal } from '@/components/auth/AuthModal';
import { api } from '@/lib/api';
import type { Specialist } from '@/types';
import {
  MessageCircle, GraduationCap, Video, Database, ArrowRight,
} from 'lucide-react';
import howItWorksData from '@/data/how-it-works.json';
import serviceCategoriesData from '@/data/service-categories.json';

const categoryMeta: Record<string, { icon: React.ElementType; badge: string; badgeVariant: string }> = {
  consultations: { icon: MessageCircle, badge: '30 мин', badgeVariant: 'bg-[#e8effa] text-[#1a56db]' },
  trainings: { icon: GraduationCap, badge: 'от 2 ч', badgeVariant: 'bg-[#fef3c7] text-[#d97706]' },
  video: { icon: Video, badge: '60 мин', badgeVariant: 'bg-[#ede9fe] text-[#7c3aed]' },
  directories: { icon: Database, badge: 'от 60 мин', badgeVariant: 'bg-[#ccfbf1] text-[#0d9488]' },
};

export default function HomePage() {
  const { data: specialists = [] } = useQuery<Specialist[]>({
    queryKey: ['specialists'],
    queryFn: api.specialists.list,
  });
  const [authOpen, setAuthOpen] = useState(false);

  const leader = specialists.find(s => s.role === 'Руководитель отдела');
  const managers = specialists.filter(s => s.role !== 'Руководитель отдела');

  return (
    <div>
      {/* Hero — Glassmorphism */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a56db] via-[#1e40af] to-[#0d9488] text-white py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0d9488]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Экспертная поддержка
              <br className="hidden md:block" /> пользователей rkeeper
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
              Решаем вопросы с кассами, отчётами и складом. Обучаем сотрудников.
              Настраиваем справочники и номенклатуру.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setAuthOpen(true)}
              className="inline-flex items-center gap-2 bg-white text-[#1a56db] font-bold px-8 py-3.5 rounded-xl text-base hover:bg-gray-100 no-underline transition-all shadow-lg hover:shadow-xl"
            >
              Записаться <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAuthOpen(true)}
              className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl text-base hover:bg-white/10 no-underline transition-all"
            >
              Войти
            </button>
          </div>
        </div>
      </section>

      {/* Team — Glassmorphism */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Наша команда</h2>
          <p className="text-center text-[#6b7280] mb-12 max-w-xl mx-auto">
            Профессионалы, которые помогут вам с любым вопросом по rkeeper
          </p>

          {/* Leader — larger card */}
          {leader && (
            <div className="flex justify-center mb-10">
              <div className="glass-card px-8 py-6 flex items-center gap-6 max-w-md">
                <Avatar
                  src={leader.avatarUrl}
                  name={leader.name}
                  size="lg"
                  bg={leader.avatarBg}
                  color={leader.avatarColor}
                />
                <div>
                  <h3 className="font-bold text-lg">{leader.name}</h3>
                  <p className="text-sm text-[#6b7280]">{leader.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Managers — smaller cards in row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {managers.map((spec) => (
              <div key={spec.id} className="glass-card text-center p-5">
                <Avatar
                  src={spec.avatarUrl}
                  name={spec.name}
                  size="md"
                  bg={spec.avatarBg}
                  color={spec.avatarColor}
                  className="mx-auto mb-3"
                />
                <h3 className="font-semibold text-sm">{spec.name}</h3>
                <p className="text-xs text-[#6b7280]">{spec.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services — Glassmorphism Cards */}
      <section className="bg-[#f9fafb] py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Наши услуги</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategoriesData.map((cat) => {
              const meta = categoryMeta[cat.id] || { icon: MessageCircle, badge: '', badgeVariant: '' };
              const IconComp = meta.icon;
              return (
                <Link
                  key={cat.id}
                  href="/services"
                  className="glass-card text-center p-6 no-underline group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[#111827]">{cat.label}</h3>
                  <p className="text-sm text-[#6b7280] mb-4">{cat.description}</p>
                  {meta.badge && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${meta.badgeVariant}`}>
                      {meta.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works — Glassmorphism Stepper */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Как это работает</h2>
          <p className="text-center text-[#6b7280] mb-12 max-w-xl mx-auto">
            Всего несколько шагов, чтобы получить профессиональную помощь
          </p>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1a56db] to-[#0d9488]/20 md:hidden" />

            <div className="hidden md:flex flex-row gap-0 relative">
              {howItWorksData.map((step, i) => (
                <div key={step.id} className="flex-1 relative px-4">
                  {i < howItWorksData.length - 1 && (
                    <div className="absolute top-6 left-[calc(50%+28px)] right-[calc(50%-28px)] h-0.5 bg-gradient-to-r from-[#1a56db]/30 to-[#0d9488]/30" />
                  )}
                  <div className="glass-card w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10 bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white border-0">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-center mb-2 text-[#111827]">{step.title}</h3>
                  <p className="text-sm text-[#6b7280] text-center">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="md:hidden flex flex-col gap-8">
              {howItWorksData.map((step) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="glass-card w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 relative z-10 bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white border-0">
                    {step.icon}
                  </div>
                  <div className="pt-2.5">
                    <h3 className="font-semibold mb-1 text-[#111827]">{step.title}</h3>
                    <p className="text-sm text-[#6b7280]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <button onClick={() => setAuthOpen(true)} className="glass-btn text-base">
              Записаться сейчас <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
