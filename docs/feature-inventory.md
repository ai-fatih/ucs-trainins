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
| Панель «Популярное · месяц» в hero (бар-чарт за 3 месяца, пилюли тем, топ-3, «Смотреть все →» `/faq`) | `components/hero/HeroStatsCard.tsx` | `data/cases/yearly.json` | ✅ |
| Тумблер темы на лендинге (светлые цвета иконки под тёмный hero) | `components/layout/ThemeToggle.tsx` | проп `onHero` | ✅ |

> Секции О нас/Документация/Школа, Услуги, Новости, Отзывы и FAQ с лендинга убраны; страница — server-компонент без `useQuery`, контент живёт на своих страницах (`/docs`, `/school`).

---

## Инструкции (`/docs/*`)

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Список инструкций-процессов (карточки: заголовок, описание, теги, число шагов) + карточки «Популярные обращения» (`/faq`) и «Официальная документация» (`docs.rkeeper.ru`, external) | `app/docs/page.tsx` | `data/instructions.json` | ✅ |
| Страница инструкции: TOC (`DocPageToolbar`, якоря `#steps`/`#step-N`/`#errors`) → шаги → типовые ошибки → «из каких обращений» (`/faq/2026-07/[caseId]`) → prev/next → CTA «Потренироваться в школе»; **все 67 инструкций — заглушки** (`stub`, блок «Скоро здесь будет инструкция»; шаги/ошибки очищены) | `app/docs/[id]/page.tsx` | `data/instructions.json`, `data/cases/yearly.json` | ⚠️ только заглушки |
| Сайдбар-дерево документации (desktop) + шторка (mobile) + поиск по дереву | `app/docs/layout.tsx` | `data/docs/catalog.ts` (из `instructions.json`) | ✅ |
| Примерные инструкции по продуктам (r_keeper 7 / StoreHouse / Delivery / Event / Waiter) | `app/docs/rkeeper/**` | — | 🗑 удалены (20 страниц) |
| Prev/next между инструкциями | `components/docs/InstructionPager.tsx` | — | 🗑 удалён (на странице — нативные prev/next) |
| Печать / экспорт в PDF инструкции (кнопка + `@media print` без сайдбара/шапки/футера) | `components/docs/PrintButton.tsx` + `globals.css` | — | ✅ |

## Популярные обращения (`/faq/*`)

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Годовой срез: блок текущего месяца (кол-во, дельта ▲/▼, топ-темы до 4, CTA «Потренироваться на кейсах» `/school/courses/{courseId}` + «Подробнее в инструкции» `/docs/[instructionId]` топ-кейса) + мини-чарт 12 месяцев | `app/faq/page.tsx`, `components/faq/FaqMonthChart.tsx` | `data/cases/yearly.json` | ✅ |
| Мини-чарт активности: бары по месяцам (текущий — градиент+glow, запланированные — серые), клик → `/faq/[month]`, легенда | `components/faq/FaqMonthChart.tsx` | `data/cases/yearly.json`, `lib/months.ts` | ✅ |
| Каталог «Все обращения»: кросс-месячный фильтр (категория/программа/диапазон месяцев), поиск, сортировка, состояние в URL (`?cat=&product=&from=&to=&q=&sort=`), плоский список с бейджами | `components/faq/FaqCatalog.tsx` | `data/cases/yearly.json`, `data/categories.ts`, `data/products.ts` | ✅ |
| Категории обращений (обязательные: Маркировка/ЧЗ, ЕГАИС, Ошибки, Номенклатура, Касса, Отчёты, Скидки, Выгрузка) + бейджи | `data/categories.ts`, `data/cases/yearly.json` (`category` в `YearlyCase`) | — | ✅ |
| Месяц: итоги (кол-во, топ-темы, дельта) + поиск (`?q=…`) + краткие карточки обращений + CTA к курсу-тренажёру | `app/faq/[month]/page.tsx` | `data/cases/yearly.json` | ✅ |
| Обращение: краткая карточка + 2 экшена («Читать инструкцию» `/docs/[instructionId]`, «Потренироваться в школе» `/school/courses/{courseId}/lessons/{lessonId}`) | `app/faq/[month]/[caseId]/page.tsx` | `data/cases/yearly.json`, `data/instructions.json` | ✅ |
| Редирект старых URL | `app/docs/cases/page.tsx`, `app/docs/cases/[id]/page.tsx` | — | ✅ `/docs/cases` → `/faq/2026-07`; `/docs/cases/[id]` → `/faq/2026-07/[id]` |
| Полный разбор (ситуация/диагностика/решение) — переехал в инструкции | `data/instructions.json` | — | ✅ `monthly.json` удалён |

---

## Школа (открытый каталог-тренажёр)

> ✅ Публичный модуль без авторизации и без персонализации. Все курсы открыты, уроки доступны без регистрации, прогресс **хранится локально** (localStorage, ключ `ucs_school_progress`, без backend). Геймификация (XP, уровни, стрейки, рейтинг, бейджи, сертификаты, мини-игры) и профиль школы **удалены**. Школа позиционируется как **тренажёр** («Школа — это тренажёр», кейсы вместо лекций).

> ⚠️ **Состояние контента:** реальный контент тренажёров удалён из репозитория (см. секцию «Контент тренажёров» ниже) — **все 92 урока в 13 курсах — заглушки** («Скоро вы сможете потренироваться здесь»). Статы на `/school` показывают 0/0/0 осознанно. Движок тренажёров (викторины, спринты, сопоставления, процедуры, кейсы) из `LessonView` удалён вместе с контентом; при наполнении — восстановить по описанию архитектуры в секции ниже.

