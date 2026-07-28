'use client';
import React from 'react';
import Link from 'next/link';
import { Monitor, Cloud, Database, Swords, Puzzle, ArrowRight, BookOpen } from 'lucide-react';
import type { Course, CourseProgress } from '@/types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor, Cloud, Database, Swords, Puzzle,
};

interface Props {
  course: Course;
  progress?: CourseProgress;
}

export default function CourseCard({ course, progress }: Props) {
  const Icon = ICON_MAP[course.icon] || BookOpen;
  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedCount = progress?.completedLessons.length || 0;
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <Link
      href={`/school/courses/${course.id}`}
      className="glass-card p-6 hover:shadow-lg transition-all block group"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: course.iconBg }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base mb-1 group-hover:text-[#1a56db] transition-colors">{course.title}</h3>
          <p className="text-xs text-[#6b7280] line-clamp-2 mb-3">{course.description}</p>

          <div className="flex items-center justify-between text-xs text-[#9ca3af] mb-2">
            <span>{totalLessons} уроков</span>
            <span>~{course.estimatedHours} ч</span>
            <span>{course.totalXp} XP</span>
          </div>

          {progress && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#6b7280]">{completedCount}/{totalLessons} уроков</span>
                <span className="font-semibold" style={{ color: course.colorFrom }}>{pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#e5e7eb]">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${pct}%`, background: `linear-gradient(to right, ${course.colorFrom}, ${course.colorTo})` }}
                />
              </div>
            </div>
          )}

          {!progress && (
            <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: course.colorFrom }}>
              Начать обучение <ArrowRight className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}