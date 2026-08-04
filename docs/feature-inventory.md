# Реестр функционала (Feature Inventory)

> **Текущая фаза — публичный информационно-обучающий портал без ЛК** (см. `docs/brief-public-phase.md`). Открыты `/`, `/docs/*`, `/school/*` и правовые страницы. Авторизация, админка, ЛК, услуги/специалисты/заявка, отзывы/новости/FAQ, голосовой ассистент и весь персонализированный слой школы (профиль, рейтинг, бейджи, сертификаты, уведомления, XP/уровни/стрейки) **удалены**. Backend свёрнут до `/health`. Удалённая реализация сохранена в ветке `main-arhive` и не возвращается в текущем контуре.

Реестр реализованного и планируемого функционала по модулям. Формат:

| Фича | Компонент/файл | Данные | Статус |

Статусы: ✅ готово · ⚠️ частично / заглушка · 🔧 в разработке · ⏳ roadmap

---

## Инфраструктура приложения

| Фича | Компонент/файл | Данные | Статус |
|------|----------------|--------|--------|
| Next.js App Router (server-компоненты) | `apps/frontend/src/app/**` | — | ✅ |
| PWA (service worker, precaching) | `apps/frontend` (@serwist/next) | — | ✅ |
| Offline-кеш контента (`/school/**`, `/docs/**`, NetworkFirst) | `service-worker/index.ts` | — | ✅ |
| Backend health-only (`GET /health`) | `apps/backend` (AppModule + HealthController) | — | ✅ |
| 152-ФЗ compliance (privacy, consent, оферта, cookie) | Страницы + CookieBanner | — | ✅ |
| Rate limiting, helmet, CORS, Pino | `apps/backend` (main.ts) | — | ✅ |

---

## Layout и навигация

| Фича | Компонент/файл | Данные | Статус |
|------|----------------|--------|--------|
| Header (табы топ-уровня «Инструкции»/«Школа»/«Популярное» → `/faq`, активный — самый длинный совпадающий `href`, + `aria-current`, hover-тултипы; на лендинге — оверлей поверх hero, светлые цвета) | `components/layout/Header.tsx` | — (секционные `headerNav` из `navigation.json` не используются) | ✅ |
| Footer (навигация + контакты) | `components/layout/Footer.tsx` | — | ✅ |
| Breadcrumbs (glass-капсула, скрытие `hiddenSegments`, `aria-current`) | `components/layout/Breadcrumbs.tsx` | `navigation.json` (routeLabels, hiddenSegments) | ✅ |
| Поиск (группировка по разделам) | `components/layout/SearchDialog.tsx` + `data/search-index.ts` | index страниц + курсов | ✅ |
| Тёмная/светлая тема (тумблер в Header, `ucs_theme`, сквозная через CSS-переопределения в `.dark`) | `components/layout/ThemeToggle.tsx` + `globals.css` + инлайн-script в layout | localStorage `ucs_theme` | ✅ |
| Горячие клавиши (`Ctrl + 5` — глобально; 1/2/3 — только лендинг) | `components/layout/Hotkeys.tsx` | `stores/ui.ts` (searchOpen) | ✅ (`Ctrl+K` и `/` убраны — конфликты с браузером) |
| Scroll-to-top при переходе | `components/layout/RouteTracker.tsx` | — | ✅ |
| Система подсказок: тултипы | `components/ui/Tooltip.tsx` | — | ✅ |
| Система подсказок: «Что здесь / что сделано» | `components/layout/PageHelp.tsx` + `data/help.ts` | реестр маршрутов/статусов | ✅ |
| Кастомная 404 | `app/not-found.tsx` | — | ✅ |
| Cookie-banner | `components/layout/CookieBanner.tsx` | localStorage | ✅ |
| Установка PWA (beforeinstallprompt) | `Header.tsx` | — | ✅ |
| Doc-центр `/docs/*`: сайдбар-дерево + поиск по дереву + мобильная шторка | `app/docs/layout.tsx` | `data/docs/catalog.ts` (список инструкций из `instructions.json`) | ✅ |
| Каталог контента | `data/docs/catalog.ts` | — | ✅ инструкции (продукты/сценарии удалены) |
| Route tracker | `components/layout/RouteTracker.tsx` | — | ✅ |

> Прелоадер, инлайн-поиск на `/docs` и секционные под-табы header удалены: навигация по документации — сайдбар-дерево doc-центра, поиск — единый `SearchDialog` на всех брейкпоинтах.

---

