export interface QualitySurveyRecord {
  id: string;
  bookingId: string;
  specialistName: string;
  answers: Record<string, number>;
  comment: string;
  date: string;
}

const SURVEYS_KEY = 'quality_surveys';

export function listSurveys(): QualitySurveyRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SURVEYS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveSurvey(survey: Omit<QualitySurveyRecord, 'id' | 'date'>): QualitySurveyRecord {
  const record: QualitySurveyRecord = {
    ...survey,
    id: `survey${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    date: new Date().toISOString(),
  };
  try {
    const all = listSurveys();
    all.unshift(record);
    localStorage.setItem(SURVEYS_KEY, JSON.stringify(all));
  } catch {}
  return record;
}
