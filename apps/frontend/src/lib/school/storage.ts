import type { ArenaProgress, TrainProgress, RankThreshold, SchoolStats, CourseProgress, Badge, Certificate } from '@/types';
import coursesData from '@/data/school/courses.json';
import badgesData from '@/data/school/badges.json';
import certificatesData from '@/data/school/certificates.json';

const ARENA_KEY = 'games_arena_progress';
const TRAIN_KEY = 'games_train_progress';
const SCHOOL_STATS_KEY = 'school_stats';
const COURSE_PROGRESS_KEY = 'school_course_progress';
const BADGES_EARNED_KEY = 'school_badges_earned';
const CERTIFICATES_EARNED_KEY = 'school_certificates_earned';

export function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getArenaProgress(): ArenaProgress {
  const defaults: ArenaProgress = { xp: 0, bestScore: 0, sessionsPlayed: 0, dailyDate: '', dailySessions: 0, streak: 0 };
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(ARENA_KEY);
    return { ...defaults, ...(raw ? JSON.parse(raw) : {}) };
  } catch {}
  return defaults;
}

export function getRemainingSessions(maxPerDay: number): { remaining: number; streak: number } {
  const p = getArenaProgress();
  const today = getTodayDate();
  if (p.dailyDate !== today) return { remaining: maxPerDay, streak: p.streak };
  return { remaining: Math.max(0, maxPerDay - p.dailySessions), streak: p.streak };
}

export function recordSessionEnd(score: number, maxPerDay: number): ArenaProgress {
  const p = getArenaProgress();
  const today = getTodayDate();
  const isNewDay = p.dailyDate !== today;
  const newDailySessions = isNewDay ? 1 : p.dailySessions + 1;
  const newStreak = isNewDay ? (wasYesterday(p.dailyDate, today) ? p.streak + 1 : 1) : p.streak;
  const updated: ArenaProgress = {
    ...p, xp: p.xp + score, bestScore: Math.max(p.bestScore, score),
    sessionsPlayed: p.sessionsPlayed + 1, dailyDate: today,
    dailySessions: newDailySessions, streak: newStreak,
  };
  saveArenaProgress(updated);
  return updated;
}

function wasYesterday(lastDate: string, today: string): boolean {
  if (!lastDate) return false;
  const d = new Date(lastDate);
  const t = new Date(today);
  const diff = (t.getTime() - d.getTime()) / 86400000;
  return diff >= 0.9 && diff < 1.9;
}

export function saveArenaProgress(p: ArenaProgress) {
  try { localStorage.setItem(ARENA_KEY, JSON.stringify(p)); } catch {}
}

export function getTrainProgress(): TrainProgress {
  const defaults: TrainProgress = { casesSolved: 0, level: 1, sessionsCompleted: 0 };
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(TRAIN_KEY);
    return { ...defaults, ...(raw ? JSON.parse(raw) : {}) };
  } catch {}
  return defaults;
}

export function saveTrainProgress(p: TrainProgress) {
  try { localStorage.setItem(TRAIN_KEY, JSON.stringify(p)); } catch {}
}

export function calcRank(xp: number, thresholds: RankThreshold[]) {
  let rank = thresholds[0];
  for (const t of thresholds) {
    if (xp >= t.minXp) rank = t;
  }
  return rank;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom<T>(arr: T[], count: number, exclude?: T): T[] {
  const filtered = exclude ? arr.filter(x => x !== exclude) : [...arr];
  return shuffle(filtered).slice(0, count);
}

/* ===== School Progress API ===== */

export function getSchoolStats(): SchoolStats {
  const defaults: SchoolStats = {
    totalXp: 0, totalLessonsCompleted: 0, totalCoursesCompleted: 0,
    currentStreak: 0, badgesEarned: [], certificatesEarned: [],
    rankPosition: 0, level: 1,
  };
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(SCHOOL_STATS_KEY);
    return { ...defaults, ...(raw ? JSON.parse(raw) : {}) };
  } catch {}
  return defaults;
}

export function saveSchoolStats(s: SchoolStats) {
  try { localStorage.setItem(SCHOOL_STATS_KEY, JSON.stringify(s)); } catch {}
}

export function getCourseProgress(courseId: string): CourseProgress {
  const defaults: CourseProgress = { courseId, completedLessons: [], totalScore: 0, startedAt: '', completedAt: null };
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(COURSE_PROGRESS_KEY);
    const all: Record<string, CourseProgress> = raw ? JSON.parse(raw) : {};
    return { ...defaults, ...(all[courseId] || {}) };
  } catch {}
  return defaults;
}

export function saveCourseProgress(courseId: string, lessonId: string, score: number): CourseProgress {
  const prev = getCourseProgress(courseId);
  const now = new Date().toISOString();
  const completed = prev.completedLessons.includes(lessonId)
    ? prev.completedLessons
    : [...prev.completedLessons, lessonId];
  const updated: CourseProgress = {
    ...prev,
    completedLessons: completed,
    totalScore: prev.totalScore + score,
    startedAt: prev.startedAt || now,
    completedAt: null,
  };
  try {
    const raw = localStorage.getItem(COURSE_PROGRESS_KEY);
    const all: Record<string, CourseProgress> = raw ? JSON.parse(raw) : {};
    all[courseId] = updated;
    localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(all));
  } catch {}
  return updated;
}

