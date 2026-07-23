'use client';
import React, { useState } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<AvatarSize, { classes: string; px: number }> = {
  sm: { classes: 'w-8 h-8 text-xs', px: 32 },
  md: { classes: 'w-16 h-16 text-xl', px: 64 },
  lg: { classes: 'w-32 h-32 text-4xl', px: 128 },
};

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  bg?: string;
  color?: string;
  className?: string;
}

export function Avatar({ src, name, size = 'md', bg = '#e8effa', color = '#1a56db', className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const showImage = src && !imgError;
  const { classes, px } = sizeMap[size];

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden border-2 border-[#e8effa] ${classes} ${className}`}
      style={showImage ? undefined : { backgroundColor: bg, color }}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          width={px}
          height={px}
          fetchPriority="high"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}
