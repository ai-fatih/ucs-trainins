# Архитектура UCS Trainings

## Компоненты

```text
Browser
  ├── Next.js frontend (apps/frontend, Vercel)
  └── REST ──> NestJS backend (apps/backend) — health-only: GET /health
```

Frontend и backend запускаются и деплоятся отдельно. Next.js не содержит Route Handlers бизнес-API. Backend свёрнут до health-эндпоинта: заявки, feedback и consent удалены вместе с Prisma-модулем. Авторизация и админка в текущем контуре **удалены** (информационно-обучающий портал без ЛК, см. `docs/brief-public-phase.md`).

## Frontend

`apps/frontend` использует App Router. Бэкенд-запросов нет — frontend полностью статичен и работает на JSON-каталогах из `src/data`. PWA-сервис воркер кеширует контент `/school/**` и `/docs/**` (NetworkFirst) для офлайн-доступа.

Маршруты:

- `/` — лендинг: полноэкранный Hero-хаб (0 скролла, CTA → `/docs`/`/school`);
- `/docs`, `/docs/rkeeper/{product}`, `/docs/cases`, `/docs/cases/[id]` — документация и кейсы месяца;
- `/school`, `/school/courses`, `/school/courses/[id]`, `/school/courses/[id]/lessons/[lid]` — открытая школа (без персонализации и сохранения прогресса);
- `/terms`, `/privacy`, `/offer`, `/consent` — правовые страницы.

Все маршруты публичные, авторизация отсутствует.

## Backend REST API

`apps/backend` — NestJS приложение, сведённое к `GET /health` (AppModule + HealthController). Сохранены глобальный `ThrottlerGuard` (rate limiting), helmet, CORS по `FRONTEND_URL` и Pino-логирование.

Endpoints:

- `GET /health` — статус приложения.

## Prisma

Schema находится в `apps/backend/prisma/schema.prisma` и остаётся в репозитории **без миграций**. Модели `AdminUser` и `AuditLog` не используются в текущем контуре.

## Будущая ITSM-интеграция

ITSM сейчас не реализуется. В будущем она добавляется отдельным backend-модулем и адаптером, чтобы REST-контракт frontend и внутренняя модель заявок не зависели от провайдера. Credentials ITSM никогда не передаются frontend.

Telegram, MAX, r_keeper, email, чат, оплата, SMS, аналитика и CRM в текущую архитектуру не добавляются.
