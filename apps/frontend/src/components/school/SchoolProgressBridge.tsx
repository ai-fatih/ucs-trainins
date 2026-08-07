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
          if ('completed' in data && typeof data.completed === 'object' && data.completed !== null) {
            useSchoolProgress
              .getState()
              .hydrate(
                data.completed as Record<string, boolean>,
                data.positions && typeof data.positions === 'object'
                  ? (data.positions as Record<string, number>)
                  : undefined,
              );
          } else {
            useSchoolProgress.getState().hydrate(data as Record<string, boolean>);
          }
        }
      }
    } catch {
      /* ignore corrupt data */
    }
  }, []);

  useEffect(() => {
    const unsubscribe = useSchoolProgress.subscribe((state, prev) => {
      if (
        state.completed !== prev.completed ||
        state.positions !== prev.positions
      ) {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ completed: state.completed, positions: state.positions }),
          );
        } catch {
          /* ignore quota errors */
        }
      }
    });
    return unsubscribe;
  }, []);

  return null;
}