| Фича | Файл | Данные | Статус |
|------|------|--------|--------|
| Школа-хаб: hero «тренажёр», статы (курсы/уроки/XP — **только реальные, без заглушек**; пока 0/0/0), блок «Скоро» | `app/school/page.tsx` | `data/school/courses.json` | ✅ |
| Список курсов (все 13 с бейджем «Скоро») | `app/school/courses/page.tsx` | `data/school/courses.json` | ✅ назад «В школу» |
| Деталь курса (skills «Чему научишься», модули/уроки, все открыты) | `app/school/courses/[id]/page.tsx` | `data/school/courses.json` | ✅ |
| Карточка курса: бейдж «Тренажёр» / «Скоро» (если все уроки — заглушки) + навыки «Научишься» | `components/school/CourseCard.tsx` | `courses.json` (`skills`, `Lesson.stub`) | ✅ сейчас все курсы → «Скоро» |
| Урок: все уроки `stub` → экран «🔜 Скоро вы сможете потренироваться здесь» (движок тренажёров удалён); защитная ветка для не-stub — «Тренажёр в разработке» | `app/school/courses/[id]/lessons/[lid]/page.tsx`, `components/school/LessonView.tsx` | `data/school/courses.json` | ⚠️ только заглушки |
| Прогресс обучения (localStorage, без ЛК) | `stores/schoolProgress.ts` + `components/school/SchoolProgressBridge.tsx` | localStorage `ucs_school_progress` | ✅ |
| Панель прогресса курса (бар %, «Продолжить урок», сброс) | `components/school/CourseProgressPanel.tsx` | store `schoolProgress` | ✅ |
| Отметка пройденных уроков в модулях курса + бейдж «скоро» у заглушек | `components/school/ModuleBlock.tsx` | store `schoolProgress`, `Lesson.stub` | ✅ |
| Баннер «Урок уже пройден» + переход к следующему | `app/school/courses/[id]/lessons/[lid]/page.tsx` | store `schoolProgress` | ✅ |
| Курсы-тренажёры по кейсам месяцев (`cases-2026-01…08`) и тематические курсы (rk7-basics, egais-accounting, storehouse-inventory, error-resolution, egaismatch): по уроку на каждый из 67 кейсов, все `stub` | `data/school/courses.json` | `data/cases/yearly.json` (courseId/lessonId у всех 67 кейсов) | ⚠️ заглушки — контент появится по мере наполнения |
| Фильтрация заглушек: статы `/school`, sitemap, поисковый индекс — только реальные уроки/курсы/инструкции (сейчас 0) | `app/school/page.tsx`, `app/sitemap.ts`, `data/search-index.ts` | флаги `stub` в `courses.json`/`instructions.json` | ✅ |
| Визуальная система карточек: hover-подъём только у ссылок (`a.glass-card:hover`), стрелка `→` на кликабельных карточках, некликабельные поверхности статичны | `globals.css` + карточки-ссылки (`FaqCatalog`, `FaqMonthSearch`, экшены кейса, `docs/page`, `not-found`, `CourseCard`) | — | ✅ |

### Контент тренажёров — как было устроено (удалён из репозитория)

> Реальный контент удалён по решению (этап наполнения ещё не начат). Архитектура сохранена для восстановления.

- **`data/school/config.json`** (удалён) — единый реестр контента движка:
  - `questions` (10) — квиз-вопросы: `{ id, question, options[], correct, commentary }`
  - `scenarios` (5) — процедуры «собери порядок шагов»: `{ id, title, steps[] }` (сценарии `s1`–`s4`)
  - `decisionTrees` (2) — кейсы-тренажёры: `{ id, title, startStep, steps[] }`, где шаг = `{ id, question, choices[] }`, choice = `{ text, correct, hint?, next? }`; терминальный шаг — generic (без `choices`) (деревья `c1`/`c2`)
  - `matchPairs` (14) — пары «термин → определение» для сопоставлений
  - `arena`, `trainer` — служебные секции
- **`data/school/match-groups.json`** (удалён) — группы пар для сопоставлений: `egais-core` (8), `egais-colors` (6), `storehouse-core` (6)
- **Типы уроков** (`LessonActivity` в `src/types/index.ts`, не удалены): `quiz` (→ `questionId`), `sprint` (→ `sprintQuestionIds[]`), `match` (→ `matchPairIds[]`), `chain` (→ `scenarioId`), `case` (→ `decisionTreeId`)
- **Движок** был в `components/school/LessonView.tsx` (удалён): диспетчер по `activity.type` + 5 подкомпонентов (`QuizLesson`, `SprintLesson`, `MatchLesson`, `ChainLesson`, `CaseLesson`); `shuffle` из `lib/utils`; прогресс завершался через `onComplete` → localStorage. При наполнении контента движок восстанавливается по этой схеме.

---

## Ключевые сквозные связи

1. ✅ Ядро «Обращение → Инструкция → Школа» закрыто для **всех 67 кейсов**: `/faq/[month]/[caseId]` → `/docs/[instructionId]` (Читать инструкцию) и `/school/courses/{courseId}/lessons/{lessonId}` (Потренироваться); каждый кейс имеет `instructionId` + `courseId` + `lessonId`; **весь контент — заглушки** (67/67 инструкций и 67/67 тренажёров: «скоро»); `docs/[id]` → «из каких обращений» `/faq/2026-07/[caseId]`
2. ✅ Урок школы → «Следующий урок» / «К курсу» / «В школу»; прогресс сохраняется локально (localStorage)
3. ✅ Все маршруты публичные: авторизация и редиректы отсутствуют; backend отдаёт только `/health`
4. ✅ Контент `/docs/**` и `/school/**` кешируется service worker (NetworkFirst) для офлайн-доступа
