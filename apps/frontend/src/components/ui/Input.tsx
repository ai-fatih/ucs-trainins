import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className, ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>}
      <input
        className={cn(
          'w-full px-3.5 py-2.5 text-sm border border-[#d1d5db] rounded-md outline-none transition-all duration-150 bg-white text-[#111827]',
          'focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)]',
          error && 'border-[#dc2626]',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-[#9ca3af] mt-1">{hint}</p>}
      {error && <p className="text-xs text-[#dc2626] mt-1">{error}</p>}
    </div>
  );
}

export function Textarea({ label, hint, error, className, ...props }: InputProps & { rows?: number }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>}
      <textarea
        className={cn(
          'w-full px-3.5 py-2.5 text-sm border border-[#d1d5db] rounded-md outline-none transition-all duration-150 bg-white text-[#111827] resize-y',
          'focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)]',
          error && 'border-[#dc2626]',
          className
        )}
        {...(props as any)}
      />
      {hint && !error && <p className="text-xs text-[#9ca3af] mt-1">{hint}</p>}
      {error && <p className="text-xs text-[#dc2626] mt-1">{error}</p>}
    </div>
  );
}
