'use client';

import { useState, useRef, useCallback } from 'react';

interface SpeechSynthesisHook {
  isSupported: boolean;
  speaking: boolean;
  speak: (text: string, options?: { rate?: number; onEnd?: () => void }) => void;
  cancel: () => void;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const cancel = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string, options?: { rate?: number; onEnd?: () => void }) => {
    if (!isSupported) {
      options?.onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = options?.rate ?? 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      options?.onEnd?.();
    };
    utterance.onerror = () => {
      setSpeaking(false);
      options?.onEnd?.();
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  return { isSupported, speaking, speak, cancel };
}
