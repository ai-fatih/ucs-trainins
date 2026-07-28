'use client';
import React from 'react';
import { BookOpen, Award, ScrollText, Trophy, Zap, Flame, GraduationCap } from 'lucide-react';

interface Props {
  name: string;
  role: string;
  xp: number;
  level: number;
  streak: number;
  lessonsCompleted: number;
  coursesCompleted: number;
  badgesCount: number;
  certsCount: number;
  rankPosition: number;
}

export default function DashboardHeader({ name, role, xp, level, streak, lessonsCompleted, coursesCompleted, badgesCount, certsCount, rankPosition }: Props) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white text-xl font-bold shadow-md">
              {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-sm text-[#6b7280] flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                {role}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#f0f4ff] text-[#1a56db] text-sm font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Уровень {level}
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#fefce8] text-[#ca8a04] text-sm font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {xp} XP
          </div>
          {streak > 0 && (
            <div className="px-4 py-2 rounded-xl bg-[#fef2f2] text-[#dc2626] text-sm font-semibold flex items-center gap-2">
              <Flame className="w-4 h-4" />
              {streak} дн.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-[#1a56db]">{lessonsCompleted}</div>
          <div className="text-xs text-[#6b7280] flex items-center justify-center gap-1 mt-1">
            <BookOpen className="w-3 h-3" /> уроков пройдено
          </div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-[#059669]">{coursesCompleted}</div>
          <div className="text-xs text-[#6b7280] flex items-center justify-center gap-1 mt-1">
            <BookOpen className="w-3 h-3" /> курсов завершено
          </div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-[#ca8a04]">{badgesCount}</div>
          <div className="text-xs text-[#6b7280] flex items-center justify-center gap-1 mt-1">
            <Award className="w-3 h-3" /> бейджей
          </div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-[#7c3aed]">{certsCount}</div>
          <div className="text-xs text-[#6b7280] flex items-center justify-center gap-1 mt-1">
            <ScrollText className="w-3 h-3" /> сертификатов
          </div>
        </div>
      </div>
    </div>
  );
}