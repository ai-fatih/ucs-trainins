'use client';
import { create } from 'zustand';

interface VoiceState {
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useVoiceStore = create<VoiceState>()((set) => ({
  modalOpen: false,
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}));
