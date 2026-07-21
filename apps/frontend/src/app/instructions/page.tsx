'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Monitor, Cloud, Smartphone, BookOpen } from 'lucide-react';

interface Scenario {
  title: string;
  desc: string;
  href: string;
}

interface Product {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  group: 'desktop' | 'cloud' | 'mobile';
  scenarios: Scenario[];
}

const products: Product[] = [
  {
    id: 'rk7',
    label: 'r_keeper 7',
    desc: 'Кассовая и управленческая система для ресторанов',
    icon: <span className="font-bold text-lg">7</span>,
    color: '#1a56db',
    bgGradient: 'from-[#1a56db] to-[#2563eb]',
    group: 'desktop',
    scenarios: [
      { title: 'Создание и оплата заказа', desc: 'Открытие смены, добавление позиций, приём оплаты наличными и картой', href: '/instructions/rkeeper/rk7/create-order' },
      { title: 'Управление сменами', desc: 'Открытие и закрытие кассовой смены, сверка отчётов, X- и Z-отчёты', href: '/instructions/rkeeper/rk7/shift-management' },
      { title: 'Скидки и возвраты', desc: 'Применение скидок на позицию или чек, оформление возврата по закрытому чеку', href: '/instructions/rkeeper/rk7/discounts-returns' },
    ],
  },
  {
    id: 'storehouse',
    label: 'StoreHouse Pro',
    desc: 'Система управления складом, производством и кухней',
    icon: <span className="font-bold text-lg">S</span>,
    color: '#0d9488',
    bgGradient: 'from-[#0d9488] to-[#14b8a6]',
    group: 'desktop',
    scenarios: [
      { title: 'Списание товаров', desc: 'Создание и проведение документа списания, указание причин и проверка остатков', href: '/instructions/rkeeper/storehouse/write-off' },
      { title: 'Инвентаризация', desc: 'Проведение инвентаризации: опись, ввод фактических остатков, обработка расхождений', href: '/instructions/rkeeper/storehouse/inventory' },
      { title: 'Оприходование товаров', desc: 'Оформление поступления товаров на склад, добавление номенклатуры и цен', href: '/instructions/rkeeper/storehouse/arrival' },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    desc: 'Облачная система автоматизации доставки еды',
    icon: <span className="font-bold text-lg">D</span>,
    color: '#d97706',
    bgGradient: 'from-[#d97706] to-[#f59e0b]',
    group: 'cloud',
    scenarios: [
      { title: 'Создание заказа доставки', desc: 'Выбор гостя, сбор заказа из меню, назначение курьера и подтверждение', href: '/instructions/rkeeper/delivery/create-order' },
      { title: 'CourierApp — приложение курьера', desc: 'Выход на смену, приём и доставка заказа, завершение и отчёт', href: '/instructions/rkeeper/delivery/courier-app' },
      { title: 'Приём заказа в колл-центре', desc: 'Работа со списком заказов, карточка заказа, назначение курьера', href: '/instructions/rkeeper/delivery/call-center' },
    ],
  },
  {
    id: 'event',
    label: 'Event',
    desc: 'Уведомления с кассы rk Cash Desk',
    icon: <span className="font-bold text-lg">E</span>,
    color: '#9ca3af',
    bgGradient: 'from-[#9ca3af] to-[#b0b7c3]',
    group: 'cloud',
    scenarios: [],
  },
  {
    id: 'waiter',
    label: 'Waiter & Cash Desk',
    desc: 'Мобильные приложения для официантов и кассиров',
    icon: <span className="font-bold text-lg">W</span>,
    color: '#7c3aed',
    bgGradient: 'from-[#7c3aed] to-[#8b5cf6]',
    group: 'mobile',
    scenarios: [
      { title: 'Приём заказа через Waiter', desc: 'Авторизация, создание заказа у столика, отправка на кухню', href: '/instructions/rkeeper/waiter/take-order' },
      { title: 'Оплата счета через Cash Desk', desc: 'Приём оплаты наличными и картой у столика, печать чека', href: '/instructions/rkeeper/waiter/payment' },
      { title: 'Выход на смену и завершение', desc: 'Начало смены в приложении, синхронизация, закрытие смены', href: '/instructions/rkeeper/waiter/shift' },
    ],
  },
];

const groupIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor className="w-3 h-3" />,
  cloud: <Cloud className="w-3 h-3" />,
  mobile: <Smartphone className="w-3 h-3" />,
};

const groupLabels: Record<string, string> = {
  desktop: 'Десктоп',
  cloud: 'Облачные сервисы',
  mobile: 'Мобильные',
};

export default function InstructionsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let list = products;
    if (activeTab !== 'all') {
      list = list.filter((p) => p.id === activeTab);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list
      .map((p) => ({
        ...p,
        scenarios: p.scenarios.filter(
          (s) => s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q),
        ),
      }))
      .filter((p) => p.scenarios.length > 0);
  }, [activeTab, searchQuery]);

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Инструкции</h1>
        <p className="text-[#6b7280]">Документация и пошаговые руководства по продуктам r_keeper</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по сценариям..."
          className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-[#e5e7eb] outline-none focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.1)] bg-white/80"
        />
      </div>

      <div className="flex items-center gap-1 border-b border-[#e5e7eb] mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'text-[#1a56db] border-[#1a56db]'
              : 'text-[#6b7280] border-transparent hover:text-[#1a56db]'
          }`}
        >
          Все продукты
        </button>
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveTab(p.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === p.id
                ? 'text-[#1a56db] border-[#1a56db]'
                : 'text-[#6b7280] border-transparent hover:text-[#1a56db]'
            } ${p.scenarios.length === 0 ? 'opacity-40' : ''}`}
          >
            <span
              className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-bold"
              style={{ background: p.color }}
            >
              {p.label[0]}
            </span>
            {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {filtered.map((product) => (
          <div key={product.id}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${product.bgGradient} flex items-center justify-center text-white`}
              >
                {product.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">{product.label}</h2>
                <p className="text-xs text-[#6b7280]">{product.desc}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                {groupIcons[product.group]}
                {groupLabels[product.group]}
              </div>
            </div>

            {product.scenarios.length === 0 ? (
              <div className="glass-card p-6 text-center">
                <p className="text-sm text-[#9ca3af] mb-2">Раздел готовится</p>
                <p className="text-xs text-[#d1d5db]">Сценарии появятся после выхода продукта</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {product.scenarios.map((s, i) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="glass-card p-5 no-underline transition-all hover:-translate-y-0.5 flex items-start gap-4"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center text-sm font-semibold">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-base font-medium text-[#1a56db] block">{s.title}</span>
                      <span className="text-sm text-[#6b7280] mt-0.5 block">{s.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#9ca3af]">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
