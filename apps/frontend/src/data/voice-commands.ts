export interface VoiceCommand {
  id: string;
  path: string;
  label: string;
  synonyms: string[];
  icon: string;
  hint: string;
  shortDescription: string;
}

export const VOICE_COMMANDS: VoiceCommand[] = [
  {
    id: 'booking',
    path: '/booking',
    label: 'Запись на консультацию',
    synonyms: [
      'запись',
      'записаться',
      'консультация',
      'записать',
      'записаться на консультацию',
    ],
    icon: 'CalendarCheck',
    hint: 'Записаться на обучение или консультацию',
    shortDescription:
      'Вы можете записаться на консультацию или обучение по работе с rkeeper. Доступны индивидуальные и групповые занятия.',
  },
  {
    id: 'courses',
    path: '/school/courses',
    label: 'Курсы обучения',
    synonyms: [
      'курсы',
      'обучение',
      'школа',
      'учиться',
      'программа обучения',
    ],
    icon: 'GraduationCap',
    hint: 'Посмотреть доступные курсы',
    shortDescription:
      'В школе доступны курсы: работа с меню и складом, отчёты и аналитика, маркировка товаров, кассовое обслуживание.',
  },
  {
    id: 'bookings',
    path: '/bookings',
    label: 'Мои записи',
    synonyms: ['мои записи', 'записи', 'мои брони', 'запись на консультацию'],
    icon: 'CalendarClock',
    hint: 'Посмотреть свои записи на консультации',
    shortDescription:
      'Здесь отображаются ваши записи на консультации и обучение: предстоящие, завершённые и отменённые. Можно перенести или отменить запись.',
  },
  {
    id: 'profile',
    path: '/profile',
    label: 'Профиль',
    synonyms: ['профиль', 'личный кабинет', 'мой профиль', 'аккаунт'],
    icon: 'UserCircle',
    hint: 'Перейти в профиль',
    shortDescription:
      'В профиле вы можете изменить личные данные, посмотреть историю записей и настроить уведомления.',
  },
  {
    id: 'chat',
    path: '/chat',
    label: 'Чаты',
    synonyms: ['чаты', 'сообщения', 'чат', 'мессенджер', 'написать'],
    icon: 'MessageCircle',
    hint: 'Открыть чаты с поддержкой',
    shortDescription:
      'Вы можете написать специалисту поддержки, задать вопрос по rkeeper или получить консультацию.',
  },
  {
    id: 'docs',
    path: '/docs/rkeeper/waiter',
    label: 'Документация',
    synonyms: [
      'документы',
      'документация',
      'доки',
      'инструкция',
      'помощь',
    ],
    icon: 'FileText',
    hint: 'Просмотреть документацию rkeeper',
    shortDescription:
      'В документации собраны инструкции: оформление заказов, работа с оплатами, управление сменами, работа со складом.',
  },
  {
    id: 'services',
    path: '/services',
    label: 'Услуги',
    synonyms: ['услуги', 'сервисы', 'что вы предлагаете'],
    icon: 'Briefcase',
    hint: 'Посмотреть услуги компании',
    shortDescription:
      'Мы предлагаем: консультации, обучение персонала, техническую поддержку rkeeper, настройку и интеграцию.',
  },
  {
    id: 'home',
    path: '/',
    label: 'Главная',
    synonyms: ['главная', 'на главную', 'домашняя', 'домой'],
    icon: 'Home',
    hint: 'Вернуться на главную страницу',
    shortDescription:
      'Главная страница с информацией о консультациях, обучении и последних новостях UCS Service.',
  },
  {
    id: 'notifications',
    path: '/notifications',
    label: 'Уведомления',
    synonyms: ['уведомления', 'оповещения', 'нотификации'],
    icon: 'Bell',
    hint: 'Посмотреть уведомления',
    shortDescription:
      'Здесь отображаются все уведомления: напоминания о записях, результаты обучения и сообщения от поддержки.',
  },
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Панель управления',
    synonyms: ['дашборд', 'панель управления'],
    icon: 'LayoutDashboard',
    hint: 'Открыть панель управления',
    shortDescription:
      'Панель управления показывает сводку: ближайшие записи, статусы заявок и активные обучения.',
  },
];

export const SYNONYM_MAP: Record<string, string> = {};

for (const cmd of VOICE_COMMANDS) {
  for (const syn of cmd.synonyms) {
    if (!SYNONYM_MAP[syn]) {
      SYNONYM_MAP[syn] = cmd.path;
    }
  }
}
