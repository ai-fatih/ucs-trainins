'use client';
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
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

function calcExperience(startDate: string): string {
  const start = new Date(startDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  if (now.getMonth() < start.getMonth()) years--;
  return years > 0 ? `${years}+ лет` : 'Менее года';
}

interface TeamMember {
  name: string;
  role: string;
  startDate?: string;
  initials: string;
  bg: string;
  color: string;
}

const team: TeamMember[] = [
  { name: 'Амир', role: 'Руководитель отдела', initials: 'АМ', bg: '#e8effa', color: '#1a56db' },
  { name: 'Елена', role: 'Менеджер отдела', startDate: '2017-09-01', initials: 'ЕЛ', bg: '#ccfbf1', color: '#0d9488' },
  { name: 'Владислав', role: 'Менеджер отдела', startDate: '2025-04-10', initials: 'ВЛ', bg: '#fef3c7', color: '#d97706' },
  { name: 'Дмитрий', role: 'Менеджер отдела', startDate: '2025-10-01', initials: 'ДМ', bg: '#d1fae5', color: '#059669' },
  { name: 'Елизавета', role: 'Менеджер отдела', startDate: '2026-02-01', initials: 'ЕЛ', bg: '#ede9fe', color: '#7c3aed' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a56db] via-[#1e40af] to-[#0d9488] text-white py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0d9488] rounded-full blur-3xl" />
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
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-white text-[#1a56db] font-bold px-8 py-3.5 rounded-md text-base hover:bg-gray-100 no-underline transition-colors"
            >
              Записаться <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-8 py-3.5 rounded-md text-base hover:bg-white/10 no-underline transition-colors"
            >
              Войти
            </Link>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Наша команда</h2>
          <p className="text-center text-[#6b7280] mb-12 max-w-xl mx-auto">
            Профессионалы, которые помогут вам с любым вопросом по rkeeper
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-sm"
                  style={{ backgroundColor: member.bg, color: member.color }}
                >
                  {member.initials}
                </div>
                <h3 className="font-semibold text-base">{member.name}</h3>
                <p className="text-sm text-[#6b7280] mb-1">{member.role}</p>
                {member.startDate && (
                  <p className="text-xs font-semibold text-[#0d9488]">
                    {calcExperience(member.startDate)} в UCS
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-[#f9fafb] py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Наши услуги</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategoriesData.map((cat) => {
              const meta = categoryMeta[cat.id] || { icon: MessageCircle, badge: '', badgeVariant: '' };
              const IconComp = meta.icon;
              return (
                <Card key={cat.id} hoverable className="text-center" onClick={() => window.location.href = '/services'}>
                  <div className="w-12 h-12 bg-[#e8effa] text-[#1a56db] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{cat.label}</h3>
                  <p className="text-sm text-[#6b7280] mb-4">{cat.description}</p>
                  {meta.badge && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${meta.badgeVariant}`}>
                      {meta.badge}
                    </span>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works — Stepper */}
      <section className="bg-[#f9fafb] py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Как это работает</h2>
          <p className="text-center text-[#6b7280] mb-12 max-w-xl mx-auto">
            Всего несколько шагов, чтобы получить профессиональную помощь
          </p>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#0d9488]/20 md:hidden" />

            <div className="hidden md:flex flex-row gap-0 relative">
              {howItWorksData.map((step, i) => (
                <div key={step.id} className="flex-1 relative px-4">
                  {i < howItWorksData.length - 1 && (
                    <div className="absolute top-6 left-[calc(50%+28px)] right-[calc(50%-28px)] h-0.5 bg-[#0d9488]/20" />
                  )}
                  <div className="w-12 h-12 bg-[#0d9488] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 relative z-10">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-center mb-2">{step.title}</h3>
                  <p className="text-sm text-[#6b7280] text-center">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="md:hidden flex flex-col gap-8">
              {howItWorksData.map((step) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0d9488] text-white rounded-full flex items-center justify-center text-lg font-bold shrink-0 relative z-10">
                    {step.icon}
                  </div>
                  <div className="pt-2.5">
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-[#6b7280]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="btn-primary">
              Записаться сейчас <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-4 text-sm text-[#9ca3af] border-t border-[#e5e7eb] bg-white">
        <p>UCS service — Отдел пользовательской поддержки rkeeper &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
