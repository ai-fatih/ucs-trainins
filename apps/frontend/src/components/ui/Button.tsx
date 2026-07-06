'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-md font-semibold leading-none transition-all duration-150 no-underline whitespace-nowrap cursor-pointer border-none';
  const variants: Record<string, string> = {
    primary: 'bg-[#1a56db] text-white hover:bg-[#1648c0]',
    secondary: 'bg-white text-[#374151] border border-[#d1d5db] hover:bg-[#f9fafb]',
    danger: 'bg-[#dc2626] text-white hover:bg-[#b91c1c]',
    ghost: 'bg-transparent text-[#6b7280] hover:bg-[#f3f4f6]',
    success: 'bg-[#059669] text-white hover:bg-[#047857]',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], loading && 'opacity-60 pointer-events-none', className)} disabled={disabled || loading} {...props}>
      {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}
