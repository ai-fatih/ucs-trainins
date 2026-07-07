'use client';
import { create } from 'zustand';
import type { Service, Slot } from '@/types';

interface BookingState {
  step: number;
  selectedService: Service | null;
  selectedSlot: Slot | null;
  topic: string;
  selectedEmployee: string;
  setStep: (s: number) => void;
  selectService: (s: Service) => void;
  selectSlot: (s: Slot) => void;
  setTopic: (t: string) => void;
  setSelectedEmployee: (e: string) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  step: 0,
  selectedService: null,
  selectedSlot: null,
  topic: '',
  selectedEmployee: '',
  setStep: (step) => set({ step }),
  selectService: (s) => set({ selectedService: s, step: 1 }),
  selectSlot: (s) => set({ selectedSlot: s, step: 2 }),
  setTopic: (topic) => set({ topic }),
  setSelectedEmployee: (e) => set({ selectedEmployee: e }),
  reset: () =>
    set({
      step: 0,
      selectedService: null,
      selectedSlot: null,
      topic: '',
      selectedEmployee: '',
    }),
}));
