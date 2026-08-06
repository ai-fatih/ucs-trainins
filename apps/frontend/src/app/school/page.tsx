import type { Metadata } from 'next';
import React from 'react';
import { GraduationCap, Swords, Clock, Zap, Sparkles } from 'lucide-react';
import type { Course } from '@/types';
import coursesData from '@/data/school/courses.json';
import CourseCard from '@/components/school/CourseCard';
import { PageHelp } from '@/components/layout/PageHelp';

const courses = coursesData as unknown as Course[];

export const metadata: Metadata = {
  title: 'Школа rkeeper — Тренажёры и курсы',
  description:
    'Бесплатные тренажёры по rkeeper: квизы, спринты, сопоставления и деревья решений на реальных кейсах. Учись без регистрации.',
  alternates: { canonical: 'https://ucs-service.vercel.app/school' },
  openGraph: {
    title: 'Школа rkeeper — Тренажёры и курсы',
    description:
      'Бесплатные тренажёры по rkeeper: квизы, спринты, сопоставления и деревья решений на реальных кейсах.',
    url: 'https://ucs-service.vercel.app/school',
  },
};

const totalLessons = courses.reduce((s, c) => s + c.modules.reduce((m, x) => m + x.lessons.length, 0), 0);
const totalXp = courses.reduce((s, c) => s + c.totalXp, 0);

const upcoming = [
  'Создание и оплата заказа в Delivery',
  'Термины и утилиты StoreHouse Pro',
  'Кассы и оплаты в Waiter & Cash Desk',
  'Спринт: типовые ошибки RK7',
];

export default function SchoolPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            courses.map((course) => ({
              '@context': 'https://schema.org',
              '@type': 'Course',
              name: course.title,
              description: course.description,
              provider: {
                '@type': 'Organization',
                name: 'UCS Service',
                url: 'https://ucs-service.vercel.app',
              },
              url: `https://ucs-service.vercel.app/school/courses/${course.id}`,
              numberOfHours: course.estimatedHours,
              coursePrerequisites: 'Без регистрации',
            })),
          ),
        }}
      />
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Школа UCS Service</h1>
          <PageHelp />
        </div>
        <p className="text-sm text-[#6b7280]">Тренажёры вместо лекций: решай реальные кейсы и закрепляй навыки</p>
      </div>

      <div className="glass-card p-6 mb-8 bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Swords className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold">Школа — это тренажёр</h2>
            <p className="text-sm text-white/80">Никакой скучной теории. Учишься, решая задачи, с которыми сталкиваются на реальной работе.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-start gap-2.5 bg-white/10 rounded-xl p-3">
            <Clock className="w-4 h-4 shrink-0 mt-0.5 text-white/70" />
            <div>
              <div className="text-sm font-semibold">Шаг за шагом</div>
              <div className="text-xs text-white/80">Каждое действие проверяется сразу — с подсказками</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-white/10 rounded-xl p-3">
            <Zap className="w-4 h-4 shrink-0 mt-0.5 text-white/70" />
            <div>
              <div className="text-sm font-semibold">Опыт (XP)</div>
              <div className="text-xs text-white/80">Решай задания и копи опыт — видно прогресс</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-white/10 rounded-xl p-3">
            <GraduationCap className="w-4 h-4 shrink-0 mt-0.5 text-white/70" />
            <div>
              <div className="text-sm font-semibold">Реальные кейсы</div>
              <div className="text-xs text-white/80">Задания построены на типовых обращениях консультаций</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8 text-xs text-[#6b7280]">
        <span className="px-3 py-1.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold">{courses.length} курсов</span>
        <span className="px-3 py-1.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold">{totalLessons} уроков</span>
        <span className="px-3 py-1.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold">до {totalXp} XP</span>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-4">Доступные тренажёры</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#d97706]" />
          <h2 className="text-base font-semibold text-[#111827]">Скоро в школе</h2>
        </div>
        <ul className="space-y-2">
          {upcoming.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-[#6b7280]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
