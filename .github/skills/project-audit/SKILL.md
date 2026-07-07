---
name: Project Audit
description: Аудит проекта UCS-Training на дублирования, противоречия и архитектурные конфликты между фронтендом и бэкендом
---

# Skill: Project Audit

Используй этот скилл когда нужно проверить проект на консистентность между участниками.

## Шаг 1: Собери контекст

```bash
# Коммиты Fatih (фронтенд)
git log main..origin/fatikhov/* --oneline --name-only

# Коммиты Amir (бэкенд)
git log main..origin/codex/* --oneline --name-only

# Общая картина
git log --oneline -20
```

## Шаг 2: Проверь ключевые файлы

| Что проверить | Frontend (Fatih) | Backend (Amir) |
|---------------|------------------|----------------|
| API клиент | src/lib/api.ts | src/requests/requests.controller.ts |
| Auth | src/stores/auth.ts | src/auth/auth.service.ts |
| Типы | src/types/index.ts | prisma/schema.prisma |
| Статусы | BookingStatus в types | RequestStatus enum в Prisma |
| Данные | src/data/*.json | prisma/seed.ts |

## Шаг 3: Найди пересечения

**Вопросы для аудита:**
1. Есть ли сущности которые дублируются? (Request vs Booking)
2. API-клиенты: api.ts и api-client.ts — какой используется?
3. Auth: Zustand persist vs httpOnly cookie — не конфликтуют?
4. Env-переменные: совпадают между frontend и backend?
5. Типы: ServiceType на фронте = ServiceType на бэке?

## Шаг 4: Сравни статусы

```
Frontend (types/index.ts):
  BookingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled'

Backend (prisma/schema.prisma):
  RequestStatus = 'new' | 'in_progress' | 'done' | 'rejected'
```

**Если не совпадают** → ⚠️ ПРОТИВОРЕЧИЕ

## Шаг 5: Сформируй отчёт

Формат:
```
⚠️ [ТИП] Описание
Где: файлы
Что: проблема
Рекомендация: решение
```

Типы: ДУБЛИРОВАНИЕ | ПРОТИВОРЕЧИЕ | УСТАРЕЛО | АРХИТЕКТУРА | БЕЗОПАСНОСТЬ
