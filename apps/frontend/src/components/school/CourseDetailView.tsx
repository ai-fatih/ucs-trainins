'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Course, CourseProgress } from '@/types';
import ModuleBlock from './ModuleBlock';

interface Props {
  course: Course;
  progress: CourseProgress;
  onStartLesson: (lessonId: string) => void;
}

export default function CourseDetailView({ course, progress, onStartLesson }: Props) {
  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedCount = progress.completedLessons.length;
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
  let availableUpTo = -1;
  for (const lesson of allLessonIds) {
    if (progress.completedLessons.includes(lesson)) {
      availableUpTo = allLessonIds.indexOf(lesson);
    } else {
      break;
    }
  }
  const availableLessons = allLessonIds.slice(0, Math.max(availableUpTo + 2, 1));

  return (
    <div>
      <Link href="/school/courses" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> К курсам
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: course.iconBg }}>
          <span className="text-2xl">{course.icon === 'Monitor' ? '🖥' : course.icon === 'Cloud' ? '☁️' : course.icon === 'Database' ? '🗄' : course.icon === 'Swords' ? '⚔️' : '🧩'}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-sm text-[#6b7280]">{course.description}</p>
        </div>
      </div>

      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#6b7280]">Прогресс курса</span>
          <span className="text-sm font-bold" style={{ color: course.colorFrom }}>{pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#e5e7eb] mb-1">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${pct}%`, background: `linear-gradient(to right, ${course.colorFrom}, ${course.colorTo})` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#9ca3af]">
          <span>{completedCount} / {totalLessons} уроков</span>
          <span>{course.totalXp} XP</span>
        </div>
      </div>

      <div className="space-y-4">
        {course.modules
          .sort((a, b) => a.order - b.order)
          .map((mod) => (
            <ModuleBlock
              key={mod.id}
              module={mod}
              completedLessonIds={progress.completedLessons}
              allLessons={availableLessons}
              onStartLesson={onStartLesson}
            />
          ))}
      </div>
    </div>
  );
}