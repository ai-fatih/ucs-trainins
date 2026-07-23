# Code Conventions

## Hydration — `<div>` inside `<Link>`

**Проблема:** Next.js Link рендерится как `<a>`. React Hydration требует строгого совпадения серверного и клиентского DOM. `<div>` (block) внутри `<a>` (inline) может вызывать:

```
Error: Hydration failed because the initial UI does not match
Expected server HTML to contain a matching <div> in <a>
```

**Решение:** Внутри `<Link>` использовать только inline-элементы:

```tsx
// ❌ Плохо — div внутри a
<Link href="/services">
  <div className="flex items-center gap-2">...</div>
</Link>

// ✅ Хорошо — span вместо div
<Link href="/services">
  <span className="flex items-center gap-2">...</span>
</Link>
```

**Исключения:** Иконки из `lucide-react` рендерятся как `<svg>`, текстовые ноды — допустимы.

**Проверка:** `git grep -n '<Link.*>' src/ -- '*.tsx' | grep -B2 -A5 '<div'`

---

## Hydration — Zustand persist + SSR

**Проблема:** Zustand с `persist` (localStorage) на сервере недоступен, поэтому
`isAuthenticated` всегда `false`. На клиенте persist может синхронно
восстановить `true`. Если в зависимости от auth-state рендерится разная
структура DOM (например, `<Link><span>` вместо `<button>`), React выбросит:

```
Error: Hydration failed because the initial UI does not match
Expected server HTML to contain a matching <span> in <a>
```

**Решение:** Компоненты, использующие persisted Zustand-сторики с условным
рендерингом, оборачиваются через `next/dynamic` с `ssr: false`:

```tsx
// components/layout/ClientOnly.tsx
'use client';

import dynamic from 'next/dynamic';

export const ClientHeader = dynamic(
  () => import('./Header').then((mod) => mod.Header),
  { ssr: false }
);
```

Затем в серверном layout вместо оригинального компонента используется
клиентская обёртка:

```tsx
import { ClientHeader } from '@/components/layout/ClientOnly';

// ...
<ClientHeader />
```

**Правила:**
1. Создавать файл `ClientOnly.tsx` рядом с оригинальным компонентом.
2. Оборачивать только те компоненты, чья DOM-структура **меняется**
   в зависимости от persisted-состояния (auth, уведомления и т.п.).
3. Если компонент просто _показывает_ данные из стора без изменения
   структуры (только текст/атрибуты) — `hydrated` guard'а достаточно,
   `ssr: false` не требуется.

**Когда достаточно `hydrated` guard'а:**

```tsx
const [hydrated, setHydrated] = useState(false);
useEffect(() => { setHydrated(true); }, []);
const effectiveUser = hydrated ? user : null;
```

Этот паттерн подходит, если условный рендеринг идёт только на основе
`hydrated && isAuthenticated` — оба рендера (сервер и первый клиентский)
увидят `false`. Проблема возникает только при синхронном восстановлении
persisted-данных ДО первого React-рендера на клиенте — в этом случае
требуется `dynamic(..., { ssr: false })`.
