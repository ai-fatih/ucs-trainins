'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { X, Send, ChevronDown, MessageCircle, ArrowUpRight } from 'lucide-react';

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

interface ChatMessage {
  text: string;
  sent: boolean;
  action?: { label: string; href: string };
}

function buildBotReply(input: string): ChatMessage {
  const lower = input.toLowerCase();
  if (/(запис|консультац|записаться)/.test(lower)) {
    return {
      text: 'Отличная идея! Вы можете записаться на консультацию или обучение — выберите специалиста и удобное время.',
      sent: false,
      action: { label: 'Перейти к записи', href: '/booking' },
    };
  }
  if (/(обучен|курс|школ|персонал)/.test(lower)) {
    return {
      text: 'В школе UCS доступны курсы по работе с rkeeper, меню и складом. Обучение с сертификатами и отслеживанием прогресса.',
      sent: false,
      action: { label: 'Курсы школы', href: '/school/courses' },
    };
  }
  if (/(документ|инструкц|помощь)/.test(lower)) {
    return {
      text: 'В базе знаний собраны пошаговые инструкции по всем продуктам r_keeper: касса, склад, доставка, Event, Waiter.',
      sent: false,
      action: { label: 'Открыть документацию', href: '/docs' },
    };
  }
  if (/(rkeeper|проблем|не работ|ошибк|сломал)/.test(lower)) {
    return {
      text: 'Специалист технической поддержки поможет разобраться с проблемой. Опишите ситуацию в общем чате — приложите скриншоты при необходимости.',
      sent: false,
      action: { label: 'Написать специалисту', href: '/chat' },
    };
  }
  return {
    text: 'Спасибо за обращение! Специалист ответит в ближайшее время. Или задайте вопрос в общем чате.',
    sent: false,
    action: { label: 'Открыть полный чат', href: '/chat' },
  };
}

interface ChatWidgetProps {
  onClose?: () => void;
}

export function ChatWidget({ onClose }: ChatWidgetProps) {
  const [minimized, setMinimized] = useState(false);
  const [specMenuOpen, setSpecMenuOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: 'Здравствуйте! Чем могу помочь?', sent: false },
  ]);
  const [input, setInput] = useState('');
  const [selectedSpec, setSelectedSpec] = useState(0);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { text, sent: true }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, buildBotReply(text)]);
    }, 900);
  };

  return (
    <div className={`w-[360px] max-w-[calc(100vw-24px)] transition-all duration-300 ${minimized ? 'h-14' : 'h-[520px] max-h-[calc(100vh-120px)]'}`}>
      <div className="glass-bottom-panel rounded-2xl overflow-hidden flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
          <div className="relative">
            <button
              onClick={() => setSpecMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white text-xs font-bold">
                {specialists[selectedSpec].initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#111827]">{specialists[selectedSpec].name}</div>
                <div className="flex items-center gap-1 text-[10px] text-[#22c55e]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  {specialists[selectedSpec].online ? 'Онлайн' : 'Офлайн'}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#9ca3af] transition-transform ${specMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {specMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSpecMenuOpen(false)} />
                <div className="absolute left-0 top-full mt-2 w-[260px] rounded-xl p-1.5 z-20 bg-white/95 backdrop-blur-md border border-[#e5e7eb] shadow-xl">
                  {specialists.map((s, i) => (
                    <button
                      key={s.name}
                      onClick={() => { setSelectedSpec(i); setSpecMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-[#f3f4f6] transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: s.color }}>
                        {s.initials}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-[#111827] truncate">{s.name}</span>
                        <span className={`block text-[10px] ${s.online ? 'text-[#22c55e]' : 'text-[#9ca3af]'}`}>
                          {s.online ? 'Онлайн' : 'Офлайн'}
                        </span>
                      </span>
                      {i === selectedSpec && <span className="w-2 h-2 rounded-full bg-[#1a56db]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
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
                    className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${
                      msg.sent
                        ? 'bg-gradient-to-r from-[#1a56db] to-[#0d9488] text-white rounded-br-md'
                        : 'bg-[#f3f4f6] text-[#374151] rounded-bl-md'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.action && (
                      <Link
                        href={msg.action.href}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-[#1a56db] bg-white hover:bg-[#e8effa] transition-colors no-underline"
                      >
                        <MessageCircle className="w-3 h-3" />
                        {msg.action.label}
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-[#f3f4f6] text-[#374151] rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9ca3af] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9ca3af] animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9ca3af] animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}
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
