'use client';
import React from 'react';
import type { RoundResult, RankThreshold } from '@/types';
import { getArenaProgress, recordSessionEnd, calcRank } from '@/lib/games/storage';
import { Swords, RefreshCw } from 'lucide-react';

interface Props {
  results: RoundResult[];
  xpGained: number;
  onRestart: () => void;
  thresholds: RankThreshold[];
  sessionsPerDay: number;
}

export default function ArenaResult({ results, xpGained, onRestart, thresholds, sessionsPerDay }: Props) {
  const total = xpGained;
  const prev = getArenaProgress();
  const { xp: savedXp } = recordSessionEnd(xpGained, sessionsPerDay);
  const rank = calcRank(savedXp, thresholds);
  const prevRank = calcRank(prev.xp, thresholds);
  const rankedUp = rank.title !== prevRank.title;

  return (
    <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
      <div className="glass-card p-8">
        <div className="text-4xl mb-2">{rank.icon}</div>
        {rankedUp && <p className="text-sm text-[#f59e06] font-semibold mb-1">Повышение дивизиона!</p>}
        <h2 className="text-xl font-bold mb-1">{rank.title}</h2>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="text-3xl font-bold text-[#1a56db]">{total}</div>
          <div className="text-sm text-[#6b7280]">
            очков<br/>+{xpGained} XP
          </div>
        </div>
        <div className="space-y-2 mb-6 text-left">
          {results.map((r, i) => (
            <div key={i} className="flex justify-between p-3 rounded-lg bg-[#f9fafb] text-sm">
              <span className="text-[#6b7280]">{r.label}</span>
              <span className="font-semibold text-[#1a56db]">{r.score}/{r.maxScore}</span>
            </div>
          ))}
        </div>
        <button onClick={onRestart} className="glass-btn">
          <RefreshCw className="w-4 h-4" /> Ещё матч
        </button>
      </div>
    </div>
  );
}
