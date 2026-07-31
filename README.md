# UCS Trainings

**Платформа бронирования консультаций и обучения по rkeeper.** Веб-приложение для отдела консультации и обучения пользовательской части rkeeper — автоматизация записи, коммуникации, оценки, обучения и аналитики.

Проект состоит из независимого Next.js frontend и NestJS backend. Frontend отвечает за интерфейс, backend — за REST API, авторизацию, заявки, отзывы и доступ к PostgreSQL через Prisma.

**Компания:** ООО ЦТО «ЮСИЭС сервис» (ОГРН 1037723040871, ИНН 7723347991)

---

## Миссия

> Помогать пользователям rkeeper **разобраться и научиться** работать с программой. Мы не настраиваем и не чиним — мы консультируем и обучаем. Наш результат — **пользователь, который умеет работать**, а не «система, которая настроена».

## Видение

Стать единой цифровой экосистемой для клиентов rkeeper, объединяющей **обучение** (школа с геймификацией), **консультации** (запись, чат, отзывы), **документацию** (инструкции по продуктам) и **аналитику** (дашборды).

## Цели и задачи

- **Автоматизация записи** — запись на консультации и тренинги в 3–5 кликов
- **Самообслуживание** — регистрация физлиц, авторизация юрлиц через ITSM
- **Коммуникация** — чат со специалистами, уведомления (email → Telegram/SMS)
- **Оценка качества** — feedback-ссылки и NPS
- **Обучение** — школа с курсами, геймификацией (XP, уровни, бейджи, рейтинг, сертификаты)
- **Документация** — каталог сценариев по всем продуктам rkeeper
- **Аналитика** — дашборды для клиентов и администраторов
- **Security & Compliance** — полное соответствие 152-ФЗ, 149-ФЗ, 242-ФЗ

## Ценности

| Ценность | Описание |
|----------|----------|
| **Помощь, а не техподдержка** | Консультируем и обучаем, а не настраиваем |
| **Пользователь в центре** | Результат = пользователь, который разобрался |
| **Простота** | Запись за 3–5 кликов, среднее время < 1 мин |
| **Прозрачность** | История записей, чатов, оценок; полный аудит |
| **Геймификация** | XP, уровни, бейджи, рейтинг — мотивация через игру |
| **Безопасность** | bcrypt, httpOnly cookies, CSP, HTTPS, rate limiting |
| **Compliance** | 152-ФЗ, 149-ФЗ, 242-ФЗ — полный цикл защиты ПДн |

## Целевая аудитория

| Роль | Описание |
|------|----------|
| **Гость** | Неавторизованный посетитель — лендинг, документация, услуги |
| **Сотрудник (физлицо)** | Индивидуальный пользователь, регистрация через сайт |
| **Компания (юрлицо)** | Авторизация через ITSM по договору, управление сотрудниками |
| **Специалист** | Сотрудник отдела UCS, проводит консультации и тренинги |
| **Администратор** | Полный доступ к управлению услугами, специалистами, заявками |

---

## Статус реализации

| Компонент | Статус | Описание |
|-----------|--------|----------|
| Публичная форма заявки | ✅ Backend | `POST /requests` |
| Админка: вход, заявки, карточка | ✅ Backend | JWT httpOnly cookie, статусы, комментарии |
| Feedback по одноразовому token | ✅ Backend | `GET/POST /feedback/:token` |
| 152-ФЗ Compliance | ✅ Внедрено | Privacy, consent, cookie-banner, оферта |
| Аудит-лог действий админа | ✅ Backend | `AdminAuditLog` модель |
| Регистрация/авторизация пользователей | 🔧 В разработке | Физлица + юрлица через ITSM |
| Каталог услуг и специалистов | 🔧 Frontend (моки) | Ожидает backend API |
| Бронирование (с double-booking) | 🔧 Frontend (моки) | Ожидает backend API |
| Чат со специалистами | 🔧 Frontend (моки) | Ожидает backend API |
| Отзывы | 🔧 Frontend (моки) | Ожидает backend API |
| Уведомления (email, in-app) | 🔧 Frontend (моки) | Ожидает backend API |
| Школа (геймификация, курсы) | 🔧 Frontend (моки) | Phaser.js мини-игры, XP, бейджи |
| Документация rkeeper | ✅ Frontend | Каталог сценариев и инструкций |
| Дашборды и аналитика | 🔧 Планируется | Admin + user dashboard |
| ITSM-интеграция | 🔧 Планируется | Авторизация юрлиц, синхронизация данных |

