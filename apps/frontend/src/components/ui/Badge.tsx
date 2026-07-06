import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gray';
  className?: string;
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  const variants: Record<string, string> = {
    success: 'bg-[#d1fae5] text-[#059669]',
    warning: 'bg-[#fef3c7] text-[#d97706]',
    danger: 'bg-[#fee2e2] text-[#dc2626]',
    info: 'bg-[#dbeafe] text-[#0284c7]',
    gray: 'bg-[#f3f4f6] text-[#6b7280]',
  };
  return <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>{children}</span>;
}
