import navConfig from '@/data/navigation.json';
import casesYear from '@/data/cases/yearly.json';
import type { YearlyCases } from '@/types';

type NavConfigType = {
  routeLabels: Record<string, string>;
  skipSegments: string[];
  hiddenSegments?: string[];
};

const config = navConfig as unknown as NavConfigType;
const LABEL_MAP = config.routeLabels;
const SKIP_SEGMENTS = new Set<string>(config.skipSegments);
const HIDDEN_SEGMENTS = new Set<string>(config.hiddenSegments ?? []);
const year = casesYear as YearlyCases;

function segmentLabel(segment: string): string {
  const known = LABEL_MAP[segment];
  if (known) return known;
  if (/^\d{4}-\d{2}$/.test(segment)) {
    const month = year.months.find((m) => m.month === segment);
    if (month) return month.monthLabel ?? month.label;
  }
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function BreadcrumbsJsonLd({ pathname }: { pathname: string }) {
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  const items: { name: string; item: string }[] = [
    { name: 'Главная', item: 'https://ucs-service.vercel.app' },
  ];
  let acc = '';

  for (const seg of segments) {
    acc += `/${seg}`;
    if (SKIP_SEGMENTS.has(seg) || HIDDEN_SEGMENTS.has(seg)) continue;
    items.push({ name: segmentLabel(seg), item: `https://ucs-service.vercel.app${acc}` });
  }

  if (items.length < 2) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: i < items.length - 1 ? item.item : undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
