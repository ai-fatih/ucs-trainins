'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import type { Service } from '@/types';

const tabs = [
  { id: 'all', label: 'Все услуги' },
  { id: 'consultations', label: 'Консультации' },
  { id: 'trainings', label: 'Тренинги' },
  { id: 'setup', label: 'Настройка' },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();

  useEffect(() => { api.services.list().then(setServices); }, []);

  const filtered = activeTab === 'all' ? services : services.filter((s) => s.category === activeTab);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="section-title">Консультации и обучение rkeeper</h1>
      <p className="section-subtitle">Выберите тип услуги. Бесплатно при активном договоре поддержки.</p>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <Card key={service.id} hoverable onClick={() => router.push(`/specialists?serviceId=${service.id}`)}>
            <div className="w-12 h-12 rounded-md flex items-center justify-center text-2xl mb-3" style={{ background: service.iconBg }}>{service.icon}</div>
            <h3 className="text-base font-semibold mb-1">{service.name}</h3>
            <p className="text-sm text-[#6b7280] mb-4">{service.description}</p>
            <div className="flex items-center gap-4 text-sm text-[#6b7280]">
              <span>🕐 {service.durationMinutes} мин</span>
              {service.isFree ? <Badge variant="success">Бесплатно*</Badge> : <Badge variant="warning">{service.priceRub?.toLocaleString()} ₽</Badge>}
            </div>
          </Card>
        ))}
      </div>

      <p className="text-xs text-[#9ca3af] mt-6">* Бесплатно для клиентов с активным договором пользовательской поддержки.</p>
    </div>
  );
}
