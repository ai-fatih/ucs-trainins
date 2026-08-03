'use client';
import { useEffect } from 'react';
import { useSchoolProgress, STORAGE_KEY } from '@/stores/schoolProgress';

export function SchoolProgressBridge() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && typeof data === 'object') {
          useSchoolProgress.getState().hydrate(data as Record<string, boolean>);
        }
      }
    } catch {
      /* ignore corrupt data */
    }
  }, []);

  useEffect(() => {
    const unsubscribe = useSchoolProgress.subscribe((state, prev) => {
      if (state.completed !== prev.completed) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.completed));
        } catch {
          /* ignore quota errors */
        }
      }
    });
    return unsubscribe;
  }, []);

  return null;
}