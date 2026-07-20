'use client';
import React from 'react';
import Link from 'next/link';
import { BookOpen, FileText, Video, ExternalLink, Search, ChevronRight } from 'lucide-react';

const categories = [
  {
    title: 'Начало работы',
    icon: BookOpen,
    items: [
      'Как зарегистрироваться в личном кабинете',
      'Как записаться на консультацию',
      'Как отменить или перенести запись',
      'Обзор личного кабинета',
    ],
  },
  {
    title: 'Обучение',
    icon: Video,
    items: [
      'Доступ к обучающим материалам',
      'Форматы обучения: индивидуальное и групповое',
      'Как получить сертификат об обучении',
      'Часто задаваемые вопросы по обучению',
    ],
  },
  {
    title: 'Документы и оплата',
    icon: FileText,
    items: [
      'Как получить закрывающие документы',
      'Способы оплаты',
      'Договор на оказание услуг',
      'Возврат и претензии',
    ],
  },
  {
    title: 'R-Keeper StoreHouse Pro',
    icon: ExternalLink,
    links: [
      { label: 'Списание товаров', href: '/instructions/rkeeper/storehouse/write-off' },
      { label: 'Инвентаризация', href: '/instructions/rkeeper/storehouse/inventory' },
      { label: 'Оприходование товаров', href: '/instructions/rkeeper/storehouse/arrival' },
    ],
  },
  {
    title: 'R-Keeper Delivery',
    icon: ExternalLink,
    links: [
      { label: 'Создание заказа доставки', href: '/instructions/rkeeper/delivery/create-order' },
      { label: 'CourierApp — приложение курьера', href: '/instructions/rkeeper/delivery/courier-app' },
    ],
  },
];

export default function InstructionsPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Инструкции</h1>
        <p className="text-[#6b7280]">
          Документация и руководства для пользователей
        </p>
      </div>

      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
        <input
          placeholder="Поиск по инструкциям..."
          className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)] bg-white/80"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.title} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-[#111827]">{cat.title}</h2>
              </div>
              <ul className="space-y-2">
                {'links' in cat
                  ? (cat as { links: { label: string; href: string }[] }).links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors py-1.5 group"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-[#d1d5db] group-hover:text-[#1a56db] transition-colors" />
                          {link.label}
                        </Link>
                      </li>
                    ))
                  : (cat as { items: string[] }).items.map((item) => (
                      <li key={item}>
                        <Link
                          href="#"
                          className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors py-1.5 group"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-[#d1d5db] group-hover:text-[#1a56db] transition-colors" />
                          {item}
                        </Link>
                      </li>
                    ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
