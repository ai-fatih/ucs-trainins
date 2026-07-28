'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Badge } from '@/types';
import badgesData from '@/data/school/badges.json';
import { getEarnedBadgeIds } from '@/lib/school/storage';
import BadgeGrid from '@/components/school/BadgeGrid';

const allBadges = badgesData as unknown as Badge[];

export default function BadgesPage() {
  const [earnedIds, setEarnedIds] = useState<string[]>([]);

  useEffect(() => {
    setEarnedIds(getEarnedBadgeIds());
  }, []);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link href="/school" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> На главную
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Бейджи и достижения</h1>
          <p className="text-sm text-[#6b7280]">{earnedIds.length} / {allBadges.length} получено</p>
        </div>
      </div>

      <BadgeGrid badges={allBadges} earnedIds={earnedIds} />
    </div>
  );
}