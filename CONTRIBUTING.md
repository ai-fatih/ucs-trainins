# Правила проекта UCS-Training

## Участники

| Имя | Роль | Зона ответственности |
|------|------|---------------------|
| **Fatih** | Фронтенд | `apps/frontend/*` |
| **Amir** | Бэкенд | `apps/backend/*` |

> Не трогать чужую часть без запроса. Рекомендации — через PR-комментарии или Issues.

---

## Технологии (строго)

| Слой | Технология | Заметки |
|------|-----------|---------|
| Frontend | Next.js 16 | `proxy.ts` — НЕ `middleware.ts` |
| Состояние (сервер) | React Query | Кэширование, фоновые обновления |
| Состояние (клиент) | Zustand | `persist` для auth |
| Стили | Tailwind CSS | Шрифт Manrope (Google Fonts) |
| Бэкенд | NestJS | REST API |
| ORM | Prisma | PostgreSQL |
| Auth | JWT + httpOnly cookie | `CookieAuthGuard` |

---

## Процесс работы

```
1. Создай Issue с описанием задачи
2. Створи ветку от main:
   - fatikhov/* — для Fatih
   - codex/* — для Amir
3. Делаю задачу, проверяю tsc + lint
4. Коммичу с описанием (см. формат ниже)
5. Пушу: git push origin fatikhov/... или codex/...
6. Создаю PR в main
7. Ревью от второго участника
8. Мерж в main
```

### Формат коммитов

```
feat: добавить компонент Avatar с загрузкой фото
fix: исправить отображение аватаров на мобилке
refactor: заменить моки на React Query в bookings
chore: обновить CONTRIBUTING.md
docs: добавить архитектурную схему
style: исправить отступы в api.ts
test: добавить тест для auth guard
```

### Ветки

| Ветка | Назначение |
|-------|-----------|
| `main` | Стабильная, всегда рабочая |
| `fatikhov/*` | Задачи Fatih (фронтенд) |
| `codex/*` | Задачи Amir (бэкенд) |
| `feature/*` | Совместные фичи |

---

## Границы ответственности

| Зона | Кто отвечает | Кто может трогать |
|------|-------------|-------------------|
| `apps/frontend/*` | Fatih | Только Fatih |
| `apps/backend/*` | Amir | Только Amir |
| `package.json` (root) | Оба | Через PR |
| `docs/*` | Оба | Через PR |
| `.github/*` | Оба | Через PR |
| `CONTRIBUTING.md` | Оба | Через PR |

> Если нужна правка в чужой зоне — создай Issue с просьбой или напиши в PR-комментарии.

---

## Чек-лист перед коммитом

- [ ] `npx tsc --noEmit` — без ошибок
- [ ] `npm run lint` — без ошибок
- [ ] Не осталось `console.log`
- [ ] Не осталось закоммиченных секретов
- [ ] Хорошее описание коммита
- [ ] Нет лишних импортов

---

## GitHub Workflow

### Issues
- Используй шаблоны (Bug / Feature)
- Ставь label: `frontend`, `backend`, `bug`, `enhancement`, `docs`
- Привязывай к ветке и PR

### Pull Requests
- Заполняй шаблон PR
- Указывай связанные Issues
- Ревью от второго участника перед мержем

### CI (GitHub Actions)
- PR автоматически проверяется: lint, typecheck, build
- Если проверка не прошла — мержить нельзя

### Projects
- Kanban-доска: Backlog → In Progress → In Review → Done
- Двигай задачи по колонкам

---

## Дизайн-система (фронтенд)

| Элемент | Значение |
|---------|----------|
| Primary | `#1a56db` (синий) |
| Accent | `#0d9488` (бирюзовый) |
| Success | `#059669` |
| Warning | `#d97706` |
| Danger | `#dc2626` |
| Black | `#111827` |
| Light bg | `#e8effa` |
| Шрифт | Manrope |
| Компоненты | `src/components/ui/` |

---

## Полезные команды

```bash
# Проверка типов
npx tsc --noEmit

# Линтер
npm run lint

# Сборка фронтенда
npm run build:frontend

# Сборка бэкенда
npm run build:backend

# Запуск фронтенда
npm run dev:frontend

# Запуск бэкенда
npm run dev:backend

# Все проверки
npm run typecheck && npm run lint
```
