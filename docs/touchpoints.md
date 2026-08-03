# Точки касания — вход и выход

Правила для экранов и модалок: где пользователь входит, куда выходит, что требует авторизации, какие действия доступны.

Статусы: ✅ реализовано · ⚠️ частично/заглушка · 🔧 в разработке

---

## Правила

1. **Каждый экран отвечает на 4 вопроса:** «Где я?» (breadcrumbs), «Откуда пришёл?» (назад), «Куда дальше?» (CTA), «Что ещё доступно?» (контекстная навигация).
2. **Выход на мёртвую страницу запрещён** — у каждого экрана есть хотя бы один выход (назад или на главную). См. `ux-navigation-architecture.md` §5.
3. **Авторизация:** маршруты `/dashboard`, `/booking`, `/bookings`, `/chat`, `/profile`, `/settings`, `/notifications`, `/review` доступны только авторизованным. Гостя редиректит на `/auth/login?redirect=…` (центральный `AuthRouter`, см. `auth-redirects.md`); на лендинге для гостя доступен `AuthModal`. **`/school/*` открыт гостям** (информационно-обучающий контур, см. `brief-public-phase.md`).
4. **Гостевые действия:** лендинг, документация, услуги, специалисты, заявка (`/request`), feedback — без авторизации.
5. **Изменение навигации/точек входа** — согласуется с этой схемой и `ux-navigation-architecture.md`, иначе появляются «разрывы» (страницы, на которые нет ссылок).

---

## Сквозные элементы (на всех страницах)

| Элемент | Компонент | Вход/действие | Выход |
|---------|-----------|---------------|-------|
| **Header** | `components/layout/Header.tsx` | Лого → `/`; табы секции (зависят от маршрута, из `navigation.json`); поиск (`SidebarSearch`); колокол → `NotificationsDropdown` (дропдаун, «Все уведомления» → `/notifications`); аватар → дропдаун [Профиль `/profile`, Настройки `/settings`, Выход → `/`]; «Личный кабинет» → `AuthModal` | Внутри страниц |
| **AuthRouter** | `components/layout/AuthRouter.tsx` | Центральный клиентский guard: редиректы по матрице `lib/auth/route-access.ts` (гость/клиент/staff × роут) | — |
| **NotificationsDropdown** | `components/layout/NotificationsDropdown.tsx` | Колокол → панель последних уведомлений (mock-заглушка), «Прочитать все», «Все уведомления» | По клику вне/Escape/смене маршрута |
| **Footer** | `components/layout/Footer.tsx` | Ссылки на `/docs`, `/services`, `/school`, `/terms`, `/privacy`, `/offer`, `/consent` | — |
| **Сайдбар (mobile)** | `components/layout/SidebarLeft.tsx` | Кнопка меню в header → раскрывает группы из `navigation.json` | По клику на ссылку |
| **Кнопки снизу** | `components/layout/BottomActionBar.tsx` | Чат-плавающая кнопка → `ChatWidget`; микрофон → `VoiceAssistantModal` | Закрытие виджета/модалки |
| **Чат-виджет** | `components/layout/ChatWidget.tsx` | Быстрые ответы, офлайн-сообщение | Кнопка закрытия |
| **Голосовой ассистент** | `components/voice/*` | Микрофон → модалка, распознавание/синтез речи | Закрытие |
| **PhoneLink** | `components/PhoneLink.tsx` | Телефон отдела | Гидрация-безопасный tel-контакт |
| **CookieBanner** | `components/layout/CookieBanner.tsx` | Согласие на cookies | Кнопка «Принять» |

---

## Гость (лендинг, документация, услуги)

| Точка | Вход | Выход | Auth | Статус |
|-------|------|-------|------|--------|
| **`/` Лендинг** | Прямой вход, поисковик, реклама | Hero → `/request`, `/booking`; блоки → `/docs`, `/services`, `/school`; «Написать в чат» → `ChatWidget`; контакты → mailto/tel. **Авторизованный** → редирект на `/dashboard` (staff → `/admin/dashboard`) | нет | ✅ |
| **`/docs` Каталог** | Лендинг, header | → `/docs/rkeeper/{product}`, → `/docs/cases` | нет | ✅ |
| **`/docs/rkeeper/{product}`** | `/docs` | → детальные инструкции → prev/next → назад | нет | ✅ |
| **`/docs/cases` Кейсы месяца** | `/docs`, header (таб «Кейсы месяца»), лендинг | → `/docs/cases/[id]`, → `/school/courses/cases-2026-07` | нет | ✅ |
| **`/docs/cases/[id]`** | `/docs/cases` | → назад к кейсам, → тренажёр по кейсу (`/school/courses/cases-2026-07/lessons/…`) | нет | ✅ |
| **`/services` Услуги** | Лендинг, header | → `/booking?serviceId=X`, → `/specialists` | нет | ✅ |
| **`/specialists` Специалисты** | Footer, header (раздел «Услуги») | → `/booking?specialistId=X` | нет | ✅ |
| **`/request` Заявка** | Footer, Hero-CTA лендинга | → `/` (успех) | нет | ✅ |
| **`/feedback/[token]`** | Email/ссылка от менеджера | → экран «Спасибо» | нет (внешний) | ✅ |
| **`/terms`, `/privacy`, `/offer`, `/consent`** | Footer, формы | → «← Вернуться на сайт» | нет | ✅ |
| **`/school` Школа** | Лендинг, header (таб Школа) | → `/school/courses`, `/school/leaderboard`, `/school/badges`, `/school/certificates`, `/school/profile`, `/school/notifications` | нет | ✅ |
| **`/school/courses`** | `/school` | → `/school/courses/[id]` | нет | ✅ |
| **`/school/courses/[id]`** | `/school/courses` | → `/school/courses/[id]/lessons/[lid]`, → `/booking?topic=` (CTA по теме) | нет | ✅ |
| **`/school/courses/[id]/lessons/[lid]`** | Деталь курса | → следующий урок, → назад к курсу, → `/booking?topic=` (консультация по теме) | нет | ✅ |
| **`/school/leaderboard`**, **`/school/badges`**, **`/school/certificates`**, **`/school/profile`**, **`/school/notifications`** | `/school` | → `/school` (демо-данные, прогресс хранится локально) | нет | ✅ |

