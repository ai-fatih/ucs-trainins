'use client';
import React, { useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';

const PhaserMount = dynamic(() => import('@/components/games/PhaserMount'), { ssr: false });

export default function BubblePage() {
  const createGame = useCallback(async (parent: HTMLElement) => {
    const { createBubbleGame } = await import('@/games/tracker/bubble/main');
    const game = createBubbleGame(parent);
    return { destroy: () => game.destroy(true) };
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="max-w-[600px] mx-auto px-4 py-3">
        <Link href="/games" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] transition-colors no-underline">
          <ArrowLeft className="w-4 h-4" /> Игры
        </Link>
      </div>
      <PhaserMount createGame={createGame} className="w-full max-w-[480px] mx-auto" />
    </div>
  );
}