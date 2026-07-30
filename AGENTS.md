# Конвенции для AI-агентов

## hydration errors

Браузерные расширения (SoftphonePro, Grammarly и т.д.) могут модифицировать DOM до гидрации React, вызывая ошибку `Hydration failed because the server rendered HTML didn't match the client`.

**Нельзя:**
- Использовать `suppressHydrationWarning`
- Использовать `if (typeof window !== 'undefined')`
- Использовать `if (typeof window !== 'undefined')` в JSX
- Писать `useEffect(() => setMounted(true), [])` — лишний re-render

**Надо:**
- Вынести проблемный элемент в клиентский компонент
- Использовать `useSyncExternalStore` для определения гидрации:
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
- Пример: `src/components/PhoneLink.tsx`

## команды

- `npm run dev` — запуск dev-сервера frontend
- `npm run lint` — линтинг
- `npm run typecheck` — проверка типов
