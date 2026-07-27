'use client';
import React from 'react';
import Link from 'next/link';
import { Swords, Wrench, Zap, Trophy, ArrowRight } from 'lucide-react';
import type { GameConfig, RankThreshold } from '@/types';
import configData from '@/data/games-config.json';
import { getArenaProgress, getTrainProgress, getRemainingSessions, calcRank } from '@/lib/games/storage';

const config = configData as unknown as GameConfig;

interface LeaderEntry {
  name: string;
  xp: number;
  streak: number;
  isYou?: boolean;
}

const COMPANY_LEADER: LeaderEntry[] = [
  { name: 'Анна С.', xp: 580, streak: 7 },
  { name: 'Вы', xp: 0, streak: 0, isYou: true },
  { name: 'Иван П.', xp: 200, streak: 1 },
  { name: 'Ольга В.', xp: 50, streak: 0 },
];

const OVERALL_LEADER: LeaderEntry[] = [
  { name: 'Максим Л.', xp: 5200, streak: 30 },
  { name: 'Елена Р.', xp: 3400, streak: 21 },
  { name: 'Дмитрий К.', xp: 2100, streak: 15 },
  { name: 'Анна С.', xp: 580, streak: 7 },
  { name: 'Вы', xp: 0, streak: 0, isYou: true },
];

function getRankIcon(xp: number): string {
  const t = config.arena.rankThresholds;
  for (let i = t.length - 1; i >= 0; i--) {
    if (xp >= t[i].minXp) return t[i].icon;
  }
  return t[0].icon;
}

