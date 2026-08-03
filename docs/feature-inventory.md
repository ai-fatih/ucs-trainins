# Реестр функционала (Feature Inventory)

> **Текущая фаза — информационно-обучающий портал без ЛК** (см. `docs/brief-public-phase.md`). Открыты `/docs`, `/docs/cases`, `/school/*`. ЛК-модули ниже (`запись`, `чат`, `отзывы`, `профиль`, `уведомления`) — **заглушки «Скоро»** (`ui/ComingSoon`); полная реализация сохранена в ветке `main-arhive` и вернётся после одобрения/API.

Реестр реализованного и планируемого функционала по модулям. Формат:

| Фича | Компонент/файл | Данные | Статус |

Статусы: ✅ готово · ⚠️ частично / заглушка · 🔧 в разработке · ⏳ roadmap

---

## Инфраструктура приложения

| Фича | Компонент/файл | Данные | Статус |
|------|----------------|--------|--------|
| Next.js 14 App Router + React 18 | `apps/frontend/src/app/**` | — | ✅ |
| PWA (service worker, precaching) | `apps/frontend` (@serwist/next) | — | ✅ |
| Публичная форма заявки (`POST /requests`) | `apps/backend` (RequestsModule) | Prisma | ✅ |
| Админка: вход, список, карточка, статусы | `apps/backend` (AuthModule, RequestsModule) | Prisma | ✅ |
| Feedback по одноразовому token | `apps/backend` (FeedbackModule) | Prisma | ✅ |
| 152-ФЗ compliance (privacy, consent, оферта, cookie) | Страницы + ConsentModule | Prisma | ✅ |
| Аудит действий администраторов | `apps/backend` (AuditModule) | Prisma | ✅ |
| Rate limiting, helmet, CORS, Pino | `apps/backend` (main.ts) | — | ✅ |

---

## Layout и навигация

| Фича | Компонент/файл | Данные | Статус |
|------|----------------|--------|--------|
| Header (контекстные табы) | `components/layout/Header.tsx` | `data/navigation.json` | ✅ |
| Header-табы admin (KPI / Заявки) | `components/layout/Header.tsx` | — | ✅ |
| Дропдаун пользователя (Профиль/Настройки/Выход) | `components/layout/Header.tsx` | `stores/auth.ts` | ✅ |
| Дропдаун уведомлений | `components/layout/NotificationsDropdown.tsx` | `data/notifications.json`, `stores/notifications.ts` | ⚠️ заглушка (mock) |
| Footer | `components/layout/Footer.tsx` | — | ✅ |
| Mobile-сайдбар | `components/layout/SidebarLeft.tsx` | `data/navigation.json` | ✅ |
| Breadcrumbs (с «Главная») | `components/layout/Breadcrumbs.tsx` | `navigation.json` (routeLabels) | ✅ |
| Поиск | `components/layout/SidebarSearch.tsx` | mock | ✅ |
| Кнопки снизу (чат + голос) | `components/layout/BottomActionBar.tsx` | — | ✅ |
| Чат-виджет (быстрые ответы) | `components/layout/ChatWidget.tsx` | mock | ✅ |
| Cookie-banner | `components/layout/CookieBanner.tsx` | localStorage | ✅ |
| Установка PWA (beforeinstallprompt) | `Header.tsx` | — | ✅ |
| Hydration-безопасный телефон | `components/PhoneLink.tsx` | mock | ✅ |
| Route tracker / прелоадер | `RouteTracker.tsx`, `PreloaderCleanup.tsx` | — | ✅ |

---

## Голосовой помощник (Voice UI)

| Фича | Компонент/файл | Данные | Статус |
|------|----------------|--------|--------|
| Плавающая кнопка с микрофоном | `components/voice/VoiceFloatingButton.tsx` | `stores/voice.ts` | ✅ |
| Модалка голосового ассистента | `components/voice/VoiceAssistantModal.tsx` | `stores/voice.ts` | ✅ |
| Распознавание речи (Web Speech API) | `hooks/useSpeechRecognition.ts` | — | ✅ |
| Синтез речи | `hooks/useSpeechSynthesis.ts` | — | ✅ |
| Команды голосом | `data/voice-commands.ts` | — | ✅ 10 команд, все пути существуют |

