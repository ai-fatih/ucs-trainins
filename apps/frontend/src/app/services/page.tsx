'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Service } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { PrefetchLink } from '@/components/ui/PrefetchLink';

const tabs = [
  { id: 'consultations', label: 'Консультации' },
  { id: 'trainings', label: 'Тренинги' },
  { id: 'setup', label: 'Настройка' },
  { id: 'video', label: 'Видео обучение' },
];

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('consultations');
  const router = useRouter();
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: api.services.list,
  });

  const filtered = services.filter((s) => s.category === activeTab);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="section-title">Консультации и обучение rkeeper</h1>
      <p className="section-subtitle">Выберите тип услуги. Бесплатно при активном договоре поддержки.</p>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          : filtered.map((service) => (
              <PrefetchLink key={service.id} href={`/booking?serviceId=${service.id}`}>
                <Card hoverable>
                  <div className="w-12 h-12 rounded-md flex items-center justify-center text-2xl mb-3" style={{ background: service.iconBg }}>{service.icon}</div>
                  <h3 className="text-base font-semibold mb-1">{service.name}</h3>
                  <p className="text-sm text-[#6b7280] mb-4">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm text-[#6b7280]">
                    {service.durationMinutes > 0 && <span>🕐 {service.durationMinutes} мин</span>}
                    {service.isFree ? <Badge variant="success">Бесплатно*</Badge> : <Badge variant="warning">{service.priceRub?.toLocaleString()} ₽</Badge>}
                  </div>
                </Card>
              </PrefetchLink>
            ))}
      </div>

      <p className="text-xs text-[#9ca3af] mt-6">* Бесплатно для клиентов с активным договором пользовательской поддержки.</p>
    </div>
  );
}
