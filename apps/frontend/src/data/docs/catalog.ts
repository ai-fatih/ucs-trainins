export type ProductGroup = 'desktop' | 'cloud' | 'mobile';

export interface DocScenario {
  href: string;
  label: string;
  short?: string;
  desc?: string;
}

export interface DocProduct {
  id: string;
  label: string;
  desc: string;
  group: ProductGroup;
  color: string;
  bgGradient: string;
  href: string;
  scenarios: DocScenario[];
}

export interface SidebarSection {
  label: string;
  items: {
    href: string;
    label: string;
    children?: { href: string; label: string }[];
  }[];
}

export const docProducts: DocProduct[] = [
  {
    id: 'rk7',
    label: 'r_keeper 7',
    desc: 'Кассовая и управленческая система для ресторанов',
    group: 'desktop',
    color: '#1a56db',
    bgGradient: 'from-[#1a56db] to-[#2563eb]',
    href: '/docs/rkeeper/rk7',
    scenarios: [
      {
        href: '/docs/rkeeper/rk7/create-order',
        label: 'Создание и оплата заказа',
        short: 'Создание и оплата заказа',
        desc: 'Открытие смены, добавление позиций, приём оплаты наличными и картой',
      },
      {
        href: '/docs/rkeeper/rk7/shift-management',
        label: 'Управление сменами',
        desc: 'Открытие и закрытие кассовой смены, сверка отчётов, X- и Z-отчёты',
      },
      {
        href: '/docs/rkeeper/rk7/discounts-returns',
        label: 'Скидки и возвраты',
        desc: 'Применение скидок на позицию или чек, оформление возврата по закрытому чеку',
      },
    ],
  },
  {
    id: 'storehouse',
    label: 'StoreHouse Pro',
    desc: 'Система управления складом, производством и кухней',
    group: 'desktop',
    color: '#0d9488',
    bgGradient: 'from-[#0d9488] to-[#14b8a6]',
    href: '/docs/rkeeper/storehouse',
    scenarios: [
      {
        href: '/docs/rkeeper/storehouse/write-off',
        label: 'Списание товаров',
        short: 'Списание',
        desc: 'Создание и проведение документа списания, указание причин и проверка остатков',
      },
      {
        href: '/docs/rkeeper/storehouse/inventory',
        label: 'Инвентаризация',
        desc: 'Проведение инвентаризации: опись, ввод фактических остатков, обработка расхождений',
      },
      {
        href: '/docs/rkeeper/storehouse/arrival',
        label: 'Оприходование товаров',
        short: 'Поступление',
        desc: 'Оформление поступления товаров на склад, добавление номенклатуры и цен',
      },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    desc: 'Облачная система автоматизации доставки еды',
    group: 'cloud',
    color: '#d97706',
    bgGradient: 'from-[#d97706] to-[#f59e0b]',
    href: '/docs/rkeeper/delivery',
    scenarios: [
      {
        href: '/docs/rkeeper/delivery/create-order',
        label: 'Создание заказа доставки',
        short: 'Создание заказа',
        desc: 'Выбор гостя, сбор заказа из меню, назначение курьера и подтверждение',
      },
      {
        href: '/docs/rkeeper/delivery/courier-app',
        label: 'CourierApp — приложение курьера',
        short: 'Приложение курьера',
        desc: 'Выход на смену, приём и доставка заказа, завершение и отчёт',
      },
      {
        href: '/docs/rkeeper/delivery/call-center',
        label: 'Приём заказа в колл-центре',
        short: 'Колл-центр',
        desc: 'Работа со списком заказов, карточка заказа, назначение курьера',
      },
    ],
  },
  {
    id: 'event',
    label: 'Event',
    desc: 'Уведомления с кассы rk Cash Desk',
    group: 'cloud',
    color: '#9ca3af',
    bgGradient: 'from-[#9ca3af] to-[#b0b7c3]',
    href: '/docs/rkeeper/event',
    scenarios: [
      {
        href: '/docs/rkeeper/event/notifications',
        label: 'Настройка оповещений с кассы',
        short: 'Настройка оповещений',
        desc: 'Выбор типов событий, каналы оповещения, звук и приоритет',
      },
      {
        href: '/docs/rkeeper/event/event-screen',
        label: 'Экран событий',
        desc: 'Просмотр ленты событий, фильтры, подтверждение и история',
      },
      {
        href: '/docs/rkeeper/event/devices',
        label: 'Подключение внешних устройств',
        short: 'Подключение устройств',
        desc: 'Табло заказов и звуковые оповещения, проверка подключения',
      },
    ],
  },
  {
    id: 'waiter',
    label: 'Waiter & Cash Desk',
    desc: 'Мобильные приложения для официантов и кассиров',
    group: 'mobile',
    color: '#7c3aed',
    bgGradient: 'from-[#7c3aed] to-[#8b5cf6]',
    href: '/docs/rkeeper/waiter',
    scenarios: [
      {
        href: '/docs/rkeeper/waiter/take-order',
        label: 'Приём заказа через Waiter',
        short: 'Приём заказа',
        desc: 'Авторизация, создание заказа у столика, отправка на кухню',
      },
      {
        href: '/docs/rkeeper/waiter/payment',
        label: 'Оплата счета через Cash Desk',
        short: 'Оплата',
        desc: 'Приём оплаты наличными и картой у столика, печать чека',
      },
      {
        href: '/docs/rkeeper/waiter/shift',
        label: 'Выход на смену и завершение',
        short: 'Начало и конец смены',
        desc: 'Начало смены в приложении, синхронизация, закрытие смены',
      },
    ],
  },
];

export const docSections: SidebarSection[] = [
  {
    label: 'Десктоп',
    items: [
      {
        href: '/docs/rkeeper/rk7',
        label: 'r_keeper 7',
        children: docProducts
          .find((p) => p.id === 'rk7')!
          .scenarios.map((s) => ({ href: s.href, label: s.short ?? s.label })),
      },
      {
        href: '/docs/rkeeper/storehouse',
        label: 'StoreHouse Pro',
        children: docProducts
          .find((p) => p.id === 'storehouse')!
          .scenarios.map((s) => ({ href: s.href, label: s.short ?? s.label })),
      },
    ],
  },
  {
    label: 'Облачные сервисы',
    items: [
      {
        href: '/docs/rkeeper/delivery',
        label: 'Delivery',
        children: docProducts
          .find((p) => p.id === 'delivery')!
          .scenarios.map((s) => ({ href: s.href, label: s.short ?? s.label })),
      },
      {
        href: '/docs/rkeeper/event',
        label: 'Event',
        children: docProducts
          .find((p) => p.id === 'event')!
          .scenarios.map((s) => ({ href: s.href, label: s.short ?? s.label })),
      },
    ],
  },
  {
    label: 'Мобильные',
    items: [
      {
        href: '/docs/rkeeper/waiter',
        label: 'Waiter & Cash Desk',
        children: docProducts
          .find((p) => p.id === 'waiter')!
          .scenarios.map((s) => ({ href: s.href, label: s.short ?? s.label })),
      },
    ],
  },
  {
    label: 'Кейсы месяца',
    items: [{ href: '/docs/cases', label: 'Разбор обращений' }],
  },
];