## Лендинг (`/`)

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Полноэкранный Hero-хаб (min-h-svh, 0 скролла, header фиксирован поверх): CTA «В школу» и «Инструкции» (с hover-тултипами) | `app/page.tsx` | — | ✅ |
| Панель «Популярное · месяц» в hero (вариант 07): июнь ‖ июль, дельта ▲, пилюли тем, топ-3, «Смотреть все →` `/faq` | `app/page.tsx` | `data/cases/yearly.json` | ✅ |
| Тумблер темы на лендинге (светлые цвета иконки под тёмный hero) | `components/layout/ThemeToggle.tsx` | проп `onHero` | ✅ |

> Секции О нас/Документация/Школа, Услуги, Новости, Отзывы и FAQ с лендинга убраны; страница — server-компонент без `useQuery`, контент живёт на своих страницах (`/docs`, `/school`).

---

## Инструкции (`/docs/*`)

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Список инструкций-процессов (карточки: заголовок, описание, теги, число шагов) + карточки «Популярные обращения» (`/faq`) и «Официальная документация» (`docs.rkeeper.ru`, external) | `app/docs/page.tsx` | `data/instructions.json` | ✅ |
| Страница инструкции: TOC (`DocPageToolbar`, якоря `#steps`/`#step-N`/`#errors`) → шаги → типовые ошибки → «из каких обращений» (`/faq/2026-07/[caseId]`) → prev/next → CTA «Потренироваться в школе» | `app/docs/[id]/page.tsx` | `data/instructions.json`, `data/cases/yearly.json` | ✅ |
| Сайдбар-дерево документации (desktop) + шторка (mobile) + поиск по дереву | `app/docs/layout.tsx` | `data/docs/catalog.ts` (из `instructions.json`) | ✅ |
| Примерные инструкции по продуктам (r_keeper 7 / StoreHouse / Delivery / Event / Waiter) | `app/docs/rkeeper/**` | — | 🗑 удалены (20 страниц) |
| Prev/next между инструкциями | `components/docs/InstructionPager.tsx` | — | 🗑 удалён (на странице — нативные prev/next) |
| Печать / экспорт в PDF инструкции (кнопка + `@media print` без сайдбара/шапки/футера) | `components/docs/PrintButton.tsx` + `globals.css` | — | ✅ |

## Популярные обращения (`/faq/*`)

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Годовой срез: итоги (обращений, топ-темы, дельта) + сетка 12 месяцев с мини-барами; текущий месяц выделен градиентом, заглушки — «запланировано» | `app/faq/page.tsx` | `data/cases/yearly.json` | ✅ |
| Месяц: итоги (кол-во, топ-темы, дельта) + поиск (`?q=…`) + краткие карточки обращений + CTA к курсу-тренажёру | `app/faq/[month]/page.tsx` | `data/cases/yearly.json` | ✅ |
| Обращение: краткая карточка + 2 экшена («Читать инструкцию» `/docs/[instructionId]`, «Потренироваться в школе» `/school/courses/{courseId}/lessons/{lessonId}`) | `app/faq/[month]/[caseId]/page.tsx` | `data/cases/yearly.json`, `data/instructions.json` | ✅ |
| Редирект старых URL | `app/docs/cases/page.tsx`, `app/docs/cases/[id]/page.tsx` | — | ✅ `/docs/cases` → `/faq/2026-07`; `/docs/cases/[id]` → `/faq/2026-07/[id]` |
| Полный разбор (ситуация/диагностика/решение) — переехал в инструкции | `data/instructions.json` | — | ✅ `monthly.json` удалён |

---

## Школа (открытый каталог-тренажёр)

> ✅ Публичный модуль без авторизации и без персонализации. Все курсы открыты, уроки доступны без регистрации, прогресс **хранится локально** (localStorage, ключ `ucs_school_progress`, без backend). Геймификация (XP, уровни, стрейки, рейтинг, бейджи, сертификаты, мини-игры) и профиль школы **удалены**. Школа позиционируется как **тренажёр** («Школа — это тренажёр», кейсы вместо лекций).

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Школа-хаб: hero «тренажёр», статы (курсы/уроки/XP), блок «Скоро» | `app/school/page.tsx` | `data/school/courses.json` | ✅ |
| Список курсов | `app/school/courses/page.tsx` | `data/school/courses.json` | ✅ назад «В школу» |
| Деталь курса (skills «Чему научишься», модули/уроки, все открыты) | `app/school/courses/[id]/page.tsx` | `data/school/courses.json` | ✅ |
| Карточка курса: бейдж «Тренажёр» + навыки «Научишься» | `components/school/CourseCard.tsx` | `courses.json` (`skills`) | ✅ |
| Урок (завершение сохраняется локально, финальный экран) | `app/school/courses/[id]/lessons/[lid]/page.tsx` | `data/school/courses.json`, `data/school/lessons/*` | ✅ квизы, спринты, сопоставление, цепочки, кейсы |
| Прогресс обучения (localStorage, без ЛК) | `stores/schoolProgress.ts` + `components/school/SchoolProgressBridge.tsx` | localStorage `ucs_school_progress` | ✅ |
| Панель прогресса курса (бар %, «Продолжить урок», сброс) | `components/school/CourseProgressPanel.tsx` | store `schoolProgress` | ✅ |
| Отметка пройденных уроков в модулях курса | `components/school/ModuleBlock.tsx` | store `schoolProgress` | ✅ |
| Баннер «Урок уже пройден» + переход к следующему | `app/school/courses/[id]/lessons/[lid]/page.tsx` | store `schoolProgress` | ✅ |
| Курс-тренажёр по кейсам месяца | `app/school/courses/[id]/lessons/[lid]/page.tsx` | `data/school/courses.json` (`cases-2026-07`) | ✅ деревья решений `c1`/`c2`, терминальный шаг = generic (без `choices`) |

---

## Ключевые сквозные связи

1. ✅ Ядро «Обращение → Инструкция → Школа»: `/faq/[month]/[caseId]` → `/docs/[instructionId]` (Читать инструкцию) и `/school/courses/{courseId}/lessons/{lessonId}` (Потренироваться); `docs/[id]` → «из каких обращений» `/faq/2026-07/[caseId]`
2. ✅ Урок школы → «Следующий урок» / «К курсу» / «В школу»; прогресс сохраняется локально (localStorage)
3. ✅ Все маршруты публичные: авторизация и редиректы отсутствуют; backend отдаёт только `/health`
4. ✅ Контент `/docs/**` и `/school/**` кешируется service worker (NetworkFirst) для офлайн-доступа
