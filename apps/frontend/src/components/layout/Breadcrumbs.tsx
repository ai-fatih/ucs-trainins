'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const LABEL_MAP: Record<string, string> = {
  instructions: 'Инструкции',
  rk7: 'r_keeper 7',
  storehouse: 'StoreHouse Pro',
  delivery: 'Delivery',
  event: 'Event',
  waiter: 'Waiter & Cash Desk',
  booking: 'Услуги',
  chat: 'Чат с отделом',
  quiz: 'Викторина',
  profile: 'Личный кабинет',
  notifications: 'Уведомления',
  admin: 'Панель управления',
  dashboard: 'Дашборд',
  requests: 'Заявки',
  'create-order': 'Создание заказа',
  'shift-management': 'Управление сменой',
  'discounts-returns': 'Скидки и возвраты',
  'write-off': 'Списание',
  inventory: 'Инвентаризация',
  arrival: 'Поступление',
  'courier-app': 'Приложение курьера',
  'call-center': 'Колл-центр',
  'take-order': 'Приём заказа',
  payment: 'Оплата',
  shift: 'Начало и конец смены',
  privacy: 'Политика конфиденциальности',
  terms: 'Условия использования',
  offer: 'Публичная оферта',
  consent: 'Согласие',
  login: 'Вход',
  register: 'Регистрация',
  review: 'Отзыв',
  feedback: 'Обратная связь',
  request: 'Заявка',
  services: 'Услуги',
  specialists: 'Специалисты',
  schedule: 'Расписание',
  auth: 'Авторизация',
  rkeeper: 'r_keeper',
};

const SKIP_SEGMENTS = new Set<string>();

function segmentLabel(segment: string): string {
  return LABEL_MAP[segment] ?? segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { href: string; label: string }[] = [];
  let acc = '';

  for (const seg of segments) {
    acc += `/${seg}`;
    if (SKIP_SEGMENTS.has(seg)) continue;
    crumbs.push({ href: acc, label: segmentLabel(seg) });
  }

  if (crumbs.length === 0) return null;

  return (
    <nav className="px-4 py-2.5 text-sm text-[#6b7280]" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {crumbs.map((cr, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={cr.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#9ca3af]" />}
              {last ? (
                <span className="font-semibold text-[#374151]">{cr.label}</span>
              ) : (
                <Link
                  href={cr.href}
                  className="no-underline text-[#6b7280] hover:text-[#1a56db] transition-colors"
                >
                  {cr.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
