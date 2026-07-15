'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { MessageCircle, ArrowRight } from 'lucide-react';
import type { ChatRoom } from '@/types';

export default function ChatIndexPage() {
  const [chats, setChats] = useState<ChatRoom[]>([]);

  useEffect(() => {
    api.chat.list().then(setChats);
  }, []);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <h1 className="section-title">Чат с отделом</h1>
      <p className="section-subtitle">Ваши диалоги со специалистами</p>

      {chats.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <MessageCircle className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
          <p className="text-[#6b7280] mb-4">У вас пока нет активных чатов</p>
          <Link href="/booking" className="glass-btn text-sm inline-flex">
            Записаться на консультацию <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className="flex items-start gap-4 glass-card p-4 no-underline hover:bg-white transition-colors group"
            >
              <span className="w-10 h-10 rounded-full bg-[#e8effa] text-[#1a56db] flex items-center justify-center text-sm font-bold shrink-0">
                {chat.specialistAvatar}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#111827] group-hover:text-[#1a56db] transition-colors">
                    {chat.specialistName}
                  </span>
                  <span className="text-[10px] text-[#9ca3af] whitespace-nowrap">{chat.lastMessageTime}</span>
                </div>
                <p className="text-xs text-[#6b7280] truncate mt-0.5">{chat.lastMessage}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={chat.isOnline ? 'success' : 'gray'}>
                    {chat.isOnline ? 'Онлайн' : 'Офлайн'}
                  </Badge>
                  <Badge variant="info">{chat.bookingRefLabel}</Badge>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#d1d5db] mt-2 shrink-0 group-hover:text-[#1a56db] transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
