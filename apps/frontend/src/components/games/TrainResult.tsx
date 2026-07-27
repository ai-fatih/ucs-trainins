'use client';
import React from 'react';
import type { TrainProgress } from '@/types';
import { getTrainProgress, saveTrainProgress } from '@/lib/games/storage';
import { Wrench, RefreshCw } from 'lucide-react';

interface Props {
  casesSolved: number;
  totalCases: number;
  onRestart: () => void;
}

export default function TrainResult({ casesSolved, totalCases, onRestart }: Props) {
  const prev = getTrainProgress();
  const newSolved = prev.casesSolved + casesSolved;
  const newLevel = Math.floor(newSolved / 5) + 1;
  const leveledUp = newLevel > prev.level;
  const nextAt = newLevel * 5;

  saveTrainProgress({
    casesSolved: newSolved,
    level: newLevel,
    sessionsCompleted: prev.sessionsCompleted + 1,
  });

  return (
    <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
      <div className="glass-card p-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#059669] inline-flex items-center justify-center text-white mb-4">
          <Wrench className="w-8 h-8" />
        </div>
        {leveledUp && <p className="text-sm text-[#f59e06] font-semibold mb-1">Новый уровень!</p>}
        <h2 className="text-xl font-bold mb-1">Смена завершена</h2>
        <p className="text-sm text-[#6b7280] mb-4">Решено кейсов: {casesSolved} / {totalCases}</p>
        <div className="mb-6">
          <div className="text-sm text-[#6b7280]">Уровень {newLevel}</div>
          <div className="text-xs text-[#9ca3af]">до следующего: {newSolved}/{nextAt}</div>
          <div className="w-full max-w-xs mx-auto h-2 rounded-full bg-[#e5e7eb] mt-1">
            <div className="h-2 rounded-full bg-gradient-to-r from-[#0d9488] to-[#059669]" style={{ width: `${(newSolved % 5) / 5 * 100}%` }} />
          </div>
        </div>
        <button onClick={onRestart} className="glass-btn">
          <RefreshCw className="w-4 h-4" /> Новая смена
        </button>
      </div>
    </div>
  );
}
