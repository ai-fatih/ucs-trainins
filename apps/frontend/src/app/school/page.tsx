import React from 'react';
import { GraduationCap } from 'lucide-react';
import type { Course } from '@/types';
import coursesData from '@/data/school/courses.json';
import CourseCard from '@/components/school/CourseCard';

const courses = coursesData as unknown as Course[];

export default function SchoolPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Школа UCS Service</h1>
        </div>
        <p className="text-sm text-[#6b7280]">Открытые учебные материалы и тренажёры для специалистов</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
