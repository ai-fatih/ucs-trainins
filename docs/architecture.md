# Архитектура UCS Trainings

## Компоненты

```text
Browser
  ├── Next.js frontend (apps/frontend, Vercel)
  └── REST + httpOnly cookie ──> NestJS backend (apps/backend)
                                      └── Prisma ──> PostgreSQL
```

Frontend и backend запускаются и деплоятся отдельно. Next.js не содержит Route Handlers бизнес-API. Авторизация, заявки, комментарии, история и отзывы реализованы в NestJS.

## Frontend

`apps/frontend` использует App Router. Все новые страницы обращаются к backend через `src/lib/api-client.ts`; URL задаётся переменной `NEXT_PUBLIC_API_URL`, запросы отправляются с `credentials: include`.

Маршруты:

- `/request` — публичная форма заявки;
- `/admin/login` — вход администратора;
- `/admin/requests` — защищённый список;
- `/admin/requests/[id]` — защищённая карточка, статус, комментарии, история и feedback-ссылка;
- `/feedback/[token]` — публичная одноразовая форма отзыва.

JWT недоступен JavaScript и не хранится в localStorage. Frontend проверяет сессию через `GET /auth/me`, но окончательная защита каждого административного действия выполняется backend guard.

## Backend REST API

`apps/backend` — NestJS приложение. Глобальный `ValidationPipe` включает `whitelist`, `forbidNonWhitelisted` и преобразование типов.

Публичные endpoints:

- `GET /health`;
- `POST /auth/admin/login`;
- `POST /auth/admin/logout`;
- `POST /requests`;
- `GET /feedback/:token`;
- `POST /feedback/:token`.

Защищённые cookie guard endpoints:

- `GET /auth/me`;
- `GET /requests`;
- `GET /requests/:id`;
- `PATCH /requests/:id/status`;
- `POST /requests/:id/comments`;
- `POST /requests/:id/feedback-link`.

## PostgreSQL и Prisma

Schema находится в `apps/backend/prisma/schema.prisma` и содержит:

- `AdminUser` — email и bcrypt-хеш;
- `Request` — заявка и feedback;
- `RequestComment` — внутренние комментарии;
- `RequestHistory` — переходы статусов.

Статусы: `new`, `in_progress`, `done`, `rejected`. Типы услуг: `training`, `consultation`, `other`.

Номер заявки генерирует backend. Feedback token уникален и создаётся только защищённым административным endpoint.

## Авторизация

Seed создаёт администратора из env и хеширует пароль bcrypt с cost 12. Login подписывает JWT и устанавливает cookie с `httpOnly: true`, `sameSite: lax`, `secure: true` в production, `maxAge` семь дней и `path: /`.

Guard проверяет подпись JWT и существование администратора в БД. Без guard нельзя читать заявки, комментарии и историю или изменять заявку.

## Requests flow

1. Клиент отправляет разрешённые DTO-поля.
2. Backend отклоняет лишние и некорректные поля.
3. Backend генерирует номер, устанавливает `new` и создаёт первую запись истории.
4. Администратор получает список и карточку после cookie-auth.
5. Статус и история изменяются одной Prisma-транзакцией.
6. Внутренние комментарии не возвращаются публичному feedback API.

## Feedback flow

1. Администратор создаёт криптографически случайный token.
2. Публичный GET возвращает только номер, организацию, тему, статус и тип услуги.
3. POST принимает rating 1–5, необязательные text и customerName.
4. Условное обновление БД разрешает только первую отправку; повторная получает `409`.

## Будущая ITSM-интеграция

ITSM сейчас не реализуется. В будущем она добавляется отдельным backend-модулем и адаптером, чтобы REST-контракт frontend и внутренняя Request-модель не зависели от провайдера. Credentials ITSM никогда не передаются frontend.

Telegram, MAX, r_keeper, email, чат, оплата, SMS, аналитика и CRM в текущую архитектуру не добавляются.
