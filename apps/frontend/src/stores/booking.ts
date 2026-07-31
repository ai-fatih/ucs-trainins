'use client';
import { create } from 'zustand';
import type { Service, Slot, Specialist } from '@/types';

interface BookingState {
  step: number;
  selectedService: Service | null;
  selectedSpecialist: Specialist | null;
  selectedSlot: Slot | null;
  topic: string;
  selectedEmployee: string;
  setStep: (s: number) => void;
  selectService: (s: Service) => void;
  setSelectedSpecialist: (s: Specialist) => void;
  selectSpecialist: (s: Specialist) => void;
  selectSlot: (s: Slot) => void;
  setTopic: (t: string) => void;
  setSelectedEmployee: (e: string) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  step: 0,
  selectedService: null,
  selectedSpecialist: null,
  selectedSlot: null,
  topic: '',
  selectedEmployee: '',
  setStep: (step) => set({ step }),
  selectService: (s) => set({ selectedService: s, step: 1 }),
  setSelectedSpecialist: (s) => set({ selectedSpecialist: s, selectedSlot: null }),
  selectSpecialist: (s) => set({ selectedSpecialist: s, selectedSlot: null, step: 2 }),
  selectSlot: (s) => set({ selectedSlot: s, step: 3 }),
  setTopic: (topic) => set({ topic }),
  setSelectedEmployee: (e) => set({ selectedEmployee: e }),
  reset: () =>
    set({
      step: 0,
      selectedService: null,
      selectedSpecialist: null,
      selectedSlot: null,
      topic: '',
      selectedEmployee: '',
    }),
}));
