import type { ArenaProgress, TrainProgress, RankThreshold } from '@/types';

const ARENA_KEY = 'games_arena_progress';
const TRAIN_KEY = 'games_train_progress';

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
    ...p,
    xp: p.xp + score,
    bestScore: Math.max(p.bestScore, score),
    sessionsPlayed: p.sessionsPlayed + 1,
    dailyDate: today,
    dailySessions: newDailySessions,
    streak: newStreak,
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
