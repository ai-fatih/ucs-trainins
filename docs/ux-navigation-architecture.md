# Navigation Architecture — UCS Service Portal

> **Текущая фаза — информационно-обучающий портал без ЛК** (см. `docs/brief-public-phase.md`). Открыты `/docs`, `/docs/cases`, `/school/*`; ЛК-роуты (`/dashboard`, `/booking`, `/bookings`, `/chat`, `/profile`, `/settings`, `/notifications`, `/review`) — заглушки «Скоро» (`ui/ComingSoon`). Полная реализация сохранена в ветке `main-arhive`.

## Принцип навигации

Каждая страница должна отвечать на 4 вопроса:
1. **Где я?** — breadcrumbs + заголовок
2. **Откуда я пришёл?** — ссылка "назад"
3. **Куда идти дальше?** — CTA или links
4. **Что ещё доступно?** — контекстная навигация (хедер/сайдбар)

---

## 1. Header — контекстная навигация

### Лендинг (`/`)
```
UCS service | О нас | Документация | Услуги | Школа | Новости | Отзывы | 🔍 | 👤
```
> Авторизованный пользователь на `/` сразу редиректится в личный кабинет: `/dashboard` (staff → `/admin/dashboard`). Все редиректы — в едином конфиге `lib/auth/route-access.ts` + центральном guard `components/layout/AuthRouter.tsx` (см. `docs/auth-redirects.md`): клиентский `router.replace()`, только после гидрации (`useHydrated`) — SSR-контент лендинга для SEO не ломается, циклов при «Назад» нет.

### Документация (`/docs/*`)
```
UCS service | Каталог | r_keeper 7 | StoreHouse | Delivery | Event | Waiter | Кейсы месяца | 🔍 | 🔔 | 👤
```

### Школа (`/school/*`) — публична
```
UCS service | Главная | Курсы | Рейтинг | Бейджи | Сертификаты | 🔍 | 🔔 | 👤
```
> `/school/*` — public (без авторизации), демо-данные, прогресс хранится в localStorage. См. `docs/touchpoints.md` и `docs/brief-public-phase.md`.

### Услуги (`/services`, `/specialists`, `/request`)
```
UCS service | Каталог услуг | Специалисты | Оставить заявку | 🔍 | 🔔 | 👤
```
> Раздел «Услуги» ведёт на публичные `/services`, `/specialists`, `/request`. `/booking` и `/bookings` — заглушки «Скоро» (`ui/ComingSoon`), CTA из школы по теме по-прежнему ведёт на `/booking?topic=` (funnel авторизации).

### Дашборд / Профиль / Чат — заглушки «Скоро»
```
UCS service | 🔍 | 🔔 | 👤
```
> ЛК-роуты (`/dashboard`, `/booking`, `/bookings`, `/chat`, `/profile`, `/settings`, `/notifications`, `/review`) — заглушки «Скоро» (`ui/ComingSoon`); полная реализация в ветке `main-arhive`. Клик по аватару/имени открывает дропдаун: **Профиль** (`/profile`) · **Настройки** (`/settings`) · **Выход** (logout → `/`). Колокол → дропдаун уведомлений (`NotificationsDropdown`, заглушка) + «Все уведомления» → `/notifications`. Закрытие по клику вне, Escape и смене маршрута.

### Admin (`/admin/*`)
```
UCS service | KPI | Заявки | Услуги | Специалисты | Расписание | 🔍 | 🔔 | 👤
```

> Табы показываются только у staff. Расписание восстановлено (mock: переключение доступности слотов), добавлены CRUD-разделы «Услуги» и «Специалисты» (mock, in-memory).

---

## 2. Cross-links — недостающие связи

### Добавить в `page.tsx` (landing)
| Элемент | Ссылка | Действие |
|---------|--------|----------|
| Блок "Школа" CTA | `/school` | Уже есть ✅ |
| Блок "Документация" CTA | `/docs` | Уже есть ✅ |
| Блок "Услуги" CTA | `/booking` | Уже есть ✅ |
| "Записаться на консультацию" (Hero) | `/booking` | Добавить |
| "Оставить заявку" (Hero) | `/request` | Добавить |

### Добавить в `dashboard/page.tsx`
| Элемент | Ссылка | Действие |
|---------|--------|----------|
| Виджет "Продолжить обучение" | `/school/courses` | Добавить |
| Виджет "Ближайшая консультация" | `/bookings` | Уже есть ✅ |
| Виджет "Мои записи" | `/bookings` | Уже есть ✅ |
| Виджет "Чат" | `/chat` | Уже есть ✅ |

