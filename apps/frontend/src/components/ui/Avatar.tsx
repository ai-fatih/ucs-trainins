'use client';
import React, { useState } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-16 h-16 text-xl',
  lg: 'w-32 h-32 text-4xl',
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

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden border-2 border-[#e8effa] ${sizeMap[size]} ${className}`}
      style={showImage ? undefined : { backgroundColor: bg, color }}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}
