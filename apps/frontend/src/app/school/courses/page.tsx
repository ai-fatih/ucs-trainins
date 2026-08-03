import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Course } from '@/types';
import coursesData from '@/data/school/courses.json';
import CourseCard from '@/components/school/CourseCard';

const courses = coursesData as unknown as Course[];

export default function CoursesPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link href="/school" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> На главную
      </Link>

      <h1 className="text-2xl font-bold mb-6">Курсы</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