### Добавить в `school/courses/[id]/page.tsx`
| Элемент | Ссылка | Действие |
|---------|--------|----------|
| "Записаться на консультацию" | `/booking?topic=...` | Добавить |
| "Вернуться к курсам" | `/school/courses` | Добавить |

### Добавить в `bookings/page.tsx`
| Элемент | Ссылка | Действие |
|---------|--------|----------|
| Completed → "Оставить отзыв" | `/review?bookingId=X` | Добавить |
| Completed → "Отблагодарить" | TipModal | Уже есть ✅ |
| Scheduled → "Открыть чат" | `/chat/[id]` | Уже есть ✅ |

### Добавить в `services/page.tsx`
| Элемент | Ссылка | Действие |
|---------|--------|----------|
| Ссылка на специалистов | `/specialists` | Добавить |

### Кейсы месяца ↔ тренажёр (публичный контур)
| Откуда | Ссылка | Куда |
|--------|--------|------|
| `/docs` (блок «Кейсы месяца») | `/docs/cases` | хаб кейсов |
| `/docs/cases` | `/school/courses/cases-2026-07` | курс-тренажёр |
| `/docs/cases/[id]` | `/school/courses/cases-2026-07/lessons/{trainerLessonId}` | урок по кейсу |
| урок кейса | `/booking?topic=…` | CTA консультации (funnel) |

---

## 3. Breadcrumbs — единый формат

### Текущая реализация (Breadcrumbs.tsx)
- Автоматически генерируется из URL-path
- Использует `routeLabels` из navigation.json
- Скрывает динамические сегменты (`[id]`, `[lid]`, `[token]`)

### Нужно улучшить
1. Добавить "Главная" (🏠) как первую крошку для всех страниц кроме `/`
2. Добавить breadcrumbs на юридические страницы
3. Убедиться, что все `routeLabels` обновлены (docs вместо instructions)

### Добавить labels в navigation.json
```json
{
  "docs": "Документация",
  "specialists": "Специалисты",
  "review": "Отзыв",
  "request": "Заявка"
}
```

---

## 4. Navigation JSON — структура

### Текущая структура sections (публичный контур)
```json
[
  { id: "home", label: "Главная", href: "/" },
  { id: "docs", label: "Документация", href: "/docs", groups: [..., { label: "Кейсы месяца", items: ["/docs/cases"] }], headerNav: [..., "/docs/cases"] },
  { id: "services", label: "Услуги", href: "/services", headerNav: ["/services", "/specialists", "/request"] },
  { id: "school", label: "Школа", href: "/school", headerNav: [...] }
]
```
> Секция «Личный кабинет» (`dashboard`) убрана — ЛК-роуты заглушены «Скоро» и вернутся с `main-arhive` после одобрения/API.

### Предлагаемая структура (без sidebar, для header)
```json
[
  { id: "home", label: "Главная", href: "/", headerNav: [...] },
  { id: "docs", label: "Документация", href: "/docs", headerNav: [...] },
  { id: "services", label: "Услуги", href: "/booking", headerNav: [...] },
  { id: "school", label: "Школа", href: "/school", headerNav: [...] },
  { id: "dashboard", label: "Личный кабинет", href: "/dashboard", headerNav: [...] }
]
```

---

## 5. "Мёртвые" страницы — добавить навигацию

| Страница | Добавить | Формат |
|----------|----------|--------|
| `/terms` | "← Вернуться на сайт" ссылка вверху | `<Link href="/">← На главную</Link>` |
| `/privacy` | "← Вернуться на сайт" ссылка вверху | Аналогично |
| `/offer` | "← Вернуться на сайт" ссылка вверху | Аналогично |
| `/consent` | Закрывать по крестику (если модалка) | Или "← Назад" |
| `/school/certificates` | Ссылки на скачивание + "← Назад в школу" | `<Link href="/school">← Школа</Link>` |
| `/school/profile` | Ссылка на редактирование + "← Назад" | `<Link href="/school">← Школа</Link>` |
| `/school/notifications` | "← Назад в школу" + пометить "прочитанным" | `<Link href="/school">← Школа</Link>` |
| `/notifications` | "← Назад к профилю" | `<Link href="/profile">← Профиль</Link>` |
| `/admin/schedule` | Реализован (mock) | ✅ переключение доступности слотов |
| `/specialists` | Ссылка из `/services` и из `/booking` | Добавить |
| `/request` | Ссылка из Hero блока лендинга | Добавить |