### Легенда статусов
- ✅ **Backend** — реализовано на сервере (NestJS + Prisma + PostgreSQL)
- ✅ **Frontend** — реализовано в UI (Next.js)
- 🔧 **Frontend (моки)** — UI готов, данные из статических JSON (ожидает backend API)
- 🔧 **Планируется** — в roadmap

---

## Структура проекта

```text
apps/
├── frontend/   # Next.js 14, React 18, TypeScript, Tailwind CSS
│   ├── src/
│   │   ├── app/           # Страницы App Router
│   │   ├── components/    # UI-компоненты и layout
│   │   ├── data/          # Статические JSON-данные (моки)
│   │   ├── lib/           # API-клиенты и утилиты
│   │   ├── stores/        # Zustand (auth, booking, notifications)
│   │   └── types/         # TypeScript-типы
│   └── service-worker/    # PWA service worker (@serwist)
└── backend/    # NestJS 11, Prisma, PostgreSQL, REST API
    ├── src/
    │   ├── auth/          # JWT авторизация, cookie guard
    │   ├── requests/      # Заявки, комментарии, история
    │   ├── feedback/      # Одноразовые feedback-ссылки
    │   ├── consent/       # Логирование согласий ПДн
    │   └── audit/         # Аудит действий администраторов
    └── prisma/
        ├── schema.prisma  # Модели данных
        └── seed.ts        # Seed администратора (bcrypt)
docs/           # Документация проекта
├── architecture.md
├── requirements.md
├── project-audit.md
├── backend-handoff.md
├── content-guide.md
├── project-overview.md
└── ... (legal, UX, SEO)
```

Корневой `package.json` объединяет приложения через npm workspaces.

---

## Технологический стек

| Компонент | Технология |
|-----------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| State | Zustand 5 + TanStack Query 5 |
| PWA | @serwist/next |
| Backend | NestJS 11, TypeScript |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| Auth | JWT (httpOnly cookie), bcryptjs (cost 12) |
| Validation | Zod (frontend) + class-validator (backend) |
| Security | Helmet, Throttler, CSP, CORS |
| Monitoring | Pino (logging), nestjs-pino |
| Gamification | Phaser.js 3 (мини-игры Школы) |

---

## Требования и установка

- Node.js 20+
- npm
- PostgreSQL

```bash
npm install
```

## Frontend env

Создайте `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Backend env

Создайте `apps/backend/.env` по образцу `apps/backend/.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ucs_trainings
DIRECT_URL=postgresql://user:password@localhost:5432/ucs_trainings
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
FRONTEND_URL=http://localhost:3000
PORT=4000
```

## PostgreSQL и Prisma

После создания базы и настройки env:

```bash
npm run prisma:generate --workspace=apps/backend
npm run prisma:migrate --workspace=apps/backend -- --name init
npm run prisma:seed --workspace=apps/backend
```

Seed создаёт администратора из `ADMIN_EMAIL` и `ADMIN_PASSWORD`. Пароль сохраняется только как bcrypt-хеш. Если администратор с таким email уже существует, дубль не создаётся.

Для production используются готовые миграции:

```bash
npm run prisma:deploy --workspace=apps/backend
```

## Локальный запуск

Frontend:

```bash
npm run dev:frontend
```

Backend:

```bash
npm run dev:backend
```

Проверка backend:

```bash
curl http://localhost:4000/health
```

Ожидаемый ответ: `{"status":"ok"}`.

## Рабочие сценарии

### Создание заявки

Откройте `http://localhost:3000/request`. Форма вызывает публичный `POST /requests`. Номер, статус `new` и служебные поля назначает backend; лишние поля отклоняются.

