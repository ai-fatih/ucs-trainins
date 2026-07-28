'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { LeaderboardEntry } from '@/types';
import { getArenaProgress, calcRank } from '@/lib/school/storage';
import configData from '@/data/school/config.json';
import LeaderboardTable from '@/components/school/LeaderboardTable';

const config = configData as unknown as { arena: { rankThresholds: { title: string; minXp: number; icon: string }[] } };

function getRankIcon(xp: number): string {
  const t = config.arena.rankThresholds;
  for (let i = t.length - 1; i >= 0; i--) {
    if (xp >= t[i].minXp) return t[i].icon;
  }
  return t[0].icon;
}

export default function LeaderboardPage() {
  const progress = getArenaProgress();
  const rank = calcRank(progress.xp, config.arena.rankThresholds);

  const companyLeader: LeaderboardEntry[] = [
    { name: 'Анна С.', xp: 580, streak: 7, rankIcon: getRankIcon(580) },
    { name: 'Фатихов Владислав', xp: progress.xp, streak: progress.streak, rankIcon: rank.icon, isYou: true },
    { name: 'Иван П.', xp: 200, streak: 1, rankIcon: getRankIcon(200) },
    { name: 'Ольга В.', xp: 50, streak: 0, rankIcon: getRankIcon(50) },
  ].sort((a, b) => b.xp - a.xp);

  const overallLeader: LeaderboardEntry[] = [
    { name: 'Максим Л.', xp: 5200, streak: 30, rankIcon: getRankIcon(5200) },
    { name: 'Елена Р.', xp: 3400, streak: 21, rankIcon: getRankIcon(3400) },
    { name: 'Дмитрий К.', xp: 2100, streak: 15, rankIcon: getRankIcon(2100) },
    { name: 'Анна С.', xp: 580, streak: 7, rankIcon: getRankIcon(580) },
    { name: 'Фатихов Владислав', xp: progress.xp, streak: progress.streak, rankIcon: rank.icon, isYou: true },
    { name: 'Иван П.', xp: 200, streak: 1, rankIcon: getRankIcon(200) },
    { name: 'Ольга В.', xp: 50, streak: 0, rankIcon: getRankIcon(50) },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link href="/school" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> На главную
      </Link>

      <h1 className="text-2xl font-bold mb-2">Рейтинг</h1>
      <p className="text-sm text-[#6b7280] mb-6">Соревнуйся с коллегами и зарабатывай XP</p>

      <div className="glass-card p-5 mb-6 text-center">
        <div className="text-3xl mb-1">{rank.icon}</div>
        <div className="text-lg font-bold">{rank.title}</div>
        <div className="text-sm text-[#6b7280]">{progress.xp} XP</div>
        <div className="text-xs text-[#9ca3af] mt-1">Стрейн: {progress.streak} дн. | Сессий: {progress.sessionsPlayed}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <LeaderboardTable title="В КОМПАНИИ" entries={companyLeader} />
        <LeaderboardTable title="ОБЩИЙ РЕЙТИНГ" entries={overallLeader} maxDisplay={10} />
      </div>
    </div>
  );
}