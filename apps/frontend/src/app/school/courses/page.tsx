import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Course } from '@/types';
import coursesData from '@/data/school/courses.json';
import CourseCard from '@/components/school/CourseCard';
import { PageHelp } from '@/components/layout/PageHelp';
import { buildOpenGraph } from '@/lib/seo';

const courses = coursesData as unknown as Course[];

export const metadata: Metadata = {
  title: 'Курсы школы rkeeper',
  description:
    'Каталог открытых курсов по rkeeper: квизы, спринты, сопоставления и деревья решений на реальных кейсах. Обучение без регистрации.',
  alternates: { canonical: 'https://ucs-service.vercel.app/school/courses' },
  openGraph: buildOpenGraph({
    title: 'Курсы школы rkeeper',
    description:
      'Каталог открытых курсов по rkeeper: квизы, спринты, сопоставления и деревья решений на реальных кейсах.',
    url: 'https://ucs-service.vercel.app/school/courses',
  }),
};

export default function CoursesPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link href="/school" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> В школу
      </Link>

      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">Курсы</h1>
        <PageHelp />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
