'use client';
import React from 'react';
import type { ArenaRoundType, ArenaRoundConfig } from '@/types';
import { Brain, Zap, Puzzle, ListOrdered } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Zap, Puzzle, ListOrdered,
};

interface Props {
  options: { type: ArenaRoundType; config: ArenaRoundConfig }[];
  onPick: (type: ArenaRoundType) => void;
}

export default function RoundPicker({ options, onPick }: Props) {
  return (
    <div className="glass-card p-6 text-center">
      <p className="text-sm text-[#6b7280] mb-4">Выберите следующий раунд:</p>
      <div className="flex gap-3 justify-center">
        {options.map((opt) => {
          const Icon = ICON_MAP[opt.config.icon] || Brain;
          return (
            <button
              key={opt.type}
              onClick={() => onPick(opt.type)}
              className="glass-btn flex-col px-6 py-4 gap-2 min-w-[140px]"
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{opt.config.title}</span>
              <span className="text-xs text-[#6b7280]">макс {opt.config.maxScore}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
