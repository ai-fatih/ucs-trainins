'use client';
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ChevronDown } from 'lucide-react';

const specialists = [
  { initials: 'ЕП', name: 'Елена Попова', online: true, bg: '#ccfbf1', color: '#0d9488' },
  { initials: 'АМ', name: 'Амир Мурзабеков', online: false, bg: '#e8effa', color: '#1a56db' },
  { initials: 'ДР', name: 'Дмитрий Резников', online: true, bg: '#d1fae5', color: '#059669' },
  { initials: 'ВФ', name: 'Владислав Фатихов', online: true, bg: '#fef3c7', color: '#d97706' },
];

const quickReplies = [
  'Хочу записаться на консультацию',
  'Нужно обучение персонала',
  'Вопрос по документам',
  'Проблема с rkeeper',
];

interface ChatWidgetProps {
  onClose?: () => void;
}

export function ChatWidget({ onClose }: ChatWidgetProps) {
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sent: boolean }[]>([
    { text: 'Здравствуйте! Чем могу помочь?', sent: false },
  ]);
  const [input, setInput] = useState('');
  const [selectedSpec, setSelectedSpec] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { text, sent: true }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        text: 'Спасибо за обращение! Специалист ответит в ближайшее время.',
        sent: false,
      }]);
    }, 1000);
  };

  return (
    <div className={`absolute bottom-20 right-0 w-[360px] transition-all duration-300 ${minimized ? 'h-14' : 'h-[520px]'}`}>
      <div className="glass-bottom-panel rounded-2xl overflow-hidden flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white text-xs font-bold">
              {specialists[selectedSpec].initials}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#111827]">{specialists[selectedSpec].name}</div>
              <div className="flex items-center gap-1 text-[10px] text-[#22c55e]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" /> Онлайн
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setMinimized(!minimized)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5 transition-all">
              <ChevronDown className={`w-4 h-4 transition-transform ${minimized ? '' : 'rotate-180'}`} />
            </button>
            <button onClick={() => onClose?.()} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#dc2626] hover:bg-red-50 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${
                      msg.sent
                        ? 'bg-gradient-to-r from-[#1a56db] to-[#0d9488] text-white rounded-br-md'
                        : 'bg-[#f3f4f6] text-[#374151] rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {quickReplies.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => send(qr)}
                    className="text-[11px] px-2.5 py-1.5 rounded-full bg-[#f3f4f6] text-[#6b7280] hover:bg-[#1a56db]/10 hover:text-[#1a56db] transition-all border border-[#e5e7eb]"
                  >
                    {qr}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send(input)}
                  placeholder="Напишите сообщение..."
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)] bg-white/80"
                />
                <button
                  onClick={() => send(input)}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center hover:scale-105 transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
