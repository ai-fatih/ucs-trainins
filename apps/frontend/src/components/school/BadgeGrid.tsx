'use client';
import React from 'react';
import type { Badge } from '@/types';

interface Props {
  badges: Badge[];
  earnedIds: string[];
}

export default function BadgeGrid({ badges, earnedIds }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {badges.map((badge) => {
        const earned = earnedIds.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={`glass-card p-4 text-center transition-all ${earned ? 'opacity-100' : 'opacity-40 grayscale'}`}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <h4 className="text-sm font-bold mb-1">{badge.title}</h4>
            <p className="text-[10px] text-[#6b7280]">{badge.description}</p>
            {!earned && <p className="text-[10px] text-[#9ca3af] mt-2">🔒 ещё не получен</p>}
          </div>
        );
      })}
    </div>
  );
}