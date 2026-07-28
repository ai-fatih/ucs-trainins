'use client';
import React from 'react';
import type { LeaderboardEntry } from '@/types';
import { Crown, Medal } from 'lucide-react';

interface Props {
  title: string;
  entries: LeaderboardEntry[];
  maxDisplay?: number;
}

export default function LeaderboardTable({ title, entries, maxDisplay = 10 }: Props) {
  const sorted = [...entries].sort((a, b) => b.xp - a.xp).slice(0, maxDisplay);
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-[#6b7280] mb-4">{title}</h3>
      <div className="space-y-1">
        {sorted.map((e, i) => {
          const medalIcon = i === 0 ? 'text-[#ca8a04]' : i === 1 ? 'text-[#6b7280]' : i === 2 ? 'text-[#cd7f32]' : 'text-[#9ca3af]';
          return (
            <div key={e.name} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${e.isYou ? 'bg-[#e8effa]' : 'hover:bg-[#f9fafb]'}`}>
              <span className={`w-6 text-xs font-bold ${medalIcon} flex items-center justify-center`}>
                {i === 0 ? <Crown className="w-4 h-4" /> : i === 1 ? <Medal className="w-4 h-4" /> : i + 1}
              </span>
              <span className="text-base">{e.rankIcon}</span>
              <span className={`flex-1 ${e.isYou ? 'font-semibold text-[#1a56db]' : ''}`}>{e.name}</span>
              <span className="text-[#6b7280] font-medium">{e.xp} XP</span>
              {e.streak > 0 && <span className="text-[10px] text-[#f59e06]">🔥{e.streak}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}