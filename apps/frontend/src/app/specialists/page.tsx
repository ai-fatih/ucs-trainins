'use client';
import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Stars } from '@/components/ui/Stars';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuthStore } from '@/stores/auth';
import type { Specialist } from '@/types';

const programTagColors: Record<string, { bg: string; text: string }> = {
  rkeeper: { bg: '#e8effa', text: '#1a56db' },
  'storehouse pro': { bg: '#fef3c7', text: '#d97706' },
  rk_delivery: { bg: '#ede9fe', text: '#7c3aed' },
  rk_event: { bg: '#fce7f3', text: '#be185d' },
};

function SpecialistsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const { isAuthenticated } = useAuthStore();
  const [authOpen, setAuthOpen] = useState(false);

  const { data: specialists = [] } = useQuery<Specialist[]>({
    queryKey: ['specialists'],
    queryFn: api.specialists.list,
  });

  const handleSelect = (specId: string) => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    router.push(`/booking?specialistId=${specId}${serviceId ? `&serviceId=${serviceId}` : ''}`);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <Link href="/services" className="text-sm text-[#6b7280] mb-4 inline-block">← Назад к услугам</Link>
      <h1 className="section-title">Выберите специалиста</h1>
      <p className="section-subtitle">Консультация по rkeeper • 30 мин • Бесплатно</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {specialists.map((spec) => (
          <div key={spec.id} className="glass-card text-center p-6">
            <Avatar
              src={spec.avatarUrl}
              name={spec.name}
              size="lg"
              bg={spec.avatarBg}
              color={spec.avatarColor}
              className="mx-auto mb-3"
            />
            <h3 className="text-base font-semibold">{spec.name}</h3>
            <p className="text-sm text-[#6b7280] mb-2">{spec.role}</p>
            <div className="flex items-center justify-center gap-1 mb-3">
              <Stars rating={spec.rating} />
              <span className="text-xs text-[#6b7280] font-medium">{spec.rating} ({spec.reviewCount} отзывов)</span>
            </div>
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {spec.programTags?.map((tag) => {
                const colors = programTagColors[tag] || { bg: '#f3f4f6', text: '#374151' };
                return (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>
                    {tag}
                  </span>
                );
              })}
              {spec.skillTags?.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => handleSelect(spec.id)}
              className="glass-btn w-full"
            >
              Выбрать
            </button>
          </div>
        ))}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

export default function SpecialistsPage() {
  return (
    <Suspense>
      <SpecialistsPageContent />
    </Suspense>
  );
}
