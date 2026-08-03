export type PageHelpEntry = {
  title: string;
  description: string;
  status: 'done' | 'partial' | 'planned';
  features: string[];
  planned?: string[];
};

export const pageHelp: Record<string, PageHelpEntry> = {
  '/': {
    title: 'Главная — центр портала',
    description:
      'Отсюда проще всего попасть в нужный раздел: документация, школа и кейсы месяца. Слева — коротко о том, чем занимается отдел, справа — главные разделы.',
    status: 'done',
    features: [
      'Поиск по всему сайту — кнопка вверху или Ctrl + 5',
      'Горячие клавиши: 1 — документация, 2 — школа, 3 — кейсы',
      'Контакты отдела — внизу сайта',
    ],
  },
  '/docs': {
    title: 'Документация',
    description:
      'Инструкции и пошаговые руководства по программам r_keeper: как настроить, как работать, как решить типовые задачи.',
    status: 'done',
    features: [
      'Дерево документации слева — быстрый переход между разделами',
      'Инструкции по 5 продуктам: r_keeper 7, StoreHouse, Delivery, Event, Waiter',
      'Кейсы месяца — разборы реальных обращений',
    ],
  },
  '/docs/product': {
    title: 'Раздел продукта',
    description:
      'Инструкции по конкретной программе r_keeper. Выберите сценарий, чтобы открыть пошаговое руководство.',
    status: 'done',
    features: [
      'Сценарии работы с программой',
      'Встроенный поиск по инструкциям',
      'Навигация по документации — в дереве слева',
    ],
  },
  '/docs/cases': {
    title: 'Кейсы месяца',
    description:
      'Разборы реальных обращений: что случилось, почему это произошло и как избежать в будущем.',
    status: 'done',
    features: ['Разборы по единому шаблону', 'Связь с обучающими тренажёрами'],
  },
  '/school': {
    title: 'Школа — тренажёр',
    description:
      'Учишься, решая реальные кейсы: шаг за шагом, с подсказками и опытом (XP). Никакой скучной теории — всё открыто без регистрации.',
    status: 'done',
    features: [
      'Тренажёры: квизы, сопоставления, деревья решений',
      'Прогресс и опыт (XP) сохраняются на этом устройстве',
      'Раздел «Скоро» — ближайшие курсы',
    ],
    planned: ['Персональная программа обучения', 'Сертификаты по итогам курса'],
  },
  '/school/courses': {
    title: 'Каталог курсов',
    description: 'Все доступные курсы. Выберите курс, чтобы увидеть модули и уроки.',
    status: 'done',
    features: ['Открытые курсы без регистрации'],
  },
  '/course': {
    title: 'Страница курса',
    description:
      'Структура курса: модули и уроки. Пройденные уроки отмечаются автоматически, прогресс сохраняется на этом устройстве.',
    status: 'done',
    features: ['Прогресс по модулям', 'Кнопка «Продолжить урок»'],
  },
  '/lesson': {
    title: 'Урок',
    description:
      'Материал и задания по теме. В конце урока кнопка «Завершить» — она отметит урок пройденным.',
    status: 'done',
    features: ['Текст и задания', 'Завершение урока сохраняется'],
  },
};

export function getPageHelp(pathname: string): PageHelpEntry | null {
  if (pageHelp[pathname]) return pageHelp[pathname];
  if (pathname.startsWith('/docs/cases/')) return pageHelp['/docs/cases'];
  if (pathname.startsWith('/docs/rkeeper')) return pageHelp['/docs/product'];
  if (pathname.includes('/lessons/')) return pageHelp['/lesson'];
  if (pathname.startsWith('/school/courses/')) return pageHelp['/course'];
  return null;
}