> Входы на `/specialists` и `/request` добавлены в footer и лендинг (Hero-CTA). Header-табы для `/services`, `/bookings`, `/chat`, `/profile`, `/notifications` — починены (совпадение секции по headerNav).

---

## Авторизация

| Точка | Вход | Выход | Статус |
|-------|------|-------|--------|
| **`/auth/login`** | Кнопка «Личный кабинет» в header (AuthModal), `/auth/register`, редирект с защищённых роутов (`?redirect=`) | → `?redirect=` (возврат на защищённый роут) или → `/dashboard` (staff → `/admin/dashboard`), → `/auth/register` | ✅ |
| **`/auth/register`** | `/auth/login`, AuthModal | → `?redirect=` или → `/dashboard` (после регистрации) | ✅ |
| **`/admin/login`** | Прямой вход, middleware-редирект с `/admin/*` (`?redirect=`) | → `?redirect=` или → `/admin/requests` | ✅ |

> После входа/регистрации пользователь попадает на персональный дашборд (или возвращается на защищённый роут, с которого его выкинуло). Полная матрица редиректов — `docs/auth-redirects.md`. Защищённые роуты для гостей: `/booking`, `/bookings`, `/chat`, `/profile`, `/settings`, `/notifications`, `/review`, `/dashboard`.

---

## Авторизованный пользователь

> Информационно-обучающая фаза (см. `brief-public-phase.md`): ЛК-роуты ниже — **заглушки «Скоро»** (компонент `ui/ComingSoon`), полная реализация сохранена в ветке `main-arhive` и вернётся после одобрения/API. Авторизация остаётся активной (фunnel: гостя выкидывает на логин).

| Точка | Вход | Выход | Auth | Статус |
|-------|------|-------|------|--------|
| **`/dashboard`** | После логина (login/register → дашборд), лендинг-редирект | «Скоро» | да | ⚠️ заглушка |
| **`/booking`** | `/services`, `/dashboard`, `/specialists`, школа (CTA по теме) | «Скоро» | да | ⚠️ заглушка |
| **`/bookings`** | `/dashboard`, header (таб «Записи») | «Скоро» | да | ⚠️ заглушка |
| **`/chat`** | Header (таб «Чат») | «Скоро» | да | ⚠️ заглушка |
| **`/chat/[id]`** | `/chat`, `/bookings` | «Скоро» | да | ⚠️ заглушка |
| **`/review`** | `/bookings` (completed) | «Скоро» | да | ⚠️ заглушка |
| **`/profile`** | Header (дропдаун «Профиль», таб «Профиль») | «Скоро» | да | ⚠️ заглушка |
| **`/settings`** | Header (дропдаун «Настройки») | «Скоро» | да | ⚠️ заглушка |
| **`/notifications`** | Header (колокол, таб «Уведомления»), `/profile` | «Скоро» | да | ⚠️ заглушка |

---

## Staff / Admin

| Точка | Вход | Выход | Auth | Статус |
|-------|------|-------|------|--------|
| **`/admin/login`** | Прямой вход | → `/admin/requests` | staff | ✅ |
| **`/admin/dashboard`** | Header (аватар staff), таб KPI | → `/admin/requests`, `/admin/requests/[id]`, `/admin/services`, `/admin/specialists`, `/admin/schedule` | staff | ✅ |
| **`/admin/requests`** | `/admin/dashboard`, таб «Заявки» | → `/admin/requests/[id]` | staff | ✅ |
| **`/admin/requests/[id]`** | `/admin/requests` | → `/admin/requests`, генерация feedback-ссылки | staff | ✅ |
| **`/admin/services`** | Header (таб «Услуги»), дашборд | CRUD каталога услуг (mock) | staff | ✅ |
| **`/admin/specialists`** | Header (таб «Специалисты»), дашборд | CRUD специалистов (mock) | staff | ✅ |
| **`/admin/schedule`** | Header (таб «Расписание»), дашборд | Переключение доступности слотов | staff | ✅ |

---

## Проблемы (сводно)

1. **Информационно-обучающая фаза:** ЛК-роуты (`/dashboard`, `/booking`, `/bookings`, `/chat`, `/profile`, `/settings`, `/notifications`, `/review`) — заглушки «Скоро» (`ui/ComingSoon`), уведомления и школьные данные — демо-мок/localStorage. Полная реализация (ЛК, запись, чат, отзывы, TipModal) в ветке `main-arhive` и вернётся после одобрения/API. Уведомления — дропдаун-заглушка (`data/notifications.json`).

> Ранее выявленные разрывы (нет входа на `/specialists`, `/request`, `/chat`, `/notifications`; мёртвые юр. страницы; `/admin/schedule`; выбор специалиста в визарде `/booking`; календарь-заглушка; read-only страницы школы; связь «урок → консультация по теме»; отмена/перенос записей; Event-документация; специалист в `/review`; TipModal; чат-виджет) — **закрыты** в этом батче.

Подробная инвентаризация всех страниц — `docs/ux-page-inventory.md`.
