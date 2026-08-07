import React from 'react';
import Link from 'next/link';
import { Monitor, Cloud, Database, Swords, Puzzle, ArrowRight, BookOpen } from 'lucide-react';
import type { Course } from '@/types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor, Cloud, Database, Swords, Puzzle,
};

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const Icon = ICON_MAP[course.icon] || BookOpen;
  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const allStub = allLessons.length > 0 && allLessons.every((l) => l.stub);

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
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-base group-hover:text-[#1a56db] transition-colors">
              {course.title}
            </h3>
            <span
              className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
              style={{ background: `${course.colorFrom}1a`, color: course.colorFrom }}
            >
              {allStub ? 'Скоро' : 'Тренажёр'}
            </span>
          </div>
          <p className="text-xs text-[#6b7280] line-clamp-2 mb-3">{course.description}</p>

          {course.skills && course.skills.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">
                Научишься
              </div>
              <ul className="space-y-0.5">
                {course.skills.map((skill) => (
                  <li key={skill} className="text-xs text-[#374151] flex items-start gap-1.5">
                    <span className="text-[#0d9488] shrink-0 mt-0.5">✓</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-[#9ca3af] mb-2">
            <span>{totalLessons} уроков</span>
            <span>~{course.estimatedHours} ч</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: course.colorFrom }}>
            Начать тренировку <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
