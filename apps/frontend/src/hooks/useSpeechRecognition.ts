'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface SpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

interface SpeechRecognitionHook {
  isSupported: boolean;
  isListening: boolean;
  start: () => void;
  stop: () => void;
}

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isSupported = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  const createRecognition = useCallback(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = options.lang || 'ru-RU';
    recognition.continuous = options.continuous ?? false;
    recognition.interimResults = options.interimResults ?? true;

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      const isFinal = result.isFinal;
      options.onResult?.(text, isFinal);
    };

    recognition.onerror = (event: any) => {
      options.onError?.(event.error || 'unknown');
    };

    recognition.onend = () => {
      setIsListening(false);
      options.onEnd?.();
    };

    return recognition;
  }, [options.lang, options.continuous, options.interimResults, options.onResult, options.onEnd, options.onError]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const start = useCallback(() => {
    if (!isSupported) return;
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    const recognition = createRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isSupported, createRecognition]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  return { isSupported, isListening, start, stop };
}
