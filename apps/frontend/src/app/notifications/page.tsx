'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { NotificationSetting, NotificationEvent } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { data: channels = [], isLoading: channelsLoading } = useQuery<NotificationSetting[]>({
    queryKey: ['notifications', 'channels'],
    queryFn: api.notifications.channels,
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<NotificationEvent[]>({
    queryKey: ['notifications', 'events'],
    queryFn: api.notifications.events,
  });

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <h1 className="section-title">Настройки уведомлений</h1>
      <p className="section-subtitle">Управляйте каналами и событиями для оповещений</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold mb-4">Каналы связи</h3>
            <div className="space-y-4">
              {channelsLoading
                ? Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={2} />)
                : channels.map((ch) => (
                    <div key={ch.channel} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{ch.label}</div>
                        <div className="text-xs text-[#6b7280]">{ch.value === 'email' ? 'ivan@example.ru' : ch.value === 'telegram' ? 'Не подключён' : '+7 (999) 123-45-67'}</div>
                      </div>
                      {ch.channel === 'telegram' && !ch.enabled ? (
                        <Button variant="secondary" size="sm">Подключить</Button>
                      ) : (
                        <label className="relative inline-block w-11 h-6 cursor-pointer">
                          <input type="checkbox" defaultChecked={ch.enabled} className="sr-only peer" />
                          <div className="absolute inset-0 bg-[#d1d5db] rounded-full peer-checked:bg-[#1a56db] transition-all" />
                          <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 peer-checked:left-[22px] transition-all shadow-sm" />
                        </label>
                      )}
                    </div>
                  ))
              }
              <div className="flex items-center justify-between pt-2 border-t border-[#e5e7eb]">
                <div>
                  <div className="text-sm font-medium">Telegram Bot Token</div>
                  <div className="text-xs text-[#6b7280]">Добавьте токен для отправки уведомлений</div>
                </div>
                <Button variant="primary" size="sm" onClick={() => toast('Функция будет доступна после создания бота')}>Настроить</Button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Управление данными</h3>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="!w-full !justify-start" onClick={() => toast('Экспорт данных в JSON')}>📥 Скачать мои данные (JSON)</Button>
              <Button variant="danger" size="sm" className="!w-full !justify-start" onClick={() => { if (confirm('Удалить аккаунт?')) toast('Аккаунт будет удалён в течение 30 дней'); }}>🗑 Удалить аккаунт</Button>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="font-semibold mb-4">События</h3>
            <div className="space-y-3">
              {eventsLoading
                ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={2} />)
                : events.map((ev) => (
                    <div key={ev.id} className="flex items-center justify-between pb-3 border-b border-[#f3f4f6] last:border-0">
                      <div>
                        <div className="text-sm font-medium">{ev.label}</div>
                        <div className="text-xs text-[#6b7280]">{ev.description}</div>
                      </div>
                      <label className="relative inline-block w-11 h-6 cursor-pointer shrink-0">
                        <input type="checkbox" defaultChecked={ev.enabled} className="sr-only peer" />
                        <div className="absolute inset-0 bg-[#d1d5db] rounded-full peer-checked:bg-[#1a56db] transition-all" />
                        <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 peer-checked:left-[22px] transition-all shadow-sm" />
                      </label>
                    </div>
                  ))
              }
            </div>
            <Button variant="primary" className="mt-4" onClick={() => toast('Настройки сохранены')}>Сохранить</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
