'use client';
import React from 'react';

interface StarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (val: number) => void;
}

export function Stars({ rating, size = 'sm', interactive, onChange }: StarsProps) {
  const sizeClass = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-sm';
  return (
    <div className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i)}
          className={`${sizeClass} ${interactive ? 'cursor-pointer' : 'cursor-default'} bg-none border-none p-0 leading-none transition-colors ${
            i <= rating ? 'text-[#f59e0b]' : 'text-[#d1d5db]'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
