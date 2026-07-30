'use client';
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatWidget } from './ChatWidget';
import { VoiceFloatingButton } from '@/components/voice/VoiceFloatingButton';
import { VoiceAssistantModal } from '@/components/voice/VoiceAssistantModal';

export function BottomActionBar() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 pointer-events-none">
        {chatOpen && (
          <div className="absolute bottom-full right-0 mb-2 pointer-events-auto">
            <ChatWidget onClose={() => setChatOpen(false)} />
          </div>
        )}

        <div className="rounded-2xl flex items-center gap-3 px-5 py-3 pointer-events-auto" style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.1), 0 8px 48px rgba(26,86,219,0.08)',
        }}>
          <button
            onClick={() => setChatOpen((p) => !p)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#6b7280] hover:text-[#1a56db] transition-all relative shrink-0"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}
            aria-label="Чат с поддержкой"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#dc2626] text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              1
            </span>
          </button>

          <VoiceFloatingButton />
        </div>
      </div>

      <VoiceAssistantModal />
    </>
  );
}
