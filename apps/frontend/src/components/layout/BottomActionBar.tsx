'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Phone, CalendarCheck } from 'lucide-react';
import { ChatWidget } from './ChatWidget';

export function BottomActionBar() {
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="relative max-w-[1440px] mx-auto px-3 pb-3 md:px-4 md:pb-4 flex justify-end items-end gap-2 md:gap-3 pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/booking')}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full glass-bottom-btn text-[#1a56db] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            title="Записаться"
          >
            <CalendarCheck className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <button
            onClick={() => window.open('tel:+74959214770', '_self')}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full glass-bottom-btn text-[#0d9488] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            title="Позвонить"
          >
            <Phone className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        <div className="relative">
          {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} />}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            title="Чат с поддержкой"
          >
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
            <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-[#dc2626] text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              1
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
