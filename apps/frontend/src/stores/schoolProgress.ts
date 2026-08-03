'use client';
import { create } from 'zustand';

export const STORAGE_KEY = 'ucs_school_progress';

export interface SchoolProgressState {
  completed: Record<string, boolean>;
  hydrate: (record: Record<string, boolean>) => void;
  complete: (lessonId: string) => void;
  reset: (lessonIds: string[]) => void;
}

export const useSchoolProgress = create<SchoolProgressState>((set) => ({
  completed: {},
  hydrate: (record) => set({ completed: record }),
  complete: (lessonId) =>
    set((s) => {
      if (s.completed[lessonId]) return s;
      return { completed: { ...s.completed, [lessonId]: true } };
    }),
  reset: (lessonIds) =>
    set((s) => {
      const next = { ...s.completed };
      lessonIds.forEach((id) => {
        delete next[id];
      });
      return { completed: next };
    }),
}));