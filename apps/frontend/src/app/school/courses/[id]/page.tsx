'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import type { Course } from '@/types';
import coursesData from '@/data/school/courses.json';
import CourseDetailView from '@/components/school/CourseDetailView';

const courses = coursesData as unknown as Course[];

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
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
