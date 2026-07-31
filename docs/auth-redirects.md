# Авторизация и редиректы (Auth Redirects)

Система редиректов в зависимости от статуса пользователя/авторизации/сессии.
Единый источник правды — `src/lib/auth/route-access.ts`, потребляется двумя слоями
(`src/proxy.ts` — сервер, `src/components/layout/AuthRouter.tsx` — клиент).

---

## 1. Исследование: исходное состояние (до этой фичи)

### 1.1. В проекте существовали ДВЕ системы авторизации, конфликтующие друг с другом

| | Система A — клиентская зона | Система B — admin |
|---|---|---|
| Хранилище | `useAuthStore` (Zustand + persist) → **localStorage** `ucs-auth` | cookie `ucs-auth` (backend) |
| Вход | AuthModal, `/auth/login`, `/auth/register` (mock `mockDB`) | `/admin/login` → `apiClient.auth.login` |
| Демо-аккаунты | `root@ucs.ru/admin` → `company_admin` · `user@ucs.ru/admin` → `user` · `staff@ucs.ru/admin` → `specialist` | Prisma `AdminUser` |
| Страницы | `/dashboard`, `/booking`, `/bookings`, `/chat*`, `/profile`, `/notifications`, `/review`, `/school*` | `/admin/*` |

**Ключевой конфликт:** `src/proxy.ts` (middleware Next 16) защищал клиентские роуты
(`/profile`, `/bookings`, `/booking`, `/chat`, `/notifications`, `/review`) по **cookie**,
но mock-вход системы A cookie **не ставит**. Итог: пользователь, залогиненный в localStorage,
выбрасывался middleware на `/auth/login` при заходе на защищённую страницу.

**Дополнительные дефекты старого middleware:**
- `/admin/login` попадал под `startsWith('/admin')` → гостю с `/admin/login` редиректило
  на `/auth/login` (клиентский вход!) → **форма входа в админку была недостижима** без cookie.
- Гостя с `/admin/*` вело на `/auth/login`, а не на `/admin/login`.
- `/dashboard` и `/school/*` не были защищены вообще (доступны гостям), хотя
  `docs/touchpoints.md` требует авторизацию.

### 1.2. Как работает localStorage (что и когда перезаписывается)

Ключ `ucs-auth`, значение:
```json
{ "state": { "user": { ... }, "isAuthenticated": true }, "version": 0 }
```

| Событие | Действие | Что в localStorage |
|---|---|---|
| `login(user)` (вход/регистрация) | `set({user, isAuthenticated:true})` | полная перезапись: user + true |
| `logout()` | `set({user:null, isAuthenticated:false})` | полная перезапись: null + false |
| `setUser(u)` | `set({user: u})` | только `user`, флаг не трогается |
| F5 / первый заход на клиенте | persist читает синхронно при создании стора | состояние есть до первого рендера |
| SSR (сервер) | localStorage отсутствует | стор = «гость» (поэтому нужен `useHydrated`) |

Стор — **единственный писатель**. Любой вызов `login`/`logout`/`setUser` перезаписывает
JSON целиком (`partialize` = `{user, isAuthenticated}`). Порядок = порядок вызовов.

### 1.3. Статусы авторизации

- `unknown` — до гидрации (серверный рендер/первый кадр клиента). **Редиректы запрещены.**
- `guest` — не авторизован (localStorage пуст/нет cookie для admin).
- `client` — авторизован, роль `user`.
- `staff` — авторизован, роль `admin` | `company_admin` | `specialist`.

---

## 2. Слои enforcement

