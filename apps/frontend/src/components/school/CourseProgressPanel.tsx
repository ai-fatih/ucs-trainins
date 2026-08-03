'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import type { Course } from '@/types';
import { useHydrated } from '@/lib/hooks/useHydrated';
import { useSchoolProgress } from '@/stores/schoolProgress';

const allCourseLessons = (course: Course) =>
  course.modules.flatMap((m) => m.lessons);

export default function CourseProgressPanel({ course }: { course: Course }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const completed = useSchoolProgress((s) => s.completed);

  const lessons = allCourseLessons(course);
  const lessonIds = lessons.map((l) => l.id);
  const total = lessonIds.length;
  const doneCount = hydrated ? lessonIds.filter((id) => completed[id]).length : 0;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const finished = hydrated && doneCount === total;
  const nextLesson = hydrated
    ? lessons.find((l) => !completed[l.id])
    : undefined;

  const goNext = () => {
    if (!nextLesson) return;
    router.push(`/school/courses/${course.id}/lessons/${nextLesson.id}`);
  };

  const reset = () => {
    useSchoolProgress.getState().reset(lessonIds);
  };

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold">
          {hydrated
            ? `Прогресс: ${doneCount} из ${total} уроков`
            : 'Прогресс: —'}
        </span>
        <span className="text-sm font-semibold text-[#1a56db]">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#e5e7eb] overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#1a56db] to-[#0d9488] transition-all"
          style={{ width: `${hydrated ? pct : 0}%` }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 min-h-[36px]">
        {finished && (
          <div className="inline-flex items-center gap-1 text-sm font-semibold text-[#059669]">
            <CheckCircle2 className="w-4 h-4" /> Курс пройден!
          </div>
        )}
        {nextLesson && (
          <button onClick={goNext} className="glass-btn">
            Продолжить: {nextLesson.title}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        {hydrated && doneCount > 0 && (
          <button onClick={reset} className="glass-btn border-[#e5e7eb] text-[#6b7280]">
            <RotateCcw className="w-4 h-4" /> Сбросить прогресс
          </button>
        )}
      </div>
    </div>
  );
}