---

## Авторизация

| Фича | Компонент/файл | Данные | Статус |
|------|----------------|--------|--------|
| Регистрация (физлицо) | `app/auth/register/page.tsx` | mock (Zustand `auth.ts`) | 🔧 мок → backend |
| Вход (email/пароль) | `app/auth/login/page.tsx` | mock | 🔧 мок → backend |
| Редирект после входа/регистрации | register/login → `?redirect=` или дашборд роли; staff → `/admin/dashboard` | — | ✅ |
| Центральный guard редиректов (матрица роутов) | `components/layout/AuthRouter.tsx` + `lib/auth/route-access.ts` | localStorage `ucs-auth` | ✅ защищает `/booking`, `/bookings`, `/chat`, `/profile`, `/settings`, `/notifications`, `/review`, `/dashboard`; лендинг и `/auth/*` — guest-only; `/school/*` — public |
| Middleware `/admin/*` (cookie) | `src/proxy.ts` | cookie `ucs-auth` (backend) | ✅ `/admin/login` public, гость → `/admin/login?redirect=` |
| AuthModal (гостевые действия) | `components/auth/AuthModal.tsx` | — | ✅ |
| JWT httpOnly cookie (backend) | `apps/backend` (AuthModule) | Prisma `AdminUser` | ✅ (только staff) |
| Вход юрлица через ITSM | — | — | ⏳ ITSM-интеграция |

---

## Лендинг (`/`)

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Hero (split-layout, карточки предстоящих) | `app/page.tsx` | mock (даты) | ✅ |
| About + карусель специалистов | `app/page.tsx` (`EmployeeCarousel`) | `api.specialists.list` | ✅ |
| Документация (превью 5 продуктов + featured r_keeper 7) | `app/page.tsx` | `docProducts` | ✅ |
| Услуги (категории, буллеты, CTA) | `app/page.tsx` | `data/service-categories.json` | ✅ |
| Школа (статистика + 3 карточки) | `app/page.tsx` | `schoolCards` | ✅ |
| Новости | `app/page.tsx` | `data/news.json` | ✅ |
| Отзывы (carousel) | `app/page.tsx` (`ReviewsCarousel`) | `data/reviews.json` | ✅ |
| FAQ (accordion) | `app/page.tsx` (`FAQSection`) | `data/faq.json` | ✅ |
| CTA «Записаться» в Hero | `app/page.tsx` | → `/booking` | ✅ |
| CTA «Оставить заявку» в Hero | `app/page.tsx` | → `/request` | ✅ |

---

## Документация (`/docs/*`)

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Каталог продуктов | `app/docs/page.tsx` | — | ✅ |
| r_keeper 7 — сценарии + 3 инструкции | `app/docs/rkeeper/rk7/*` | — | ✅ |
| StoreHouse — сценарии + 3 инструкции | `app/docs/rkeeper/storehouse/*` | — | ✅ |
| Delivery — сценарии + 3 инструкции | `app/docs/rkeeper/delivery/*` | — | ✅ |
| Waiter — сценарии + 3 инструкции | `app/docs/rkeeper/waiter/*` | — | ✅ |
| Event | `app/docs/rkeeper/event/*` | — | ✅ сценарии + 3 инструкции |
| Prev/next между инструкциями | страницы инструкций | — | ✅ |
| Кейсы месяца — хаб + деталь | `app/docs/cases/page.tsx`, `app/docs/cases/[id]/page.tsx` | `data/cases/monthly.json` | ✅ шаблон «ситуация → симптомы → диагностика → причина → решение → профилактика»; вход из `/docs`, header-таб «Кейсы месяца» |
| Кейсы месяца → тренажёр | страницы кейсов | `data/school/courses.json` (`cases-2026-07`) | ✅ CTA на курс/урок по кейсу (`trainerLessonId` ↔ `decisionTreeId`) |