| Слой | Файл | Источник | Защищает |
|---|---|---|---|
| **L1 Server** | `src/proxy.ts` | cookie `ucs-auth` | только `/admin/*` (кроме `/admin/login`) |
| **L2 Client** | `src/components/layout/AuthRouter.tsx` | localStorage (`useAuthStore`) | все не-admin роуты |
| **L3 Page** | `app/profile`, `app/settings` | стор | fallback-промпт «Войдите в аккаунт» (недостижим после L2) |
| **L4 Header UI** | `components/layout/Header.tsx` | стор + pathname | guest → «Личный кабинет»; authed → уведомления + дропдаун |
| **L5 Store** | `stores/auth.ts` | localStorage | единственный писатель сессии |
| **L6 Data** | `lib/mock-db.ts` | — | сид-аккаунты |

Правило разделения: **admin = backend (cookie), клиентская зона = localStorage**. L1 не
видит localStorage, L2 не трогает admin. Шов честный: staff без backend-cookie на
`/admin/*` получает `/admin/login` (двухфакторный вход не смешивается).

---

## 3. Конфиг `src/lib/auth/route-access.ts`

```ts
interface RouteRule {
  pattern: string;      // '/chat/:path*' , '*' = fallback (длинный паттерн побеждает)
  access: AccessType;   // 'public' | 'guest-only' | 'protected' | 'staff-only'
  layer: Layer;         // 'server' | 'client'
  authedRedirect?: string;  // guest-only → куда авторизованному (роль-аваресность в resolver)
  guestRedirect?: string;   // protected/staff-only → куда гостю
  clientRedirect?: string;  // staff-only → куда client(user)
  staffRedirect?: string;   // protected → куда staff
}
```

API:
- `STAFF_ROLES`, `isStaffRole(role)`
- `matchRule(pathname)` — longest-pattern match (для proxy и AuthRouter)
- `resolveClientRedirect(pathname, status)` — чистый resolver, юнит-тестируемый
- `roleRedirect(status, fallback)` — staff → `/admin/dashboard`, иначе fallback

---

## 4. Матрица редиректов (клиентский слой, L2)

`unknown` → редиректов НЕТ никогда. `*` = дефолт `public`.

| Роут | Доступ | guest | client (`user`) | staff |
|---|---|---|---|---|
| `/` лендинг | guest-only | остаётся | → `/dashboard` | → `/admin/dashboard` |
| `/auth`, `/auth/login`, `/auth/register` | guest-only | остаётся | → `/dashboard` | → `/admin/dashboard` |
| `/dashboard` | protected | → `/auth/login?redirect=/dashboard` | остаётся | → `/admin/dashboard` |
| `/booking` | protected | → `/auth/login?redirect=/booking` | остаётся | остаётся |
| `/bookings` | protected | → `/auth/login?redirect=/bookings` | остаётся | остаётся |
| `/chat`, `/chat/:path*` | protected | → `/auth/login?redirect=<path>` | остаётся | остаётся |
| `/profile` | protected | → `/auth/login?redirect=/profile` | остаётся | остаётся |
| `/settings` | protected | → `/auth/login?redirect=/settings` | остаётся | остаётся |
| `/notifications` | protected | → `/auth/login?redirect=…` | остаётся | остаётся |
| `/review` | protected | → `/auth/login?redirect=/review` | остаётся | остаётся |
| `/school`, `/school/:path*` | protected | → `/auth/login?redirect=…` | остаётся | остаётся |
| `/docs*`, `/services`, `/specialists`, `/request`, `/terms`, `/privacy`, `/offer`, `/consent`, `/feedback/*` | public | остаётся | остаётся | остаётся |

## 5. Матрица редиректов (серверный слой, L1, cookie)

| Роут | Доступ | Правило |
|---|---|---|
| `/admin/login` | public | всегда рендерится (был недостижим — исправлено) |
| `/admin` | staff-only | cookie → server `redirect('/admin/requests')`; нет cookie → `/admin/login?redirect=/admin` |
| `/admin/:path*` | staff-only | нет cookie → `/admin/login?redirect=<path>`; есть cookie → рендер + `api-client.me()` (401 → `/admin/login`) |

---

## 6. Роль-роутинг (обоснование)

