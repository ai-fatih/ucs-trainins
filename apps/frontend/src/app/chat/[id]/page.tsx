'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import type { ChatRoom, ChatMessage } from '@/types';

export default function ChatPage() {
  const { id } = useParams();
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    api.chat.list().then(setChats);
    api.chat.getMessages(id as string).then(setMessages);
  }, [id]);

  const currentChat = chats.find((c) => c.id === id);

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <h1 className="section-title">Чат с отделом консультации</h1>
      <p className="section-subtitle">Диалог привязан к записи от 3 июля 2026</p>

      <div className="flex border border-[#e5e7eb] rounded-lg overflow-hidden bg-white" style={{ minHeight: '500px' }}>
        {/* Chat list overlay on mobile */}
        {showList && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowList(false)}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between">
                <input className="form-input text-xs flex-1" placeholder="Поиск чата..." />
                <button onClick={() => setShowList(false)} className="ml-2 w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#dc2626] transition-all">✕</button>
              </div>
              <div className="text-[10px] font-semibold text-[#9ca3af] uppercase px-4 pt-3 pb-1">Активные</div>
              {chats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  onClick={() => setShowList(false)}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors no-underline ${
                    chat.id === id ? 'bg-[#e8effa] border-l-[3px] border-[#1a56db]' : 'border-l-[3px] border-transparent hover:bg-[#f9fafb]'
                  }`}
                >
                  <span className="w-8 h-8 rounded-full bg-[#e8effa] text-[#1a56db] flex items-center justify-center text-xs font-bold shrink-0">{chat.specialistAvatar}</span>
                  <span className="flex-1 min-w-0">
                    <span className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#111827]">{chat.specialistName}</span>
                      <span className="text-[10px] text-[#6b7280]">{chat.lastMessageTime}</span>
                    </span>
                    <span className="text-xs text-[#6b7280] truncate block">{chat.lastMessage}</span>
                    <Badge variant={chat.isOnline ? 'success' : 'gray'}>{chat.bookingRefLabel}</Badge>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Chat list desktop */}
        <div className="w-72 border-r border-[#e5e7eb] hidden md:block">
          <div className="p-4 border-b border-[#e5e7eb]">
            <input className="form-input text-xs" placeholder="Поиск чата..." />
          </div>
          <div className="text-[10px] font-semibold text-[#9ca3af] uppercase px-4 pt-3 pb-1">Активные</div>
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className={`flex items-start gap-3 px-4 py-3 transition-colors no-underline ${
                chat.id === id ? 'bg-[#e8effa] border-l-[3px] border-[#1a56db]' : 'border-l-[3px] border-transparent hover:bg-[#f9fafb]'
              }`}
            >
              <span className="w-8 h-8 rounded-full bg-[#e8effa] text-[#1a56db] flex items-center justify-center text-xs font-bold shrink-0">{chat.specialistAvatar}</span>
              <span className="flex-1 min-w-0">
                <span className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#111827]">{chat.specialistName}</span>
                  <span className="text-[10px] text-[#6b7280]">{chat.lastMessageTime}</span>
                </span>
                <span className="text-xs text-[#6b7280] truncate block">{chat.lastMessage}</span>
                <Badge variant={chat.isOnline ? 'success' : 'gray'}>{chat.bookingRefLabel}</Badge>
              </span>
            </Link>
          ))}
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col">
          {currentChat && (
            <div className="flex items-center gap-3 px-5 py-3 border-b border-[#e5e7eb]">
              <button onClick={() => setShowList(true)} className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/10 transition-all" aria-label="Список чатов">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
              <div className="w-9 h-9 rounded-full bg-[#e8effa] text-[#1a56db] flex items-center justify-center text-sm font-bold">{currentChat.specialistAvatar}</div>
              <div>
                <div className="font-semibold text-sm">{currentChat.specialistName}</div>
                <div className="flex items-center gap-1 text-xs text-[#059669]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] inline-block" /> Онлайн
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                  msg.isSent ? 'bg-[#1a56db] text-white rounded-br-sm' : 'bg-[#f3f4f6] text-[#111827] rounded-bl-sm'
                }`}>
                  {msg.type === 'file' ? (
                    <span className="flex items-center gap-2 text-xs opacity-80">📄 {msg.fileName}</span>
                  ) : msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 p-4 border-t border-[#e5e7eb]">
            <input
              className="flex-1 px-3.5 py-2.5 text-sm border border-[#d1d5db] rounded-md outline-none focus:border-[#1a56db]"
              placeholder="Напишите сообщение..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) { setMessages([...messages, { id: `m${Date.now()}`, chatRoomId: id as string, senderId: 'user1', senderName: 'Вы', content: input, type: 'text', createdAt: new Date().toISOString(), isSent: true }]); setInput(''); } }}
            />
            <button className="btn-primary !px-3 !py-2.5" onClick={() => { if (input.trim()) { setMessages([...messages, { id: `m${Date.now()}`, chatRoomId: id as string, senderId: 'user1', senderName: 'Вы', content: input, type: 'text', createdAt: new Date().toISOString(), isSent: true }]); setInput(''); } }}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}