---

## Услуги и запись

> ⚠️ Информационная фаза: `/booking` и `/bookings` — заглушки «Скоро» (`ui/ComingSoon`). Каталог и специалисты публичны; публичный сбор обращений — `/request` (backend). Полная реализация записи вернётся из `main-arhive`.

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Каталог услуг | `app/services/page.tsx` | `data/service-categories.json`, `data/services.json` | ✅ |
| Специалисты (вход: footer + header) | `app/specialists/page.tsx` | `data/specialists.json` / API | ✅ |
| Визард записи (4 шага) | `app/booking/page.tsx` | `stores/booking.ts`, `data/slots.json` | ⚠️ заглушка «Скоро» (реализация в `main-arhive`) |
| Мои записи | `app/bookings/page.tsx` | `data/bookings.json` | ⚠️ заглушка «Скоро» |
| Отмена / перенос / история | `app/bookings/page.tsx` | mock | ⚠️ заглушка «Скоро» |
| Защита от double-booking | — | — | ⏳ |
| Чаевые (TipModal) | `components/features/TipModal.tsx` | `lib/tips/storage.ts` (localStorage) | ⚠️ заглушка «Скоро» (мок-квитанция; оплата НетМонет/СберЧаевые — backend) |
| Опрос качества | `components/features/QualitySurveyModal.tsx` | `lib/feedback/storage.ts` (localStorage) | ⚠️ заглушка «Скоро» |
| Публичная заявка на консультацию | `app/request/page.tsx` | backend `POST /requests` | ✅ без авторизации |

---

## Чат

> ⚠️ Информационная фаза: `/chat` и `/chat/[id]` — заглушки «Скоро» (`ui/ComingSoon`). Реализация в `main-arhive`, вернётся после одобрения/API.

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Список чатов | `app/chat/page.tsx` | `data/chats.json` | ⚠️ заглушка «Скоро» |
| Чат с менеджером (сообщения, файлы) | `app/chat/[id]/page.tsx` | mock | ⚠️ заглушка «Скоро» |
| Чат-виджет на лендинге | `components/layout/ChatWidget.tsx` | mock | ✅ выбор специалиста, ключевые ответы с ссылками |

---

## Отзывы

> ⚠️ Информационная фаза: `/review` — заглушка «Скоро» (`ui/ComingSoon`). Реализация в `main-arhive`.

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Отзыв после консультации | `app/review/page.tsx` | mock (специалист из записи `?bookingId=`) | ⚠️ заглушка «Скоро» |
| Feedback по внешней ссылке | `app/feedback/[token]/page.tsx` | Prisma (backend) | ✅ |
| Оценки и рейтинг | `data/reviews.json` | — | ✅ (mock) |

---

## Школа (геймификация)

> ✅ Публичный модуль без авторизации (`/school/*` — public, `route-access.ts`). Прогресс хранится в localStorage (`lib/school/storage.ts`), демо-данные помечены «Демо-режим».

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Дашборд школы (XP, уровень, streak, рейтинг) | `app/school/page.tsx` | `lib/school/storage.ts` | ✅ |
| Мои курсы | `app/school/courses/page.tsx` | mock | ✅ |
| Деталь курса (модули/уроки) | `app/school/courses/[id]/page.tsx` | mock | ✅ |
| Урок (завершение, +XP) | `app/school/courses/[id]/lessons/[lid]/page.tsx` | `lib/school/storage.ts` | ✅ |
| Курс-тренажёр по кейсам месяца | `app/school/courses/[id]/lessons/[lid]/page.tsx` | `data/school/courses.json` (`cases-2026-07`), `data/cases/monthly.json` | ✅ деревья решений `c1`/`c2`, терминальный шаг = generic (без `choices`) |
| Рейтинг | `app/school/leaderboard/page.tsx` | mock | ✅ демо-пометка |
| Бейджи | `app/school/badges/page.tsx` | mock | ✅ |
| Сертификаты (скачать/печать, поделиться) | `app/school/certificates/page.tsx` | `lib/school/storage.ts` | ✅ |
| Профиль школы (редактирование) | `app/school/profile/page.tsx` | `lib/school/storage.ts` (localStorage) | ✅ демо-пометка «прогресс на устройстве» |
| Уведомления школы (лента, прочитано, удаление) | `app/school/notifications/page.tsx` | `stores/notifications.ts` | ✅ |
| Мини-игра «Bubble» (Phaser 3) | `games/tracker/bubble/**` | `data/games-config.json` | ✅ |
| Результаты игр | `components/games/ArenaResult.tsx`, `TrainResult.tsx` | `lib/games/storage.ts` | ✅ |

