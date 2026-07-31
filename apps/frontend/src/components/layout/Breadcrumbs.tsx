'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import navConfig from '@/data/navigation.json';

type NavConfigType = {
  routeLabels: Record<string, string>;
  skipSegments: string[];
};

const config = navConfig as unknown as NavConfigType;
const LABEL_MAP = config.routeLabels;
const SKIP_SEGMENTS = new Set<string>(config.skipSegments);

function segmentLabel(segment: string): string {
  return LABEL_MAP[segment] ?? segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { href: string; label: string }[] = [{ href: '/', label: 'Главная' }];
  let acc = '';

  for (const seg of segments) {
    acc += `/${seg}`;
    if (SKIP_SEGMENTS.has(seg)) continue;
    crumbs.push({ href: acc, label: segmentLabel(seg) });
  }

  if (crumbs.length === 0) return null;

  return (
    <nav className="px-4 py-2.5 text-sm text-[#6b7280]" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {crumbs.map((cr, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={cr.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#9ca3af]" />}
              {last ? (
                <span className="font-semibold text-[#374151]">{cr.label}</span>
              ) : (
                <Link
                  href={cr.href}
                  className="no-underline text-[#6b7280] hover:text-[#1a56db] transition-colors"
                >
                  {cr.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}