'use client';
import type { Lesson } from '@/types';

interface Props {
  lesson: Lesson;
  onComplete: () => void;
}

export default function LessonView({ lesson }: Props) {
  return (
    <div className="glass-card p-6 text-center">
      <div className="text-3xl mb-2">🔜</div>
      <p className="text-sm text-[#6b7280] leading-relaxed">
        {lesson.stub
          ? 'Скоро вы сможете потренироваться здесь.'
          : 'Тренажёр в разработке — вернитесь позже.'}
      </p>
    </div>
  );
}