---

## Профиль и уведомления

> ⚠️ Информационная фаза: `/profile`, `/settings`, `/notifications` — заглушки «Скоро» (`ui/ComingSoon`). Реализация в `main-arhive`.

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Профиль (данные, сотрудники компании, экспорт/удаление) | `app/profile/page.tsx` | mock | ⚠️ заглушка «Скоро» |
| Настройки | `app/settings/page.tsx` | — | ⚠️ заглушка «Скоро» |
| Настройки уведомлений (каналы/события) | `app/notifications/page.tsx` | `data/notification-channels.json`, `data/notification-events.json` | ⚠️ заглушка «Скоро» |
| Уведомления (email, in-app) | `stores/notifications.ts` | mock (`data/notifications.json`) | ⚠️ заглушка: бейдж + дропдаун |
| Telegram/SMS | — | — | ⏳ post-MVP |

---

## Админка (staff)

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Вход staff | `app/admin/login/page.tsx` | Prisma (backend) | ✅ |
| Дашборд KPI | `app/admin/dashboard/page.tsx` | `data/admin-stats.json` | ✅ |
| Список заявок | `app/admin/requests/page.tsx` | Prisma (backend) | ✅ |
| Карточка заявки (статусы, комментарии, feedback-ссылка) | `app/admin/requests/[id]/page.tsx` | Prisma (backend) | ✅ |
| Расписание | `app/admin/schedule/page.tsx` | mock (переключение доступности слотов) | ✅ |
| CRUD услуг | `app/admin/services/page.tsx` | mock (in-memory) | ✅ |
| CRUD специалистов | `app/admin/specialists/page.tsx` | mock (in-memory) | ✅ |
| Управление расписанием | `app/admin/schedule/page.tsx` | mock | ✅ |

---

## UI-кит

| Компонент | Файл |
|-----------|------|
| Button, Badge, Card, Input, Modal, Tabs, Skeleton, Avatar, Stars, PrefetchLink | `components/ui/*` |
| Дизайн-варианты для согласования | `design-vars/**` |

---

## Ключевые сквозные связи (todo)

См. `ux-user-flows.md` → «Сквозные связи». Статусы:

1. ✅ `dashboard ↔ school` (виджет «Продолжить обучение»)
2. ✅ `school/courses/[id] → /booking` (CTA на консультацию)
3. ✅ Выбор специалиста в визарде `/booking`
4. ✅ После регистрации/входа → `/dashboard` (staff → `/admin/dashboard`)
5. ✅ Входы на `/specialists`, `/request`, `/chat` из навигации
6. ✅ «Назад» на мёртвых страницах (юр., школа, `/notifications`)
7. ✅ Урок/курс школы → `/booking?topic=...` (консультация по теме)
8. ✅ `docs/cases/[id]` → урок-тренажёр по кейсу (курс `cases-2026-07`); `/docs` → «Кейсы месяца»
9. ✅ `/school/*` открыт гостям (public); ЛК-роуты — заглушки «Скоро»
