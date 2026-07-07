'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
}

export function PrefetchLink({ href, children, className, onMouseEnter, ...props }: PrefetchLinkProps) {
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch(href);
    onMouseEnter?.();
  };

  return (
    <Link href={href} className={className} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </Link>
  );
}
