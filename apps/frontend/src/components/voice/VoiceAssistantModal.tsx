'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  X, Mic, Volume2,
  CalendarCheck, GraduationCap, UserCircle, MessageCircle,
  FileText, Briefcase, Home, Bell, LayoutDashboard,
} from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useVoiceStore } from '@/stores/voice';
import { VOICE_COMMANDS, SYNONYM_MAP } from '@/data/voice-commands';
import type { VoiceCommand } from '@/data/voice-commands';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  CalendarCheck, GraduationCap, UserCircle, MessageCircle,
  FileText, Briefcase, Home, Bell, LayoutDashboard,
};

const SILENCE_TIMEOUT = 5000;

export function VoiceAssistantModal() {
  const { modalOpen, closeModal } = useVoiceStore();
  const [phase, setPhase] = useState<'idle' | 'listening' | 'confirming' | 'matched' | 'error'>('idle');
  const [transcript, setTranscript] = useState('');
  const [matchedCommand, setMatchedCommand] = useState<VoiceCommand | null>(null);
  const [spokenText, setSpokenText] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<VoiceCommand[]>([]);

  const silenceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const { speak, cancel: cancelSpeech } = useSpeechSynthesis();

  const clearSilenceTimeout = useCallback(() => {
    if (silenceRef.current) {
      clearTimeout(silenceRef.current);
      silenceRef.current = null;
    }
  }, []);

  const startSilenceTimeout = useCallback(() => {
    clearSilenceTimeout();
    silenceRef.current = setTimeout(() => {
      if (phaseRef.current === 'listening' || phaseRef.current === 'confirming') {
        setPhase('error');
        setTimeout(() => setPhase((p) => (p === 'error' ? 'idle' : p)), 2000);
      }
    }, SILENCE_TIMEOUT);
  }, [clearSilenceTimeout]);

  const respondWithCommand = useCallback((cmd: VoiceCommand) => {
    stopRef.current();
    cancelSpeechRef.current();
    clearSilenceTimeout();
    setTranscript('');
    setCandidates([]);
    setMatchedCommand(cmd);
    setSpokenText(cmd.shortDescription);
    setPhase('matched');

    speak(cmd.shortDescription, {
      onEnd: () => {
        if (phaseRef.current === 'matched') {
          setPhase('idle');
          setSpokenText(null);
        }
      },
    });
  }, [speak, clearSilenceTimeout]);

  const handleConfirm = useCallback((text: string) => {
    clearSilenceTimeout();
    const lower = text.toLowerCase().trim();

    const numMatch = lower.match(/(\d+)/);
    if (numMatch) {
      const idx = parseInt(numMatch[1]) - 1;
      if (idx >= 0 && idx < candidates.length) {
        respondWithCommand(candidates[idx]);
        return;
      }
    }
    const words = ['первый', 'второй', 'третий', 'четвертый', 'пятый'];
    for (let i = 0; i < words.length; i++) {
      if (lower.includes(words[i]) && i < candidates.length) {
        respondWithCommand(candidates[i]);
        return;
      }
    }
  }, [candidates, respondWithCommand, clearSilenceTimeout]);

  const handleCommand = useCallback((text: string) => {
    stopRef.current();
    clearSilenceTimeout();
    setTranscript('');
    const lower = text.toLowerCase().trim();

    const matchedPaths: string[] = [];
    for (const [synonym, path] of Object.entries(SYNONYM_MAP)) {
      if (lower.includes(synonym) && !matchedPaths.includes(path)) {
        matchedPaths.push(path);
      }
    }

    if (matchedPaths.length === 0) {
      setPhase('error');
      setTimeout(() => setPhase('idle'), 2000);
      return;
    }

    const cmds = matchedPaths
      .map((p) => VOICE_COMMANDS.find((c) => c.path === p))
      .filter((c): c is VoiceCommand => !!c);

    if (cmds.length === 1) {
      respondWithCommand(cmds[0]);
    } else {
      setCandidates(cmds);
      setMatchedCommand(null);
      setPhase('confirming');
      const options = cmds.map((c, i) => `${i + 1} — ${c.label}`).join(', ');
      speak(`Нашла несколько: ${options}. Скажите номер`, {
        onEnd: () => {
          startRef.current();
          startSilenceTimeout();
        },
      });
    }
  }, [speak, startSilenceTimeout, respondWithCommand, clearSilenceTimeout]);

  const handleListeningResult = useCallback(
    (text: string, isFinal: boolean) => {
      clearSilenceTimeout();
      if (isFinal) {
        if (phaseRef.current === 'confirming') {
          handleConfirm(text);
        } else {
          handleCommand(text);
        }
      } else {
        setTranscript(text);
        startSilenceTimeout();
      }
    },
    [handleCommand, handleConfirm, clearSilenceTimeout, startSilenceTimeout],
  );

  const handleError = useCallback(() => {
    clearSilenceTimeout();
    setTranscript('');
    setPhase('error');
    setTimeout(() => setPhase('idle'), 2000);
  }, [clearSilenceTimeout]);

  const { isSupported, isListening, start, stop } = useSpeechRecognition({
    lang: 'ru-RU',
    interimResults: true,
    onResult: handleListeningResult,
    onEnd: () => {
      clearSilenceTimeout();
      if (phaseRef.current === 'listening') {
        setPhase('idle');
      }
    },
    onError: handleError,
  });

  const startRef = useRef(start);
  startRef.current = start;
  const stopRef = useRef(stop);
  stopRef.current = stop;
  const cancelSpeechRef = useRef(cancelSpeech);
  cancelSpeechRef.current = cancelSpeech;
  const clearTimeoutRef = useRef(clearSilenceTimeout);
  clearTimeoutRef.current = clearSilenceTimeout;

  useEffect(() => {
    if (!modalOpen) return;

    setPhase('listening');
    setTranscript('');
    setMatchedCommand(null);
    setCandidates([]);
    setSpokenText(null);
    startRef.current();
    startSilenceTimeout();

    return () => {
      stopRef.current();
      cancelSpeechRef.current();
      clearTimeoutRef.current();
    };
  }, [modalOpen, startSilenceTimeout]);

  const handleChipClick = useCallback(
    (cmd: VoiceCommand) => {
      stopRef.current();
      cancelSpeechRef.current();
      clearTimeoutRef.current();
      respondWithCommand(cmd);
    },
    [respondWithCommand],
  );

  const handleCandidateClick = useCallback(
    (cmd: VoiceCommand) => {
      stopRef.current();
      cancelSpeechRef.current();
      clearTimeoutRef.current();
      respondWithCommand(cmd);
    },
    [respondWithCommand],
  );

  const handleMicToggle = useCallback(() => {
    if (phase === 'listening') {
      stopRef.current();
      cancelSpeechRef.current();
      clearTimeoutRef.current();
      setPhase('idle');
    } else if (phase === 'idle' || phase === 'error') {
      setPhase('listening');
      setTranscript('');
      startRef.current();
      startSilenceTimeout();
    }
  }, [phase, startSilenceTimeout]);

  const handleClose = useCallback(() => {
    stopRef.current();
    cancelSpeechRef.current();
    clearTimeoutRef.current();
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalOpen) handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, handleClose]);

  if (!modalOpen) return null;

  const listening = phase === 'listening' && isListening;

  const renderIcon = (iconName: string, className?: string) => {
    const Icon = ICON_MAP[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" onClick={handleClose} />

      <div className="relative pointer-events-auto mx-4 w-full max-w-[460px] fade-in-up">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow:
              '0 -4px 32px rgba(0,0,0,0.1), 0 8px 48px rgba(26,86,219,0.08)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${phase === 'matched' ? 'bg-[#22c55e]' : listening ? 'bg-[#dc2626] animate-pulse' : 'bg-[#22c55e]'}`}
              />
              <span className="text-sm font-semibold text-[#111827]">
                {phase === 'matched' ? 'Результат поиска' : 'Голосовой помощник'}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#dc2626] hover:bg-[#fee2e2] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-6 flex flex-col items-center gap-5 min-h-[260px]">
            {/* ── LISTENING ── */}
            {phase === 'listening' && (
              <div className="flex flex-col items-center gap-4 w-full flex-1 justify-center">
                <div className="flex items-end gap-[3px] h-10">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-gradient-to-t from-[#1a56db] to-[#0d9488] animate-waveform"
                      style={{
                        height: `${12 + i * 5}px`,
                        animationDelay: `${i * 0.12}s`,
                      }}
                    />
                  ))}
                </div>
                {transcript && (
                  <div
                    className="w-full"
                    style={{
                      background: 'rgba(243,244,246,0.8)',
                      borderRadius: '12px',
                      padding: '10px 16px',
                    }}
                  >
                    <p className="text-sm text-[#374151] text-center italic">
                      {transcript}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── MATCHED ── */}
            {phase === 'matched' && matchedCommand && (
              <div className="flex flex-col items-center gap-4 w-full flex-1 justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center shadow-lg">
                  {renderIcon(matchedCommand.icon, 'w-6 h-6 text-white')}
                </div>
                <div className="text-center max-w-[360px]">
                  <p className="text-base font-semibold text-[#111827]">
                    {matchedCommand.label}
                  </p>
                  {spokenText && (
                    <div className="flex items-start justify-center gap-1.5 mt-2">
                      <Volume2 className="w-3.5 h-3.5 text-[#1a56db] animate-pulse mt-0.5 shrink-0" />
                      <p className="text-sm text-[#6b7280] leading-relaxed text-left">
                        {spokenText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── CONFIRMING: multiple matches ── */}
            {phase === 'confirming' && candidates.length > 1 && (
              <div className="flex flex-col items-center gap-4 w-full">
                <p className="text-sm text-[#374151]">Нашла несколько вариантов:</p>
                <div className="flex flex-col gap-2 w-full max-w-[320px]">
                  {candidates.map((cmd, i) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleCandidateClick(cmd)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm text-[#374151] hover:text-[#1a56db] hover:shadow-md"
                      style={{
                        background: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.4)',
                      }}
                    >
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      {renderIcon(cmd.icon, 'w-4 h-4 text-[#6b7280]')}
                      <span>{cmd.label}</span>
                    </button>
                  ))}
                </div>
                {isListening && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
                    <span className="text-xs text-[#6b7280]">
                      Скажите номер или выберите
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ── ERROR ── */}
            {phase === 'error' && (
              <div className="flex flex-col items-center gap-2 flex-1 justify-center">
                <span className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#dc2626] text-lg font-bold">
                  !
                </span>
                <p className="text-sm text-[#dc2626] font-medium">
                  Команда не распознана
                </p>
                <p className="text-xs text-[#6b7280]">
                  Попробуйте ещё раз или выберите команду
                </p>
              </div>
            )}

            {/* ── IDLE ── */}
            {phase === 'idle' && (
              <div className="flex flex-col items-center gap-4 w-full flex-1 justify-center">
                <p className="text-sm text-[#6b7280]">
                  Нажмите на микрофон и скажите команду
                </p>

                {/* Chips */}
                <div className="w-full">
                  <p className="text-xs text-[#9ca3af] mb-2 px-1">Быстрые команды</p>
                  <div className="flex flex-wrap gap-2">
                    {VOICE_COMMANDS.slice(0, 6).map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={() => handleChipClick(cmd)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#6b7280] hover:text-[#1a56db] hover:shadow-md transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.85)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(255,255,255,0.4)',
                        }}
                      >
                        {renderIcon(cmd.icon, 'w-3.5 h-3.5')}
                        {cmd.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hint */}
                <p className="text-xs text-[#9ca3af] text-center leading-relaxed">
                  Скажите: «записаться», «курсы», «профиль», «документы» или
                  «на главную»
                </p>
              </div>
            )}

            {/* Mic toggle */}
            {(phase === 'idle' || phase === 'listening' || phase === 'error') && (
              <button
                onClick={handleMicToggle}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                aria-label={listening ? 'Остановить запись' : 'Начать запись'}
              >
                <Mic
                  className={`w-6 h-6 ${listening ? 'animate-pulse' : ''}`}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
