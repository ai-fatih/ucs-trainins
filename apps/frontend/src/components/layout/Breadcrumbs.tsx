'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
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

export function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { href: string; label: string }[] = [{ href: '/', label: 'Главная' }];
  let acc = '';

  for (const seg of segments) {
    acc += `/${seg}`;
    if (SKIP_SEGMENTS.has(seg) || HIDDEN_SEGMENTS.has(seg)) continue;
    crumbs.push({ href: acc, label: segmentLabel(seg) });
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 pt-3">
      <nav
        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 bg-white/70 backdrop-blur border border-white/40 shadow-sm"
        aria-label="Хлебные крошки"
      >
        <ol className="flex items-center gap-1 flex-wrap">
          {crumbs.map((cr, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={cr.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#9ca3af] shrink-0" />}
                {last ? (
                  <span
                    aria-current="page"
                    className="text-sm font-semibold text-[#111827] px-1.5 py-0.5"
                  >
                    {cr.label}
                  </span>
                ) : (
                  <Link
                    href={cr.href}
                    className="no-underline text-sm text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5 rounded-md px-1.5 py-0.5 transition-colors inline-flex items-center gap-1"
                  >
                    {i === 0 && <Home className="w-3.5 h-3.5 shrink-0" />}
                    {cr.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
