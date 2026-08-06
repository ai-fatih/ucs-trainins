import type { MetadataRoute } from 'next';
import instructionsData from '@/data/instructions.json';
import coursesData from '@/data/school/courses.json';
import casesYear from '@/data/cases/yearly.json';
import type { Instruction, Course, YearlyCases } from '@/types';

const BASE_URL = 'https://ucs-service.vercel.app';

const instructions = instructionsData as unknown as Instruction[];
const courses = coursesData as unknown as Course[];
const year = casesYear as YearlyCases;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/docs`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/school`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/offer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/consent`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const docPages: MetadataRoute.Sitemap = instructions
    .filter((ins) => !ins.stub)
    .map((ins) => ({
      url: `${BASE_URL}/docs/${ins.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  const coursePages: MetadataRoute.Sitemap = courses.flatMap((course) => [
    {
      url: `${BASE_URL}/school/courses/${course.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    ...course.modules.flatMap((mod) =>
      mod.lessons.map((lesson) => ({
        url: `${BASE_URL}/school/courses/${course.id}/lessons/${lesson.id}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ),
  ]);

  const faqPages: MetadataRoute.Sitemap = year.months.flatMap((month) => [
    {
      url: `${BASE_URL}/faq/${month.month}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    ...(month.cases ?? []).map((c) => ({
      url: `${BASE_URL}/faq/${month.month}/${c.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]);

  return [...staticPages, ...docPages, ...coursePages, ...faqPages];
}
