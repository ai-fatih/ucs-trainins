import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Course, Lesson } from '@/types';
import coursesData from '@/data/school/courses.json';
import { LessonPlayer } from '@/components/school/LessonPlayer';

const courses = coursesData as unknown as Course[];

export function generateStaticParams() {
  return courses.flatMap((c) =>
    c.modules.flatMap((m) => m.lessons.map((l) => ({ id: c.id, lid: l.id }))),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lid: string }>;
}): Promise<Metadata> {
  const { id, lid } = await params;
  const course = courses.find((c) => c.id === id);
  const lesson = course?.modules.flatMap((m) => m.lessons).find((l) => l.id === lid);
  if (!lesson) return { title: 'Урок не найден' };

  const url = `https://ucs-service.vercel.app/school/courses/${id}/lessons/${lid}`;
  return {
    title: lesson.title,
    description: lesson.description,
    alternates: { canonical: url },
    openGraph: { title: lesson.title, description: lesson.description, url, type: 'article' },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lid: string }>;
}) {
  const { id, lid } = await params;
  const course = courses.find((c) => c.id === id);
  const lesson = course?.modules.flatMap((m) => m.lessons).find((l) => l.id === lid);

  if (!course || !lesson) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <p className="text-[#6b7280]">Урок не найден</p>
        <Link
          href={`/school/courses/${id}`}
          className="text-[#1a56db] text-sm mt-2 inline-block hover:underline"
        >
          Вернуться к курсу
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link
        href={`/school/courses/${course.id}`}
        className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {course.title}
      </Link>

      <LessonPlayer course={course} lesson={lesson} />
    </div>
  );
}
