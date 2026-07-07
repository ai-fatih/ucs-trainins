# UCS Trainings

Проект состоит из независимого Next.js frontend и NestJS backend. Frontend отвечает за интерфейс, backend — за REST API, авторизацию, заявки, отзывы и доступ к PostgreSQL через Prisma.

## Структура

```text
apps/
├── frontend/   # Next.js 14, React, TypeScript
└── backend/    # NestJS, Prisma, PostgreSQL, REST API
docs/
├── architecture.md
└── project-audit.md
```

Корневой `package.json` объединяет приложения через npm workspaces.

## Требования и установка

- Node.js 20+;
- npm;
- PostgreSQL.

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
