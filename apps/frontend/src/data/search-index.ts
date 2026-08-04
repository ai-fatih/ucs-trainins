import coursesData from '@/data/school/courses.json';
import instructionsData from '@/data/instructions.json';
import casesYear from '@/data/cases/yearly.json';
import type { Course, Instruction, YearlyCases } from '@/types';

export interface SearchItem {
  href: string;
  label: string;
  context: string;
}

const courses = coursesData as unknown as Course[];
const instructions = instructionsData as unknown as Instruction[];
const year = casesYear as YearlyCases;

export const searchIndex: SearchItem[] = [
  { href: '/', label: 'Главная', context: '' },
  { href: '/docs', label: 'Инструкции', context: '' },
  { href: '/faq', label: 'Популярные обращения', context: '' },
  { href: '/school', label: 'Школа', context: '' },
  { href: '/school/courses', label: 'Курсы', context: 'Школа' },
  ...year.months
    .filter((m) => !m.planned)
    .map((m) => ({
      href: `/faq/${m.month}`,
      label: `Обращения · ${m.monthLabel ?? `${m.label} ${year.year}`}`,
      context: 'Популярные обращения',
    })),
  ...instructions.map((ins) => ({
    href: `/docs/${ins.id}`,
    label: ins.title,
    context: 'Инструкции',
  })),
  ...courses.map((c) => ({
    href: `/school/courses/${c.id}`,
    label: c.title,
    context: 'Курсы',
  })),
];