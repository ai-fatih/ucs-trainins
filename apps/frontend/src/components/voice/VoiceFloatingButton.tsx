'use client';

import { Mic } from 'lucide-react';
import { useVoiceStore } from '@/stores/voice';

export function VoiceFloatingButton() {
  const { openModal } = useVoiceStore();

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={openModal}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        aria-label="Голосовой помощник"
      >
        <Mic className="w-6 h-6" />
      </button>
    </div>
  );
}
