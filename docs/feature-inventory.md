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
| Header (контекстные табы) | `components/layout/Header.tsx` | `data/navigation.json` | ✅ |
| Footer | `components/layout/Footer.tsx` | — | ✅ |
| Breadcrumbs (с «Главная») | `components/layout/Breadcrumbs.tsx` | `navigation.json` (routeLabels) | ✅ |
| Поиск | `components/layout/SidebarSearch.tsx` | mock | ✅ |
| Cookie-banner | `components/layout/CookieBanner.tsx` | localStorage | ✅ |
| Установка PWA (beforeinstallprompt) | `Header.tsx` | — | ✅ |
| Hydration-безопасный телефон | `components/PhoneLink.tsx` | mock | ✅ |
| Route tracker | `components/layout/RouteTracker.tsx` | — | ✅ |

> Прелоадер и мобильная шторка-сайдбар удалены: на мобильных навигация — прокручиваемые табы header + ссылки footer.

---

## Лендинг (`/`)

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Hero (split-layout, CTA «В школу» и «Документация») | `app/page.tsx` | — | ✅ |
| Hero-хайлайты (Документация / Школа / Кейсы месяца) | `app/page.tsx` | — | ✅ |
| About (статистика + контакты, без карусели специалистов) | `app/page.tsx` | — | ✅ |
| Документация (превью 5 продуктов + featured r_keeper 7) | `app/page.tsx` | `docProducts` | ✅ |
| Школа (3 карточки: «Курсы», «Кейсы месяца», «База знаний») | `app/page.tsx` | `schoolCards` | ✅ |

> Секции Услуги, Новости, Отзывы и FAQ с лендинга убраны; страница — server-компонент без `useQuery`.

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

## Школа (открытый каталог курсов и уроков)

> ✅ Публичный модуль без авторизации и без персонализации. Все курсы открыты, уроки доступны без регистрации, прогресс **не сохраняется** (финальный экран урока без записи результата). Геймификация (XP, уровни, стрейки, рейтинг, бейджи, сертификаты, мини-игры) и профиль школы **удалены**.

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Каталог курсов (грид) | `app/school/page.tsx` | `data/school/courses.json` | ✅ |
| Список курсов | `app/school/courses/page.tsx` | `data/school/courses.json` | ✅ |
| Деталь курса (модули/уроки, все открыты) | `app/school/courses/[id]/page.tsx` | `data/school/courses.json` | ✅ |
| Урок (завершение без сохранения, финальный экран) | `app/school/courses/[id]/lessons/[lid]/page.tsx` | `data/school/courses.json`, `data/school/lessons/*` | ✅ квизы, спринты, сопоставление, цепочки, кейсы |
| Курс-тренажёр по кейсам месяца | `app/school/courses/[id]/lessons/[lid]/page.tsx` | `data/school/courses.json` (`cases-2026-07`), `data/cases/monthly.json` | ✅ деревья решений `c1`/`c2`, терминальный шаг = generic (без `choices`) |

---

## Ключевые сквозные связи

1. ✅ `docs/cases/[id]` → урок-тренажёр по кейсу (курс `cases-2026-07`); `/docs` → «Кейсы месяца»
2. ✅ Урок школы → «Следующий урок» / «К курсу» / «На главную» (без сохранения и без CTA на запись)
3. ✅ Все маршруты публичные: авторизация и редиректы отсутствуют; backend отдаёт только `/health`
4. ✅ Контент `/docs/**` и `/school/**` кешируется service worker (NetworkFirst) для офлайн-доступа
