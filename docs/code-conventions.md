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
