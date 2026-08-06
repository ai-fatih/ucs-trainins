import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Course } from '@/types';
import coursesData from '@/data/school/courses.json';
import CourseDetailView from '@/components/school/CourseDetailView';

const courses = coursesData as unknown as Course[];

export function generateStaticParams() {
  return courses.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const course = courses.find((c) => c.id === id);
  if (!course) return { title: 'Курс не найден' };

  const url = `https://ucs-service.vercel.app/school/courses/${course.id}`;
  return {
    title: course.title,
    description: course.description,
    alternates: { canonical: url },
    openGraph: { title: course.title, description: course.description, url, type: 'article' },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <p className="text-[#6b7280]">Курс не найден</p>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <CourseDetailView course={course} />
    </div>
  );
}