### Вход администратора

После Prisma seed откройте `http://localhost:3000/admin/login`. Успешный вход устанавливает JWT в httpOnly cookie на семь дней. Список заявок находится на `/admin/requests`, карточка — на `/admin/requests/[id]`.

Backend возвращает `401` без действующей cookie для списка и карточки заявок, изменения статуса, комментариев, истории и создания feedback-ссылки.

### Feedback flow

1. Администратор открывает карточку заявки и создаёт feedback-ссылку.
2. Backend генерирует token только при первом запросе.
3. Клиент открывает `/feedback/[token]`.
4. Клиент видит только номер заявки, организацию, тему, статус и тип услуги.
5. Форма принимает оценку 1–5, необязательный текст и имя.
6. Повторная отправка по token возвращает `409 Conflict`.

## Проверки

```bash
npm run typecheck
npm run build:frontend
npm run build:backend
```

## Деплой

Frontend деплоится на Vercel. Root Directory должен быть `apps/frontend`; `NEXT_PUBLIC_API_URL` должен содержать публичный HTTPS URL backend.

Backend деплоится отдельно на Node.js-платформу с доступом к PostgreSQL. В production задаются backend env и точный frontend origin в `FRONTEND_URL`. Для работы `sameSite: lax` cookie frontend и backend должны быть same-site (например, `app.example.com` и `api.example.com`) и использовать HTTPS.

## Документация

Индекс всей документации проекта — [`docs/README.md`](docs/README.md): архитектура, требования, UX (страницы, точки касания, сценарии), реестр функционала, стандарты, правовые документы.

**Живая база команды** (контент-план, решения, встречи, материалы для менеджеров/маркетинга) ведётся в Notion — ссылка будет добавлена по факту создания. Канонические документы живут в `docs/`.

## Правовые требования РФ — 2026

Проект обрабатывает персональные данные. Подробная документация по требованиям и плану внедрения:
- [`docs/legal-2026.md`](docs/legal-2026.md) — сводка требований, штрафы, нормативные акты
- [`docs/legal-2026-plan.md`](docs/legal-2026-plan.md) — план реализации со статусами и ссылками на файлы

### Статус внедрения

| № | Пункт | Статус | Где |
|---|-------|--------|-----|
| 1 | Политика конфиденциальности | ✅ | `/privacy`, ссылка в футере |
| 2 | Согласие на обработку ПДн — отд. документ | ✅ | `/consent`, ссылка в футере |
| 3 | Чекбокс на всех формах + тех. фиксация | ✅ | Все формы + `POST /consent` (backend) |
| 4 | Уведомление РКН | ⏳ | Подать через pd.rkn.gov.ru |
| 5 | Серверы / хостинг в РФ | 📄 | Зафиксировано в документации |
| 6 | HTTPS / TLS | ✅ | CSP (frontend) + helmet + throttler (backend) |
| 7 | Реквизиты (ОГРН, ИНН, адрес) | ✅ | Футер + privacy, terms, offer |
| 8 | Пользовательское соглашение | ✅ | `/terms`, ссылка в футере |
| 9 | Публичная оферта | ✅ | `/offer`, ссылка в футере |
| 10 | Сертификаты (546-ФЗ) | 🟡 Не применимо (только услуги) |
| 11 | Интерфейс на русском (168-ФЗ) | ✅ | Статусы, формы, cookie-баннер |
| 12 | Cookie-баннер на русском | ✅ | CookieBanner в layout.tsx |
| 13 | Ответственный за ПДн | ✅ | Мурзабеков Амир, school@ucs-service.ru |