---

## 6. Приоритет реализации

Статусы: ✅ сделано · 🔧 в работе · ⏳ не начато

| # | Задача | Сложность | Страниц | Статус |
|---|--------|-----------|---------|--------|
| 1 | Cross-links: dashboard ↔ school | Малая | 2 | ✅ виджет «Продолжить обучение» на `/dashboard` |
| 2 | Cross-links: school/courses ↔ booking | Малая | 2 | ✅ CTA «Записаться на консультацию» на детали курса |
| 3 | "Назад" ссылки на мёртвых страницах | Малая | 7 | ✅ юр. страницы, `/notifications`, школа |
| 4 | Header навигация для /services, /dashboard | Средняя | 3 | ✅ починено (совпадение по headerNav, см. §1) |
| 5 | Breadcrumbs: "Главная" + обновить labels | Малая | 2 | ✅ «Главная» добавлена, routeLabels обновлены |
| 6 | Удалить admin/schedule | Малая | 1 | ✅ роут удалён ранее, затем восстановлен как mock |
| 7 | Выбор специалиста в booking | Средняя | 1 | ✅ шаг «Специалист» в визарде, пресет из `/specialists`, фильтр слотов по специалисту |
| 8 | Связь register → dashboard вместо / | Малая | 1 | ✅ register/login → `/dashboard` (staff → `/admin/dashboard`) |
| 9 | Добавить ссылки на specialists и request | Малая | 2 | ✅ `/specialists` в footer + header; `/request` в footer, Hero-CTA |
| 10 | Header навигация для admin | Средняя | 3 | ✅ KPI / Заявки / Услуги / Специалисты / Расписание (staff) |

**Примечания к реализации:**

- **Header §1:** секция выбирается по самому длинному совпавшему URL (href раздела **+** его `headerNav`), поэтому табы корректно показываются на `/services`, `/bookings`, `/chat`, `/profile`, `/notifications`, `/school/*`. Логика в `components/layout/Header.tsx`.
- **Admin header:** у staff на `/admin/*` показываются табы `KPI` (`/admin/dashboard`), `Заявки` (`/admin/requests`), `Услуги` (`/admin/services`), `Специалисты` (`/admin/specialists`), `Расписание` (`/admin/schedule`).
- **Дашборд-секция headerNav:** добавлен таб «Уведомления» → `/notifications` (`src/data/navigation.json`).
- **Booking §7:** визард теперь 4 шага (Услуга → Специалист → Дата и время → Подтверждение). `specialistId` из URL пресетит специалиста без перехода шага; слоты фильтруются по выбранному специалисту; `specialistId`/`specialistName` уходят в `POST /bookings`. `src/stores/booking.ts` (actions `setSelectedSpecialist`/`selectSpecialist`), `src/app/booking/page.tsx`, `src/data/slots.json` (слоты добавлены для всех 5 специалистов).
- **Связь школа↔консультации:** CTA «Записаться на консультацию по теме» на детали курса и на странице урока → `/booking?topic=<курс>` (тема пресетится в шаге подтверждения визарда; сейчас `/booking` — заглушка, гостя выкидывает на логин).
- **Публичный контур (2026-08):** `/school/*` — public (`route-access.ts`); раздел «Кейсы месяца» (`/docs/cases`, `/docs/cases/[id]`) + курс-тренажёр `cases-2026-07`; терминальные шаги деревьев решений в `LessonView` — generic (шаг без `choices` = финал). ЛК-роуты заглушены `ui/ComingSoon`, секция `dashboard` убрана из `navigation.json`.
- **Отзыв (`/review`):** вход из `/bookings` (completed) со ссылкой `/review?bookingId=`. Специалист, услуга и дата берутся из записи; отзыв сохраняется (rating/feedbackCompleted в `mock-db`, localStorage).
- **Осталось (backend):** авторизация (мок→JWT), чат (мок→backend), защита от double-booking, ITSM-вход, реальные чаевые (НетМонет/СберЧаевые), Telegram/SMS, аналитика.

**Итого:** ~20 файлов затронуто, большинство — малые правки (ссылки/навигация).
