'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Award, ScrollText, Trophy, Swords, Zap } from 'lucide-react';
import type { Course, CourseProgress, SchoolStats, Badge, Certificate } from '@/types';
import coursesData from '@/data/school/courses.json';
import badgesData from '@/data/school/badges.json';
import { getSchoolStats, saveSchoolStats, getAllCourseProgress, getEarnedBadges, getEarnedBadgeIds, getEarnedCertificates, checkAndAwardBadges, checkAndAwardCertificates, getArenaProgress } from '@/lib/school/storage';
import DashboardHeader from '@/components/school/DashboardHeader';
import CourseCard from '@/components/school/CourseCard';
import { useHydrated } from '@/lib/hooks/useHydrated';


const courses = coursesData as unknown as Course[];
const allBadges = badgesData as unknown as Badge[];

export default function SchoolDashboard() {
  const hydrated = useHydrated();
  const [stats, setStats] = useState<SchoolStats>(getSchoolStats());
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({});
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [newCerts, setNewCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    const arenaProgress = getArenaProgress();
    const cp = getAllCourseProgress();
    setCourseProgress(cp);

    const totalLessons = Object.values(cp).reduce((s, p) => s + p.completedLessons.length, 0);
    const totalCourses = courses.filter(c => {
      const p = cp[c.id];
      if (!p) return false;
      return p.completedLessons.length >= c.modules.reduce((s2, m) => s2 + m.lessons.length, 0);
    }).length;

    const updatedStats: SchoolStats = {
      ...stats,
      totalXp: arenaProgress.xp,
      totalLessonsCompleted: totalLessons,
      totalCoursesCompleted: totalCourses,
      currentStreak: arenaProgress.streak,
      badgesEarned: getEarnedBadgeIds(),
      certificatesEarned: [],
      rankPosition: 0,
      level: Math.floor(arenaProgress.xp / 200) + 1,
    };
    setStats(updatedStats);
    saveSchoolStats(updatedStats);

    const newB = checkAndAwardBadges(updatedStats, cp);
    if (newB.length > 0) setNewBadges(newB);
    setEarnedBadges(getEarnedBadges());
    setEarnedBadgeIds(getEarnedBadgeIds());
    setCerts(getEarnedCertificates());

    const newC = checkAndAwardCertificates(cp);
    if (newC.length > 0) setNewCerts(newC);
  }, []);

  const activeCourses = courses.filter(c => {
    const p = courseProgress[c.id];
    if (!p) return true;
    const total = c.modules.reduce((s, m) => s + m.lessons.length, 0);
    return p.completedLessons.length < total;
  });

  const completedCourses = courses.filter(c => {
    const p = courseProgress[c.id];
    if (!p) return false;
    return p.completedLessons.length >= c.modules.reduce((s, m) => s + m.lessons.length, 0);
  });

  const memberAvatar = ['Анна С.', 'Иван П.', 'Ольга В.', 'Дмитрий К.', 'Елена Р.'];
  const leaderEntries = memberAvatar.map((name, i) => ({
    name,
    xp: Math.max(0, 5000 - i * 800 - Math.floor(Math.random() * 200)),
    streak: Math.max(0, 30 - i * 5),
    rankIcon: ['💎', '🥇', '🥇', '🥈', '🥈'][i] || '🥉',
    isYou: false,
  })).sort((a, b) => b.xp - a.xp);

  if (!hydrated) {
    return <div className="max-w-[1000px] mx-auto px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-32 bg-[#f3f4f6] rounded-xl" /><div className="h-48 bg-[#f3f4f6] rounded-xl" /></div></div>;
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-4 lg:gap-6">
        <div className="lg:col-span-3">
          {newBadges.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#fefce8] to-[#fef2f2] border border-[#fde68a] text-sm">
              <p className="font-semibold text-[#ca8a04] mb-1">🎉 Новые достижения!</p>
              {newBadges.map(b => <p key={b.id} className="text-[#6b7280]">{b.icon} {b.title} — {b.description}</p>)}
            </div>
          )}
          {newCerts.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#f0f4ff] to-[#ecfdf5] border border-[#bfdbfe] text-sm">
              <p className="font-semibold text-[#1a56db] mb-1">🎓 Новые сертификаты!</p>
              {newCerts.map(c => <p key={c.id} className="text-[#6b7280]">📜 {c.title}</p>)}
            </div>
          )}

          <DashboardHeader
            name="Фатихов Владислав"
            role="Обучающийся"
            xp={stats.totalXp}
            level={stats.level}
            streak={stats.currentStreak}
            lessonsCompleted={stats.totalLessonsCompleted}
            coursesCompleted={stats.totalCoursesCompleted}
            badgesCount={earnedBadges.length}
            certsCount={certs.length}
            rankPosition={stats.rankPosition}
          />

          {/* Активные курсы */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Мои курсы</h2>
              <Link href="/school/courses" className="text-xs text-[#1a56db] font-semibold flex items-center gap-1 hover:underline">
                Все курсы <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeCourses.slice(0, 4).map((course) => (
                <CourseCard key={course.id} course={course} progress={courseProgress[course.id]} />
              ))}
            </div>
          </div>

          {/* Рейтинг */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Рейтинг</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] font-semibold">демо</span>
              <Link href="/school/leaderboard" className="text-xs text-[#1a56db] font-semibold flex items-center gap-1 hover:underline">
                Полный рейтинг <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="glass-card p-5">
              <div className="space-y-1">
                {leaderEntries.slice(0, 5).map((e, i) => (
                  <div key={e.name} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${e.isYou ? 'bg-[#e8effa]' : ''}`}>
                    <span className={`w-5 text-xs font-bold ${i === 0 ? 'text-[#ca8a04]' : i === 1 ? 'text-[#6b7280]' : i === 2 ? 'text-[#cd7f32]' : 'text-[#9ca3af]'}`}>{i + 1}</span>
                    <span>{e.rankIcon}</span>
                    <span className="flex-1">{e.name}</span>
                    <span className="text-[#6b7280]">{e.xp} XP</span>
                    {e.streak > 0 && <span className="text-[10px] text-[#f59e06]">🔥{e.streak}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 mt-6 lg:mt-0">
          <div className="sticky top-4">
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-[#6b7280] mb-3">Быстрый старт</h4>
              <div className="space-y-2">
                {activeCourses.slice(0, 3).map(c => {
                  const p = courseProgress[c.id];
                  const total = c.modules.reduce((s, m) => s + m.lessons.length, 0);
                  const done = p?.completedLessons.length || 0;
                    return (
                      <Link key={c.id} href={`/school/courses/${c.id}`} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f9fafb] text-xs hover:bg-[#f0f4ff] transition-all no-underline text-[#374151]">
                      <Swords className="w-3 h-3" style={{ color: c.colorFrom }} />
                      <span className="flex-1 truncate">{c.title}</span>
                      <span className="text-[#9ca3af]">{done}/{total}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}