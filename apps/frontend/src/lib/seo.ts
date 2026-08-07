import type { OpenGraphMetadata } from 'next';

export const SITE_URL = 'https://ucs-service.vercel.app';
export const SITE_NAME = 'UCS Service';

export const SITE_DESCRIPTION =
  'Открытый портал: инструкции, тренажёры и курсы по rkeeper. Консультируем и обучаем сотрудников по работе с пользовательской частью rkeeper.';

export const SITE_KEYWORDS = [
  'rkeeper',
  'обучение rkeeper',
  'инструкции rkeeper',
  'документация rkeeper',
  'тренажёры rkeeper',
  'курсы rkeeper',
  'обучение кассиров',
  'UCS Service',
];

export const OG_IMAGE = {
  url: `${SITE_URL}/images/og-default.png`,
  width: 1200,
  height: 630,
  alt: 'UCS Service — обучение и документация по rkeeper',
};

export function buildOpenGraph({
  title,
  description,
  url,
  type = 'website',
}: {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
}): OpenGraphMetadata {
  return {
    title,
    description,
    url,
    type,
    siteName: SITE_NAME,
    locale: 'ru_RU',
    images: [OG_IMAGE],
  };
}
