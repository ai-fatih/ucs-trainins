'use client';
import { usePathname } from 'next/navigation';
import { BreadcrumbsJsonLd as BreadcrumbsJsonLdInner } from './BreadcrumbsJsonLd';

export function BreadcrumbsJsonLdScript() {
  const pathname = usePathname();
  return <BreadcrumbsJsonLdInner pathname={pathname ?? '/'} />;
}
