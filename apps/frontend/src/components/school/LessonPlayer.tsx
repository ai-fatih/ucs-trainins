'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Home } from 'lucide-react';
import type { Course, Lesson } from '@/types';
import LessonView from '@/components/school/LessonView';
import { PageHelp } from '@/components/layout/PageHelp';
import { useHydrated } from '@/lib/hooks/useHydrated';
import { useSchoolProgress } from '@/stores/schoolProgress';

interface Props {
  course: Course;
  lesson: Lesson;
}

export function LessonPlayer({ course, lesson }: Props) {
  const router = useRouter();
  const hydrated = useHydrated();
  const completed = useSchoolProgress((s) => s.completed);
  const [justCompleted, setJustCompleted] = useState(false);

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIdx = allLessons.findIndex((l) => l.id === lesson.id);
  const hasNext = currentIdx < allLessons.length - 1;
  const nextLesson = hasNext ? allLessons[currentIdx + 1] : undefined;
  const alreadyDone = hydrated && !!completed[lesson.id];

  const handleComplete = () => {
    useSchoolProgress.getState().complete(lesson.id);
    setJustCompleted(true);
  };

  const handleContinue = () => {
    if (nextLesson) {
      router.push(`/school/courses/${course.id}/lessons/${nextLesson.id}`);
    } else {
      router.push(`/school/courses/${course.id}`);
    }
  };

  if (justCompleted) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#ecfdf5] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-[#059669]" />
        </div>
        <h2 className="text-xl font-bold mb-2">Урок завершён!</h2>
        <p className="text-sm text-[#6b7280] mb-6">{lesson.title}</p>
        <div className="flex justify-center gap-3">
          <button onClick={handleContinue} className="glass-btn">
            {hasNext ? 'Следующий урок' : 'К курсу'}
          </button>
          <Link href="/school" className="glass-btn">
            <Home className="w-4 h-4" /> В школу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {alreadyDone && (
        <div className="glass-card p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#059669]">
            <CheckCircle2 className="w-5 h-5" /> Урок уже пройден
          </div>
          {nextLesson && (
            <button onClick={handleContinue} className="glass-btn">
              Следующий урок <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="mb-6 flex items-start gap-2">
        <div>
          <h1 className="text-xl font-bold">{lesson.title}</h1>
          <p className="text-sm text-[#6b7280]">{lesson.description}</p>
        </div>
        <PageHelp />
      </div>

      <LessonView lesson={lesson} onComplete={handleComplete} />
    </>
  );
}
