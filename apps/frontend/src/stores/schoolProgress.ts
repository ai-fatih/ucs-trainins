'use client';
import { create } from 'zustand';

export const STORAGE_KEY = 'ucs_school_progress';

export interface SchoolProgressState {
  completed: Record<string, boolean>;
  positions: Record<string, number>;
  hydrate: (record: Record<string, boolean>, positions?: Record<string, number>) => void;
  complete: (lessonId: string) => void;
  setPosition: (lessonId: string, step: number) => void;
  clearPosition: (lessonId: string) => void;
  reset: (lessonIds: string[]) => void;
}

export const useSchoolProgress = create<SchoolProgressState>((set) => ({
  completed: {},
  positions: {},
  hydrate: (record, positions) =>
    set({ completed: record, positions: positions ?? {} }),
  complete: (lessonId) =>
    set((s) => {
      const positions = { ...s.positions };
      delete positions[lessonId];
      if (s.completed[lessonId]) return { completed: s.completed, positions };
      return { completed: { ...s.completed, [lessonId]: true }, positions };
    }),
  setPosition: (lessonId, step) =>
    set((s) => {
      if (s.positions[lessonId] === step) return s;
      return { positions: { ...s.positions, [lessonId]: step } };
    }),
  clearPosition: (lessonId) =>
    set((s) => {
      if (!(lessonId in s.positions)) return s;
      const positions = { ...s.positions };
      delete positions[lessonId];
      return { positions };
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