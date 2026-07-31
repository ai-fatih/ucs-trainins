export interface TipRecord {
  id: string;
  bookingId: string;
  specialistName: string;
  amount: number;
  date: string;
}

const TIPS_KEY = 'tips_records';

export function listTips(): TipRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TIPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveTip(tip: Omit<TipRecord, 'id' | 'date'>): TipRecord {
  const record: TipRecord = {
    ...tip,
    id: `tip${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    date: new Date().toISOString(),
  };
  try {
    const all = listTips();
    all.unshift(record);
    localStorage.setItem(TIPS_KEY, JSON.stringify(all));
  } catch {}
  return record;
}
