'use client';

import dynamic from 'next/dynamic';

export const ClientHeader = dynamic(
  () => import('./Header').then((mod) => mod.Header),
  { ssr: false }
);

export const ClientFooter = dynamic(
  () => import('./Footer').then((mod) => mod.Footer),
  { ssr: false }
);
