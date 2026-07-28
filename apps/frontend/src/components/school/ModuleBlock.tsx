'use client';
import React from 'react';
import type { Module } from '@/types';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

interface Props {
  module: Module;
  completedLessonIds: string[];
  allLessons: string[];
  onStartLesson: (lessonId: string) => void;
}

export default function ModuleBlock({ module, completedLessonIds, allLessons, onStartLesson }: Props) {
  const completedInModule = module.lessons.filter(l => completedLessonIds.includes(l.id)).length;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-base">{module.title}</h3>
          <p className="text-xs text-[#6b7280]">{module.description}</p>
        </div>
        <div className="text-xs font-semibold text-[#6b7280]">
          {completedInModule}/{module.lessons.length}
        </div>
      </div>
      <div className="space-y-1">
        {module.lessons.map((lesson) => {
          const isCompleted = completedLessonIds.includes(lesson.id);
          const isAvailable = allLessons.includes(lesson.id);
          return (
            <button
              key={lesson.id}
              onClick={() => isAvailable && onStartLesson(lesson.id)}
              disabled={!isAvailable}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isCompleted
                  ? 'bg-[#ecfdf5] text-[#059669]'
                  : isAvailable
                    ? 'hover:bg-[#f0f4ff] text-[#374151]'
                    : 'text-[#9ca3af] cursor-not-allowed'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-[#059669]" />
              ) : isAvailable ? (
                <Circle className="w-5 h-5 text-[#d1d5db]" />
              ) : (
                <Lock className="w-5 h-5 text-[#d1d5db]" />
              )}
              <span className="flex-1 text-left">{lesson.title}</span>
              <span className="text-[10px] text-[#9ca3af]">{lesson.durationMinutes} мин</span>
              <span className="text-[10px] font-semibold text-[#ca8a04]">+{lesson.xpReward} XP</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}