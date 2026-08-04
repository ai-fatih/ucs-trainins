# Ядро контента: трёхзвенная модель «Обращение → Инструкция → Школа»

> Обновление 04.08.2026. Ядро публичного контура — три связанных звена, замкнутых в петлю обучения. Здесь — матрица, поток данных и схема сущностей.

## Принцип

Каждый популярный запрос пользователя проходит путь из трёх уровней детализации:

1. **Обращение** — краткая витрина (что спрашивали, сколько раз). Никакой воды, только суть.
2. **Инструкция** — полный процесс (как решить шаг за шагом, типовые ошибки). Вечная база знаний.
3. **Школа** — практика (тренажёр на реальном кейсе). Закрепление.

Петля замкнутая: слабые места из практики → новые инструкции → новые запросы месяца.

## Сущности и ключи

| Звено | Сущность | Ключи связки |
|-------|----------|--------------|
| Обращение | `YearlyCase` (`data/cases/yearly.json`) | `instructionId`, `courseId`, `lessonId`, `id` |
| Инструкция | `Instruction` (`data/instructions.json`) | `sourceCaseIds[]`, `courseId`, `lessonId`, `id` |
| Школа | урок курса (`data/school/courses.json`) | `id` (совпадает с `lessonId`), `decisionTreeId` |

Матрица: `обращение.instructionId → инструкция.id`; `инструкция.lessonId → урок курса`; `обращение.courseId/lessonId → урок школы`. Обратная связь — сущность не хранит ссылок, но «обидное» обращение становится источником новой инструкции.

## Поток данных

```
data/cases/yearly.json (год + 12 месяцев, count/planned)
   │  ├──> /faq            (год: сетка месяцев + мини-бары + топ-темы)
   │  ├──> /faq/[month]    (итоги месяца + поиск + карточки)
   │  └──> /faq/[month]/[caseId]  (краткая карточка + 2 экшена)
   │         ├──> /docs/[instructionId]  (полная инструкция-процесс)
   │         └──> /school/courses/[courseId]/lessons/[lessonId]  (тренажёр)
   │
data/instructions.json → /docs (индекс) → /docs/[id]
data/school/courses.json → /school/** → урок ([[decisionTreeId] ↔ обращение])
```

## Файлы данных

- `src/data/cases/yearly.json` — год: `months[]` c `count`, `planned`, `summary`, `cases[]` (кратко: `id/title/product/tags/count/instructionId/courseId/lessonId`).
- `src/data/instructions.json` — база знаний: `steps[]`, `commonErrors[]`, `sourceCaseIds[]`, `courseId`, `lessonId`.
- `src/data/school/courses.json` — школа (без изменений, источник «уроков-тренажёров»).

## Связанные документы

- Маршруты и точки касания — `docs/touchpoints.md`, `docs/ux-navigation-architecture.md`.
- Реестр функционала — `docs/feature-inventory.md`.
- Структура страниц — `docs/ux-page-inventory.md`.