- **staff на `/dashboard` → `/admin/dashboard`.** У staff свой KPI-дашборд; клиентские
  виджеты (записи/чат/школа) ему не нужны. AuthModal и `/auth/login` уже шлют staff туда же —
  у роли один «дом», нет двух URL.
- **client на `/admin/*` → не вмешиваемся (L2 игнорирует admin).** Админка = backend+cookie;
  middleware выкинет раньше клиента. Это честный барьер «нет прав».
- **Логин с публичной страницы** (например, `/docs`) оставляет пользователя на ней —
  это осознанное поведение: он продолжает читать, а не вырывается в дашборд.
  Логин с лендинга и `/auth/*` уводит в дашборд роли (правило guest-only).

---

## 7. Потоки «как часы» (ключевые сценарии)

1. **F5 на `/dashboard` будучи гостем** → SSR рендер → гидрация → L2:
   guest + protected → `router.replace('/auth/login?redirect=/dashboard')`.
   Одна запись в истории, цикла нет.
2. **Логин с лендинга** → `login()` пишет localStorage → L2 на `/`: authed + guest-only →
   `replace('/dashboard')` (staff → `/admin/dashboard`). Дублирующий push из `AuthModal`
   удалён — единая точка принятия решения.
3. **Гость с защищённого роута** → L2 → `/auth/login?redirect=<path>` → после входа
   login-страница делает `router.replace(redirectTo || дашборд-роли)` — возврат на место.
4. **F5 staff на `/`** → L2 → `/admin/dashboard` → L1: есть cookie → рендер;
   нет cookie (mock-сессия) → `/admin/login` — честный шов двух систем.
5. **Выход** → `logout()` перезаписывает localStorage → L2 на текущем роуте:
   guest на protected → `/auth/login?redirect=…`.
6. **До гидрации** → статус `unknown` → L2 молчит: нет ложных редиректов и
   hydration mismatch (SSR-контент лендинга для SEO сохранён).

---

## 8. Где что поменялось (карта изменений)

| Файл | Что |
|---|---|
| `src/lib/auth/route-access.ts` | **новый** — конфиг доступа, роли, matcher, resolver |
| `src/components/layout/AuthRouter.tsx` | **новый** — центральный клиентский guard (mount в root-layout) |
| `src/app/layout.tsx` | смонтирован `<AuthRouter/>` |
| `src/proxy.ts` | переписан на конфиг; matcher только `/admin/:path*`; `/admin/login` public; гость → `/admin/login?redirect=` |
| `src/app/page.tsx` | удалён inline-эффект редиректа (дублировал L2) |
| `src/components/auth/AuthModal.tsx` | удалён `redirectAfterLogin` (решает L2) |
| `src/app/auth/login/page.tsx` | `?redirect=` + `router.replace`; Suspense/useSearchParams |
| `src/app/auth/register/page.tsx` | `?redirect=` + `router.replace`; Suspense/useSearchParams |
| `src/app/admin/login/page.tsx` | `?redirect=` + `router.replace`; Suspense/useSearchParams |
| `src/components/layout/Header.tsx` | колокол → `NotificationsDropdown` |
| `src/components/layout/NotificationsDropdown.tsx` | **новый** — дропдаун уведомлений (заглушка) |
| `src/data/notifications.json` | **новый** — mock-уведомления |
| `src/stores/notifications.ts` | добавлен идемпотентный `seed()` |

## 9. Известные ограничения (roadmap)

- **Mock-сессия vs admin:** staff, вошедший через клиентский вход (localStorage), на
  `/admin/*` получит `/admin/login` — админка требует backend-сессию (cookie). При
  переходе авторизации на JWT (backend) шов исчезнет сам.
- **Уведомления — заглушка:** `seed()` из `data/notifications.json`, бейдж из
  `unreadCount`. Backend-уведомления (реальные события, WebSocket/пуш) — ⏳.
- **`/auth/login` и `/auth/register` — guest-only:** авторизованный на них уводится
  в дашборд роли (L2), формы для гостей не ломаются.
