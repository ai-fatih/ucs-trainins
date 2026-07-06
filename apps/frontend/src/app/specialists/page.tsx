'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Stars } from '@/components/ui/Stars';
import type { Specialist } from '@/types';

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');

  useEffect(() => { api.specialists.list().then(setSpecialists); }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <Link href="/services" className="text-sm text-[#6b7280] mb-4 inline-block">← Назад к услугам</Link>
      <h1 className="section-title">Выберите специалиста</h1>
      <p className="section-subtitle">Консультация по rkeeper • 30 мин • Бесплатно</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {specialists.map((spec) => (
          <Card key={spec.id} className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3" style={{ background: spec.avatarBg, color: spec.avatarColor }}>
              {spec.avatar}
            </div>
            <h3 className="text-base font-semibold">{spec.name}</h3>
            <p className="text-sm text-[#6b7280] mb-2">{spec.role}</p>
            <div className="flex items-center justify-center gap-1 mb-3">
              <Stars rating={spec.rating} />
              <span className="text-xs text-[#6b7280] font-medium">{spec.rating} ({spec.reviewCount} отзывов)</span>
            </div>
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {spec.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
            </div>
            <Button variant="primary" size="sm" className="w-full" onClick={() => router.push(`/booking?specialistId=${spec.id}${serviceId ? `&serviceId=${serviceId}` : ''}`)}>
              Выбрать
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
