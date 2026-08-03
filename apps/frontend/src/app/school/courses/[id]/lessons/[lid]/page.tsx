'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Home } from 'lucide-react';
import type { Course, Lesson } from '@/types';
import coursesData from '@/data/school/courses.json';
import LessonView from '@/components/school/LessonView';

const courses = coursesData as unknown as Course[];

export default function LessonPage() {
  const { id, lid } = useParams<{ id: string; lid: string }>();
  const router = useRouter();
  const [completed, setCompleted] = useState(false);

  const course = courses.find((c) => c.id === id);
  const lesson = course?.modules.flatMap((m) => m.lessons).find((l) => l.id === lid);

  if (!course || !lesson) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <p className="text-[#6b7280]">Урок не найден</p>
        <Link href={`/school/courses/${id}`} className="text-[#1a56db] text-sm mt-2 inline-block hover:underline">
          Вернуться к курсу
        </Link>
      </div>
    );
  }

  const handleComplete = () => {
    setCompleted(true);
  };

  const handleContinue = () => {
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const currentIdx = allLessons.findIndex((l) => l.id === lesson.id);
    if (currentIdx < allLessons.length - 1) {
      const next = allLessons[currentIdx + 1];
      router.push(`/school/courses/${course.id}/lessons/${next.id}`);
    } else {
      router.push(`/school/courses/${course.id}`);
    }
  };

  if (completed) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#ecfdf5] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#059669]" />
          </div>
          <h2 className="text-xl font-bold mb-2">Урок завершён!</h2>
          <p className="text-sm text-[#6b7280] mb-6">{lesson.title}</p>
          <div className="flex justify-center gap-3">
            <button onClick={handleContinue} className="glass-btn">
              {(() => {
                const allLessons = course.modules.flatMap((m) => m.lessons);
                const currentIdx = allLessons.findIndex((l) => l.id === lesson.id);
                return currentIdx < allLessons.length - 1 ? 'Следующий урок' : 'К курсу';
              })()}
            </button>
            <Link href="/school" className="glass-btn">
              <Home className="w-4 h-4" /> На главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link href={`/school/courses/${course.id}`} className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {course.title}
      </Link>

      <div className="mb-6">
        <h1 className="text-xl font-bold">{lesson.title}</h1>
        <p className="text-sm text-[#6b7280]">{lesson.description}</p>
      </div>

      <LessonView lesson={lesson} onComplete={handleComplete} />
    </div>
  );
}