export function getAllCourseProgress(): Record<string, CourseProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(COURSE_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function getEarnedBadges(): Badge[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BADGES_EARNED_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    const all = badgesData as unknown as Badge[];
    return all.filter(b => ids.includes(b.id));
  } catch { return []; }
}

export function getEarnedBadgeIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BADGES_EARNED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveBadgeEarned(badgeId: string) {
  try {
    const raw = localStorage.getItem(BADGES_EARNED_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (!ids.includes(badgeId)) {
      ids.push(badgeId);
      localStorage.setItem(BADGES_EARNED_KEY, JSON.stringify(ids));
    }
  } catch {}
}

export function getEarnedCertificates(): Certificate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CERTIFICATES_EARNED_KEY);
    const earned: string[] = raw ? JSON.parse(raw) : [];
    const all = certificatesData as unknown as Certificate[];
    return all.filter(c => earned.includes(c.id));
  } catch { return []; }
}

export function saveCertificateEarned(certId: string) {
  try {
    const raw = localStorage.getItem(CERTIFICATES_EARNED_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (!ids.includes(certId)) {
      ids.push(certId);
      localStorage.setItem(CERTIFICATES_EARNED_KEY, JSON.stringify(ids));
    }
  } catch {}
}

export function checkAndAwardBadges(stats: SchoolStats, courseProgress: Record<string, CourseProgress>): Badge[] {
  const newBadges: Badge[] = [];
  const earnedIds = getEarnedBadgeIds();
  const allBadges = badgesData as unknown as Badge[];
  const courses = coursesData as unknown as Array<{ id: string; modules: Array<{ lessons: Array<{ id: string }> }> }>;

  const allLessonIds = courses.flatMap(c => c.modules.flatMap(m => m.lessons.map(l => l.id)));
  const completedAll = allLessonIds.length > 0 && allLessonIds.every(lid =>
    Object.values(courseProgress).some(cp => cp.completedLessons.includes(lid))
  );
  const completedAllCaseLessons = ['err-8004', 'err-dish-not-visible', 'rk7-dish-invisible'].every(lid =>
    Object.values(courseProgress).some(cp => cp.completedLessons.includes(lid))
  );
  const completedAllChainLessons = ['rk7-open-shift', 'egais-invoice', 'egais-inventory', 'err-gtin'].every(lid =>
    Object.values(courseProgress).some(cp => cp.completedLessons.includes(lid))
  );

  allBadges.forEach(b => {
    if (earnedIds.includes(b.id)) return;
    let earned = false;
    if (b.id === 'first-lesson') earned = stats.totalLessonsCompleted >= 1;
    else if (b.id === 'five-lessons') earned = stats.totalLessonsCompleted >= 5;
    else if (b.id === 'ten-lessons') earned = stats.totalLessonsCompleted >= 10;
    else if (b.id === 'all-lessons') earned = completedAll;
    else if (b.id === 'first-course') earned = stats.totalCoursesCompleted >= 1;
    else if (b.id === 'all-courses') earned = stats.totalCoursesCompleted >= Object.keys(courses).length;
    else if (b.id === 'xp-500') earned = stats.totalXp >= 500;
    else if (b.id === 'xp-1000') earned = stats.totalXp >= 1000;
    else if (b.id === 'streak-3') earned = stats.currentStreak >= 3;
    else if (b.id === 'streak-7') earned = stats.currentStreak >= 7;
    else if (b.id === 'case-master') earned = completedAllCaseLessons;
    else if (b.id === 'chain-master') earned = completedAllChainLessons;

    if (earned) {
      saveBadgeEarned(b.id);
      newBadges.push(b);
    }
  });
  return newBadges;
}

export function checkAndAwardCertificates(courseProgress: Record<string, CourseProgress>): Certificate[] {
  const newCerts: Certificate[] = [];
  const earnedIds: string[] = (() => {
    try {
      const raw = localStorage.getItem(CERTIFICATES_EARNED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  })();
  const courses = coursesData as unknown as Array<{ id: string; title: string; modules: Array<{ lessons: Array<{ id: string }> }> }>;
  const allCerts = certificatesData as unknown as Certificate[];

  courses.forEach(course => {
    const progress = courseProgress[course.id];
    if (!progress) return;
    const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
    if (progress.completedLessons.length >= totalLessons) {
      const cert = allCerts.find(c => c.courseName === course.title);
      if (cert && !earnedIds.includes(cert.id)) {
        const updated = { ...cert, issuedAt: new Date().toISOString() };
        saveCertificateEarned(cert.id);
        newCerts.push(updated);
      }
    }
  });
  return newCerts;
}