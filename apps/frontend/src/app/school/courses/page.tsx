'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Course, CourseProgress } from '@/types';
import coursesData from '@/data/school/courses.json';
import { getAllCourseProgress } from '@/lib/school/storage';
import CourseCard from '@/components/school/CourseCard';

const courses = coursesData as unknown as Course[];

export default function CoursesPage() {
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({});

  useEffect(() => {
    setCourseProgress(getAllCourseProgress());
  }, []);

  const inProgress = courses.filter(c => {
    const p = courseProgress[c.id];
    if (!p) return false;
    const total = c.modules.reduce((s, m) => s + m.lessons.length, 0);
    return p.completedLessons.length > 0 && p.completedLessons.length < total;
  });

  const notStarted = courses.filter(c => {
    const p = courseProgress[c.id];
    return !p || p.completedLessons.length === 0;
  });

  const completed = courses.filter(c => {
    const p = courseProgress[c.id];
    if (!p) return false;
    const total = c.modules.reduce((s, m) => s + m.lessons.length, 0);
    return p.completedLessons.length >= total;
  });

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link href="/school" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> На главную
      </Link>

      <h1 className="text-2xl font-bold mb-6">Мои курсы</h1>

      {inProgress.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#6b7280] mb-3 uppercase tracking-wider">В процессе</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inProgress.map(course => (
              <CourseCard key={course.id} course={course} progress={courseProgress[course.id]} />
            ))}
          </div>
        </div>
      )}

      {notStarted.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#6b7280] mb-3 uppercase tracking-wider">Доступные курсы</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notStarted.map(course => (
              <CourseCard key={course.id} course={course} progress={courseProgress[course.id]} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#6b7280] mb-3 uppercase tracking-wider">Завершённые</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {completed.map(course => (
              <CourseCard key={course.id} course={course} progress={courseProgress[course.id]} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}