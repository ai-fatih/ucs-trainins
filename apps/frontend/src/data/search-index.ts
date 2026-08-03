import coursesData from '@/data/school/courses.json';
import type { Course } from '@/types';

export interface SearchItem {
  href: string;
  label: string;
  context: string;
}

const courses = coursesData as unknown as Course[];

export const searchIndex: SearchItem[] = [
  { href: '/', label: 'Главная', context: '' },
  { href: '/docs', label: 'Документация', context: '' },
  { href: '/docs/rkeeper/rk7', label: 'r_keeper 7', context: 'Десктоп' },
  { href: '/docs/rkeeper/storehouse', label: 'StoreHouse Pro', context: 'Десктоп' },
  { href: '/docs/rkeeper/delivery', label: 'Delivery', context: 'Облачные сервисы' },
  { href: '/docs/rkeeper/event', label: 'Event', context: 'Облачные сервисы' },
  { href: '/docs/rkeeper/waiter', label: 'Waiter & Cash Desk', context: 'Мобильные' },
  { href: '/docs/cases', label: 'Кейсы месяца', context: 'Документация' },
  { href: '/school', label: 'Школа', context: '' },
  { href: '/school/courses', label: 'Курсы', context: 'Школа' },
  ...courses.map((c) => ({
    href: `/school/courses/${c.id}`,
    label: c.title,
    context: 'Курсы',
  })),
];
