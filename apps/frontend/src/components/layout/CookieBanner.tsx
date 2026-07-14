'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'ucs_cookie_consent';

type ConsentChoice = 'accepted' | 'rejected' | null;

export function CookieBanner() {
  const [choice, setChoice] = useState<ConsentChoice>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentChoice | null;
    if (!stored) {
      setVisible(true);
    } else {
      setChoice(stored);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setChoice('accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setChoice('rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="rounded-xl bg-white border border-[#e5e7eb] shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-5 h-5 text-[#1a56db] mt-0.5 shrink-0" />
            <div className="text-sm text-[#374151]">
              <p>
                Мы используем файлы cookie (файлы идентификации пользователей) для обеспечения
                работы сайта, сбора статистики посещений и улучшения качества услуг.
                Продолжая использование сайта, вы соглашаетесь с условиями
                {' '}<Link href="/privacy" className="text-[#1a56db] underline">Политики конфиденциальности</Link>.
              </p>
              <p className="text-xs text-[#6b7280] mt-1">
                Вы можете отказаться от необязательных cookie. Технические cookie необходимы
                для работы сайта и не требуют отдельного согласия.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm font-medium text-[#374151] bg-[#f3f4f6] hover:bg-[#e5e7eb] rounded-lg transition-colors border-none cursor-pointer"
            >
              Только необходимые
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1a56db] hover:bg-[#1a4fbf] rounded-lg transition-colors border-none cursor-pointer"
            >
              Принять все
            </button>
            <button
              onClick={handleReject}
              className="p-2 text-[#9ca3af] hover:text-[#374151] transition-colors border-none cursor-pointer bg-transparent"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
