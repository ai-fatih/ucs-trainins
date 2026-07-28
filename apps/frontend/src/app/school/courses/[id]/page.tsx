'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { Course, CourseProgress } from '@/types';
import coursesData from '@/data/school/courses.json';
import { getCourseProgress } from '@/lib/school/storage';
import CourseDetailView from '@/components/school/CourseDetailView';
import { ArrowRight } from 'lucide-react';

const courses = coursesData as unknown as Course[];

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [progress, setProgress] = useState<CourseProgress | null>(null);

  const course = courses.find(c => c.id === id);

  useEffect(() => {
    if (course) {
      setProgress(getCourseProgress(course.id));
    }
  }, [course]);

  if (!course) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <p className="text-[#6b7280]">Курс не найден</p>
      </div>
    );
  }

  const handleStartLesson = (lessonId: string) => {
    router.push(`/school/courses/${course.id}/lessons/${lessonId}`);
  };

  const currentProgress = progress || { courseId: course.id, completedLessons: [], totalScore: 0, startedAt: '', completedAt: null };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <CourseDetailView course={course} progress={currentProgress} onStartLesson={handleStartLesson} />

      <div className="mt-8 pt-6 border-t border-[#e5e7eb]/50">
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white no-underline transition-all bg-gradient-to-r from-[#1a56db] to-[#0d9488] hover:shadow-lg hover:-translate-y-0.5 text-sm"
        >
          Записаться на консультацию
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}