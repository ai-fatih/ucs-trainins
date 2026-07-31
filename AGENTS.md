# Конвенции для AI-агентов

## документация

- Индекс всех документов проекта: `docs/README.md` (архитектура, UX, точки касания, реестр функционала, стандарты, правовые).
- Перед работой над фичей смотреть `docs/touchpoints.md` и `docs/feature-inventory.md` — там правила входов/выходов и статусы модулей.
- При изменении навигации или точек входа/выхода экрана — обновлять `docs/touchpoints.md` и `docs/ux-navigation-architecture.md` в том же PR.
- Варианты дизайна на согласование — в `design-vars/`; открывать через `design-vars/index.html` (не коммитить незавершённые варианты без карточки в index).

## design vars

- `design-vars/` — HTML-прототипы и варианты дизайна для согласования, **не** часть рантайма приложения.
- Палитра/градиенты: blue `#1a56db` → teal `#0d9488`, тёмный фон hero `#0f172a`, текст `#111827/#374151/#6b7280`, glass-карточки.

## hydration errors

Браузерные расширения (SoftphonePro, Grammarly и т.д.) могут модифицировать DOM до гидрации React, вызывая ошибку `Hydration failed because the server rendered HTML didn't match the client`.

**Нельзя:**
- Использовать `suppressHydrationWarning`
- Использовать `if (typeof window !== 'undefined')`
- Использовать `if (typeof window !== 'undefined')` в JSX
- Писать `useEffect(() => setMounted(true), [])` — лишний re-render

**Надо:**
- Вынести проблемный элемент в клиентский компонент
- Использовать общий хук `useHydrated` из `src/lib/hooks/useHydrated.ts` (`useSyncExternalStore`):
```tsx
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,    // клиент
    () => false,   // сервер
  );
}
```
- На сервере рендерить невидимый placeholder (с теми же размерами, `opacity-0 pointer-events-none`), на клиенте — реальный элемент
- **Серверный placeholder не должен содержать матчабельные цифры** (например, номер телефона): расширения вроде SoftphonePro переписывают их на `<a class="softphonepro_phone">` до гидрации → mismatch + каскад `NotFoundError: insertBefore/removeChild` при клиентской навигации. В placeholder рендерить маску (`+7 (•••) •••-••-••`), реальный контент — только после гидрации.
- Примеры: `src/components/PhoneLink.tsx`, `src/components/ContactPhone.tsx`

## команды

- `npm run dev` — запуск dev-сервера frontend
- `npm run lint` — линтинг
- `npm run typecheck` — проверка типов