export default function GamesPage() {
  const arenaProgress = getArenaProgress();
  const trainProgress = getTrainProgress();
  const rank = calcRank(arenaProgress.xp, config.arena.rankThresholds);
  const { remaining } = getRemainingSessions(config.arena.sessionsPerDay);

  const nextRank: RankThreshold | undefined = config.arena.rankThresholds.find(t => t.minXp > arenaProgress.xp);
  const xpProgress = nextRank
    ? ((arenaProgress.xp - rank.minXp) / (nextRank.minXp - rank.minXp)) * 100
    : 100;

  const trainNextAt = trainProgress.level * 5;
  const trainProgressPct = (trainProgress.casesSolved % 5 / 5) * 100;

  const companyLeader = COMPANY_LEADER.map(e =>
    e.isYou ? { ...e, xp: arenaProgress.xp, streak: arenaProgress.streak } : e
  ).sort((a, b) => b.xp - a.xp);
  const overallLeader = OVERALL_LEADER.map(e =>
    e.isYou ? { ...e, xp: arenaProgress.xp, streak: arenaProgress.streak } : e
  ).sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="section-title text-3xl mb-2">Игры и тренажёры</h1>
        <p className="text-sm text-[#6b7280] mb-6">Обучающие игры по RK7, ЕГАИС и StoreHouse</p>
        <div className="flex flex-wrap justify-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-[#f0f4ff] text-[#1a56db]">
            Сегодня: <strong>{remaining}/{config.arena.sessionsPerDay}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#fefce8] text-[#ca8a04]">
            Стрейн: <strong>{arenaProgress.streak}</strong> дн.
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#ecfdf5] text-[#059669]">
            Всего XP: <strong>{arenaProgress.xp}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#f5f3ff] text-[#7c3aed]">
            Кейсов: <strong>{trainProgress.casesSolved}</strong>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Arena */}
        <div className="glass-card p-8 hover:shadow-lg transition-all flex flex-col">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f59e06] to-[#dc2626] inline-flex items-center justify-center text-white mb-4 mx-auto">
              <Swords className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Лига</h2>
          </div>

          <div className="flex-1 space-y-3 mb-6 text-center">
            <div>
              <span className="text-2xl">{rank.icon}</span>
              <div className="text-lg font-bold">{rank.title}</div>
            </div>
            <div className="flex justify-center gap-4 text-sm text-[#6b7280]">
              <span><strong className="text-[#1a56db]">{arenaProgress.xp}</strong> XP</span>
              <span>Рекорд: <strong>{arenaProgress.bestScore}</strong></span>
              <span>Стрейн: <strong>{arenaProgress.streak}</strong></span>
            </div>
            <div className={`text-xs ${remaining === 0 ? 'text-[#dc2626]' : 'text-[#059669]'}`}>
              Попыток: {remaining}/{config.arena.sessionsPerDay}
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#e5e7eb]">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-[#f59e06] to-[#dc2626] transition-all" style={{ width: `${Math.min(xpProgress, 100)}%` }} />
            </div>
            <div className="text-[10px] text-[#9ca3af]">
              {nextRank ? `до ${nextRank.icon} ${nextRank.title}` : 'Высший дивизион'}
            </div>
            <div className="text-[10px] text-[#9ca3af]">Матчей сыграно: {arenaProgress.sessionsPlayed}</div>
          </div>

          <Link href="/games/arena" className="w-full glass-btn justify-center text-base py-3">
            <Swords className="w-5 h-5" /> Играть <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Trainer */}
        <div className="glass-card p-8 hover:shadow-lg transition-all flex flex-col">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#059669] inline-flex items-center justify-center text-white mb-4 mx-auto">
              <Wrench className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Тренажёр</h2>
          </div>

          <div className="flex-1 space-y-3 mb-6 text-center">
            <div className="text-2xl">Уровень {trainProgress.level}</div>
            <div className="flex justify-center gap-4 text-sm text-[#6b7280]">
              <span><strong className="text-[#0d9488]">{trainProgress.casesSolved}</strong> кейсов</span>
              <span><strong>{trainProgress.sessionsCompleted}</strong> смен</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#e5e7eb]">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-[#0d9488] to-[#059669] transition-all" style={{ width: `${Math.min(trainProgressPct, 100)}%` }} />
            </div>
            <div className="text-[10px] text-[#9ca3af]">
              {trainProgress.casesSolved}/{trainNextAt} до уровня {trainProgress.level + 1}
            </div>
          </div>

          <Link href="/games/train" className="w-full glass-btn justify-center text-base py-3">
            <Wrench className="w-5 h-5" /> Тренироваться <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick start */}
      <div className="mt-10 text-center">
        <p className="text-xs font-semibold text-[#6b7280] mb-3">Быстрый старт</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/games/arena" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#f59e06] to-[#dc2626] text-white text-sm font-semibold hover:shadow-md transition-all">
            <Zap className="w-4 h-4" /> Матч в Лиге
          </Link>
          <Link href="/games/train" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#0d9488] to-[#059669] text-white text-sm font-semibold hover:shadow-md transition-all">
            <Trophy className="w-4 h-4" /> Смена в Тренажёре
          </Link>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mt-12">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-[#6b7280]">🏆 РЕЙТИНГ</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Company */}
          <div className="glass-card p-5">
            <p className="text-xs font-semibold text-[#6b7280] mb-3">В КОМПАНИИ</p>
            <div className="space-y-1">
              {companyLeader.map((e, i) => {
                const icon = getRankIcon(e.xp);
                const medal = i === 0 ? 'text-[#ca8a04]' : i === 1 ? 'text-[#6b7280]' : i === 2 ? 'text-[#cd7f32]' : 'text-[#9ca3af]';
                return (
                  <div key={e.name} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${e.isYou ? 'bg-[#e8effa]' : ''}`}>
                    <span className={`w-5 text-xs font-bold ${medal}`}>{i + 1}</span>
                    <span>{icon}</span>
                    <span className={`flex-1 ${e.isYou ? 'font-semibold text-[#1a56db]' : ''}`}>{e.name}</span>
                    <span className="text-[#6b7280]">{e.xp} XP</span>
                    {e.streak > 0 && <span className="text-[10px] text-[#f59e06]">🔥{e.streak}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall */}
          <div className="glass-card p-5">
            <p className="text-xs font-semibold text-[#6b7280] mb-3">ОБЩИЙ</p>
            <div className="space-y-1">
              {overallLeader.map((e, i) => {
                const icon = getRankIcon(e.xp);
                const medal = i === 0 ? 'text-[#ca8a04]' : i === 1 ? 'text-[#6b7280]' : i === 2 ? 'text-[#cd7f32]' : 'text-[#9ca3af]';
                return (
                  <div key={e.name} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${e.isYou ? 'bg-[#e8effa]' : ''}`}>
                    <span className={`w-5 text-xs font-bold ${medal}`}>{i + 1}</span>
                    <span>{icon}</span>
                    <span className={`flex-1 ${e.isYou ? 'font-semibold text-[#1a56db]' : ''}`}>{e.name}</span>
                    <span className="text-[#6b7280]">{e.xp} XP</span>
                    {e.streak > 0 && <span className="text-[10px] text-[#f59e06]">🔥{e.streak}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
