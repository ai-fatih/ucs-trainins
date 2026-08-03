'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import type { Module } from '@/types';
import { useHydrated } from '@/lib/hooks/useHydrated';
import { useSchoolProgress } from '@/stores/schoolProgress';

interface Props {
  courseId: string;
  module: Module;
}

export default function ModuleBlock({ courseId, module }: Props) {
  const hydrated = useHydrated();
  const completed = useSchoolProgress((s) => s.completed);

  return (
    <div className="glass-card p-5">
      <div className="mb-3">
        <h3 className="font-bold text-base">{module.title}</h3>
        <p className="text-xs text-[#6b7280]">{module.description}</p>
      </div>
      <div className="space-y-1">
        {module.lessons.map((lesson) => {
          const done = hydrated && !!completed[lesson.id];
          return (
            <Link
              key={lesson.id}
              href={`/school/courses/${courseId}/lessons/${lesson.id}`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-[#f0f4ff] no-underline ${
                done ? 'text-[#6b7280]' : 'text-[#374151]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  done ? 'border-[#059669] bg-[#ecfdf5]' : 'border-[#d1d5db]'
                }`}
              >
                {done ? (
                  <Check className="w-3 h-3 text-[#059669]" />
                ) : (
                  <ArrowRight className="w-3 h-3 text-[#9ca3af]" />
                )}
              </span>
              <span className="flex-1 text-left">{lesson.title}</span>
              {done ? (
                <span className="text-[10px] font-semibold text-[#059669]">Пройден</span>
              ) : (
                <span className="text-[10px] text-[#9ca3af]">{lesson.durationMinutes} мин</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}