import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Course } from '@/types';
import ModuleBlock from './ModuleBlock';
import CourseProgressPanel from './CourseProgressPanel';
import { PageHelp } from '@/components/layout/PageHelp';

interface Props {
  course: Course;
}

export default function CourseDetailView({ course }: Props) {
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
        <PageHelp />
      </div>

      {course.skills && course.skills.length > 0 && (
        <div className="glass-card p-4 mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">
            Чему научишься
          </div>
          <div className="flex flex-wrap gap-2">
            {course.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-3 py-1.5 rounded-full bg-[#e8effa] text-[#1a56db] font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <CourseProgressPanel course={course} />

      <div className="space-y-4">
        {course.modules
          .sort((a, b) => a.order - b.order)
          .map((mod) => (
            <ModuleBlock
              key={mod.id}
              courseId={course.id}
              module={mod}
            />
          ))}
      </div>
    </div>
  );
}
