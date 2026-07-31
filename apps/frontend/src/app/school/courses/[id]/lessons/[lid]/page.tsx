'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Home, MessageCircle } from 'lucide-react';
import type { Course, Lesson } from '@/types';
import coursesData from '@/data/school/courses.json';
import { saveCourseProgress, getAllCourseProgress, getSchoolStats, saveSchoolStats, checkAndAwardBadges, checkAndAwardCertificates } from '@/lib/school/storage';
import LessonView from '@/components/school/LessonView';

const courses = coursesData as unknown as Course[];

export default function LessonPage() {
  const { id, lid } = useParams<{ id: string; lid: string }>();
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const course = courses.find(c => c.id === id);
  const lesson = course?.modules.flatMap(m => m.lessons).find(l => l.id === lid);

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

  const handleComplete = (earnedScore: number) => {
    setScore(earnedScore);
    saveCourseProgress(course.id, lesson.id, earnedScore);
    setCompleted(true);
  };

  const handleContinue = () => {
    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIdx = allLessons.findIndex(l => l.id === lesson.id);
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
          <p className="text-sm text-[#6b7280] mb-2">{lesson.title}</p>
          <div className="text-3xl font-bold text-[#ca8a04] mb-6">+{score} XP</div>
          <div className="flex justify-center gap-3">
            <button onClick={handleContinue} className="glass-btn">
              {(() => {
                const allLessons = course.modules.flatMap(m => m.lessons);
                const currentIdx = allLessons.findIndex(l => l.id === lesson.id);
                return currentIdx < allLessons.length - 1 ? 'Следующий урок' : 'К курсу';
              })()}
            </button>
            <Link href="/school" className="glass-btn">
              <Home className="w-4 h-4" /> На главную
            </Link>
          </div>
          <div className="mt-6 pt-6 border-t border-[#e5e7eb]/50">
            <Link
              href={`/booking?topic=${encodeURIComponent(course.title)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white no-underline transition-all bg-gradient-to-r from-[#1a56db] to-[#0d9488] hover:shadow-lg hover:-translate-y-0.5 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Записаться на консультацию по теме урока
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

      <div className="mt-6 glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold text-[#111827]">Нужна помощь с этой темой?</div>
          <div className="text-xs text-[#6b7280]">Запишитесь на консультацию — специалист разберёт вопросы лично</div>
        </div>
        <Link
          href={`/booking?topic=${encodeURIComponent(course.title)}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white no-underline transition-all bg-gradient-to-r from-[#1a56db] to-[#0d9488] hover:shadow-lg hover:-translate-y-0.5 text-sm shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          Консультация по теме
        </Link>
      </div>
    </div>
  );
}