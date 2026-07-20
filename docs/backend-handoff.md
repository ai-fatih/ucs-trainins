# UCS-Trainings: Передача бэкенда

**Дата:** 09.07.2026
**От:** Владислав (фронтенд)
**Кому:** Амир (руководитель / бэкенд)

---

## 1. Что проект делает

Платформа бронирования консультаций и тренингов по rkeeper. Клиенты (физлица и юрлица) выбирают услугу, специалиста, слот — записываются. После консультации оставляют отзыв.

---

## 2. Текущее состояние проекта

### Что уже работает (с текущим NestJS-бэком)

| Страница | API | Статус |
|----------|-----|--------|
| `/request` — публичная форма заявки | `POST /requests` | Подключено |
| `/admin/login` — вход админа | `POST /auth/admin/login` | Подключено |
| `/admin/requests` — список заявок | `GET /requests` | Подключено |
| `/admin/requests/[id]` — детали заявки | `GET/GET/PATCH/POST /requests/:id/*` | Подключено |
| `/feedback/[token]` — обратная связь | `GET/POST /feedback/:token` | Подключено |

### Что НЕ подключено (~75% фронта, все моки)

| Страница | Что нужно | Источник данных сейчас |
|----------|-----------|------------------------|
| `/services` — каталог услуг | `GET /services` | статический JSON |
| `/specialists` — специалисты | `GET /specialists` | статический JSON |
| `/booking` — запись (3 шага) | `GET /services`, `GET /slots`, `POST /bookings` | статический JSON |
| `/bookings` — мои записи | `GET /bookings`, `PATCH /bookings/:id/cancel` | статический JSON |
| `/chat/[id]` — чат со специалистом | `GET /chat/rooms`, `GET /chat/rooms/:id/messages`, `POST .../messages` | статический JSON |
| `/notifications` — настройки уведомлений | `GET/PUT /notifications/settings` | статический JSON |
| `/profile` — профиль | `GET/PUT /auth/profile`, `GET /employees` | мок (hardcoded) |
| `/dashboard` — личный кабинет | `GET /bookings`, `GET /chat/rooms` | статический JSON |
| `/review` — отзыв | `POST /reviews` | нет API |
| `/auth/login` — вход пользователя | `POST /auth/login` | мок (hardcoded) |
| `/auth/register` — регистрация | `POST /auth/register` | мок (hardcoded) |
| `/admin/dashboard` — дашборд админа | `GET /admin/dashboard` | статический JSON |

### Есть два API-слоя во фронте

1. **`src/lib/api-client.ts`** — реальные HTTP-вызовы к бэку (`fetch` + `credentials: 'include'`). Используется для заявок, админки, обратной связи.
2. **`src/lib/api.ts`** — моки из статических JSON-файлов. Используется для услуг, специалистов, слотов, бронирований, чата, отзывов, уведомлений, дашборда.

---

## 3. API-контракты (что фронт отправляет и ожидает)

### Базовый URL
```
NEXT_PUBLIC_API_URL (по умолчанию http://localhost:4000)
```

### Формат ошибок
```json
{
  "statusCode": 400,
  "message": "Некорректные данные" | ["Ошибка 1", "Ошибка 2"],
  "error": "Bad Request"
}
```

### CORS
Фронт на Vercel (или localhost:3000), бэк на localhost:4000.
Бэк должен:
- `Access-Control-Allow-Origin: https://vercel-адрес` (не `*`)
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

### Авторизация
Сейчас фронт шлёт `credentials: 'include'` со всеми запросами. Cookie `ucs_admin_session` (httpOnly, JWT, 7 дней).

Для пользователей (физлица) нужна отдельная сессия — либо отдельная cookie (`ucs_session`), либо Bearer token в headers.

---

### 3.1. Авторизация (новое)

```
POST /auth/register
  Body: { name: string, email: string, phone: string, password: string }
  Response: { id, email, name, phone, userType: 'individual', role: 'user' }

POST /auth/login
  Body: { email: string, password: string }
  Response: { id, email, name, phone, userType, role, companyId? }
  Sets cookie / token

POST /auth/company/login
  Body: { contractNumber: string, accessCode: string }
  Response: { id, email, name, phone, userType: 'company', role: 'company_admin', companyId }
  (Через ITSM API: POST /auth → token, companyId, name, inn, contractStatus)

GET /auth/me
  Response: { id, email, name, phone, userType, role, avatar?, companyId? }
  (Должен работать и для admin, и для user — в зависимости от сессии)

PATCH /auth/profile
  Body: { name?, phone?, avatar? }
  Response: User

DELETE /auth/account
  Response: 204
```

### 3.2. Услуги

```
GET /services
  Response: Service[]

GET /services/:id
  Response: Service

POST /services          (admin)
  Body: { name, description, type, durationMinutes, priceRub, isFree, category, icon, iconBg }
  Response: Service

PATCH /services/:id     (admin)
  Body: (частичное обновление)
  Response: Service

DELETE /services/:id    (admin)
  Response: 204
```

**Service:**
```typescript
{
  id: string;                    // uuid
  name: string;
  description: string;
  type: 'consultation' | 'training' | 'setup' | 'video';
  durationMinutes: number;       // 30, 60, 120, 240...
  priceRub: number | null;       // null если isFree
  isFree: boolean;
  category: string;              // 'consultations' | 'trainings' | 'setup' | 'video' | 'directories'
  icon: string;                  // эмодзи: "💬", "📚", "👥", "🎥", "📋"
  iconBg: string;                // hex: "#e8effa"
}
```

**Реальные примеры моков:**
```json
[
  { "id": "1", "name": "Консультация по rkeeper", "type": "consultation", "durationMinutes": 30, "priceRub": 1500, "isFree": false, "category": "consultations", "icon": "💬", "iconBg": "#e8effa" },
  { "id": "2", "name": "Базовый курс rkeeper", "type": "training", "durationMinutes": 120, "priceRub": 3000, "isFree": false, "category": "trainings", "icon": "📚", "iconBg": "#fef3c7" },
  { "id": "3", "name": "Групповой тренинг", "type": "training", "durationMinutes": 240, "priceRub": 15000, "isFree": false, "category": "trainings", "icon": "👥", "iconBg": "#fce7f3" },
  { "id": "4", "name": "Видео обучение rkeeper", "type": "training", "durationMinutes": 60, "priceRub": 1000, "isFree": false, "category": "video", "icon": "🎥", "iconBg": "#ede9fe" },
  { "id": "5", "name": "Заведение справочников", "type": "consultation", "durationMinutes": 60, "priceRub": 2500, "isFree": false, "category": "directories", "icon": "📋", "iconBg": "#ccfbf1" }
]
```

### 3.3. Специалисты

```
GET /specialists
  Response: Specialist[]

GET /specialists/:id
  Response: Specialist

POST /specialists        (admin)
  Body: { name, role, programTags, skillTags, avatarBg, avatarColor, avatarUrl?, startDate? }
  Response: Specialist

PATCH /specialists/:id   (admin)
  Body: (частичное обновление)
  Response: Specialist

DELETE /specialists/:id  (admin)
  Response: 204
```

**Specialist:**
```typescript
{
  id: string;                    // uuid
  name: string;
  role: string;                  // "Руководитель", "Менеджер"
  rating: number;                // 0-5, агрегировано из отзывов
  reviewCount: number;
  programTags: string[];         // ["rkeeper", "storehouse", "rk_delivery", "rk_event"]
  skillTags: string[];           // ["Консультации", "Обучение персонала", "Справочники"]
  avatar: string;                // инициалы: "АМ", "ЕЛ"
  avatarBg: string;              // hex: "#e8effa"
  avatarColor: string;           // hex: "#1a56db"
  avatarUrl?: string;            // "/avatars/amir.png"
  startDate?: string;            // ISO date: "2018-06-01"
}
```

**Реальные примеры моков:**
```json
[
  { "id": "1", "name": "Амир", "role": "Руководитель", "rating": 5.0, "reviewCount": 0, "programTags": ["rkeeper", "storehouse"], "skillTags": ["Консультации", "Отчёты", "Выгрузка в 1C"], "avatar": "АМ", "avatarBg": "#e8effa", "avatarColor": "#1a56db", "avatarUrl": "/avatars/amir.png", "startDate": "2018-06-01" },
  { "id": "2", "name": "Елена", "role": "Менеджер", "rating": 5.0, "reviewCount": 0, "programTags": ["rkeeper", "storehouse", "rk_delivery", "rk_event"], "skillTags": ["Консультации", "Обучение персонала", "Справочники"], "avatar": "ЕЛ", "avatarBg": "#ccfbf1", "avatarColor": "#0d9488", "avatarUrl": "/avatars/elena.png", "startDate": "2017-09-01" },
  { "id": "3", "name": "Владислав", "role": "Менеджер", "rating": 5.0, "reviewCount": 0, "programTags": ["rkeeper"], "skillTags": ["Справочники", "Номенклатура", "Выгрузка в 1C"], "avatar": "ВЛ", "avatarBg": "#fef3c7", "avatarColor": "#d97706", "avatarUrl": "/avatars/vladislav.png", "startDate": "2025-04-10" },
  { "id": "4", "name": "Дмитрий", "role": "Менеджер", "rating": 5.0, "reviewCount": 0, "programTags": ["rkeeper"], "skillTags": ["Обучение персонала", "Тренинги"], "avatar": "ДМ", "avatarBg": "#d1fae5", "avatarColor": "#059669", "avatarUrl": "/avatars/dmitriy.png", "startDate": "2025-10-01" },
  { "id": "5", "name": "Елизавета", "role": "Менеджер", "rating": 5.0, "reviewCount": 0, "programTags": ["rkeeper"], "skillTags": ["Видео", "Материалы", "Обучение персонала"], "avatar": "ЕЛ", "avatarBg": "#ede9fe", "avatarColor": "#7c3aed", "avatarUrl": "/avatars/elizaveta.png", "startDate": "2026-02-01" }
]
```

### 3.4. Слоты (расписание)

```
GET /slots?date=YYYY-MM-DD
  Response: Slot[]

GET /slots?specialistId=X&dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
  Response: Slot[]

POST /specialists/:id/schedule   (admin)
  Body: { date: string, time: string, isAvailable: boolean }[]
  Response: Slot[]
```

**Slot:**
```typescript
{
  id: string;                    // uuid
  specialistId: string;          // FK → Specialist
  date: string;                  // "2026-07-03"
  time: string;                  // "09:00", "10:00", "14:00"
  isAvailable: boolean;
}
```

**Реальный пример мока (слоты на 2026-07-03):**
```json
{
  "2026-07-03": [
    { "id": "s1",  "specialistId": "1", "date": "2026-07-03", "time": "09:00", "isAvailable": true },
    { "id": "s2",  "specialistId": "1", "date": "2026-07-03", "time": "10:00", "isAvailable": true },
    { "id": "s3",  "specialistId": "1", "date": "2026-07-03", "time": "11:00", "isAvailable": false },
    { "id": "s8",  "specialistId": "2", "date": "2026-07-03", "time": "09:00", "isAvailable": true },
    { "id": "s12", "specialistId": "3", "date": "2026-07-03", "time": "10:00", "isAvailable": true }
  ]
}
```

### 3.5. Бронирования

```
POST /bookings
  Body: {
    serviceId: string,
    specialistId: string,
    employeeId?: string,          // для юрлиц — сотрудник компании
    date: string,                 // "YYYY-MM-DD"
    time: string,                 // "HH:MM"
    topic?: string
  }
  Response: Booking

GET /bookings
  Response: Booking[]            // бронирования текущего пользователя

GET /bookings/:id
  Response: Booking

PATCH /bookings/:id/cancel
  Response: Booking

PATCH /bookings/:id/reschedule
  Body: { date: string, time: string }
  Response: Booking
```

**Booking:**
```typescript
{
  id: string;                    // uuid
  serviceId: string;
  serviceName: string;           // denormalized
  specialistId?: string;
  specialistName?: string;       // denormalized
  employeeId?: string;           // сотрудник компании (для юрлиц)
  employeeName?: string;         // denormalized
  date: string;                  // "2026-07-03"
  time: string;                  // "10:00"
  durationMinutes: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  topic?: string;
  rating?: number;               // 1-5, после отзыва
  reviewText?: string;
  isFree: boolean;
}
```

**Реальные примеры моков:**
```json
[
  { "id": "b1", "serviceId": "1", "serviceName": "Консультация по rkeeper", "specialistId": "1", "specialistName": "Иван Петров", "employeeId": "e1", "employeeName": "Анна Смирнова", "date": "2026-07-03", "time": "10:00", "durationMinutes": 30, "status": "scheduled", "topic": "Настройка отчётов по себестоимости", "isFree": true },
  { "id": "b2", "serviceId": "2", "serviceName": "Базовый курс rkeeper", "specialistId": "2", "specialistName": "Мария Соколова", "date": "2026-06-05", "time": "14:00", "durationMinutes": 120, "status": "completed", "rating": 5, "reviewText": "Очень помогли с настройкой, спасибо!", "isFree": false }
]
```

### 3.6. Чат

```
GET /chat/rooms
  Response: ChatRoom[]

GET /chat/rooms/:id/messages
  Response: ChatMessage[]

POST /chat/rooms/:id/messages
  Body: { content: string, type: 'text' | 'image' | 'file', fileUrl?: string, fileName?: string }
  Response: ChatMessage

WebSocket: /chat/ws              // real-time (post-MVP)
```

**ChatRoom:**
```typescript
{
  id: string;                    // "chat1"
  specialistName: string;        // "Иван Петров"
  specialistAvatar: string;      // "ИП" (инициалы)
  lastMessage: string;           // "Да, мы можем настроить отчёт..."
  lastMessageTime: string;       // "10:32" или "2 дня"
  isOnline: boolean;
  bookingRef: string;            // id бронирования: "b1"
  bookingRefLabel: string;       // "Консультация 03.07"
}
```

**ChatMessage:**
```typescript
{
  id: string;                    // "m1"
  chatRoomId: string;            // "chat1"
  senderId: string;              // "user1" или "spec1"
  senderName: string;            // "Вы" или "Иван Петров"
  content: string;               // текст сообщения
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;              // "#" или URL
  fileName?: string;             // "screenshot_2026-07-03.png"
  createdAt: string;             // ISO: "2026-07-03T09:45:00"
}
```

**Реальный пример мока (чат с 7 сообщениями):**
```json
{
  "id": "chat1",
  "specialistName": "Иван Петров",
  "specialistAvatar": "ИП",
  "lastMessage": "Да, мы можем настроить отчёт по себестоимости...",
  "lastMessageTime": "10:32",
  "isOnline": true,
  "bookingRef": "b1",
  "bookingRefLabel": "Консультация 03.07",
  "messages": [
    { "id": "m1", "chatRoomId": "chat1", "senderId": "spec1", "senderName": "Иван Петров", "content": "Здравствуйте! Чем могу помочь?", "type": "text", "createdAt": "2026-07-03T09:45:00", "isSent": false },
    { "id": "m2", "chatRoomId": "chat1", "senderId": "user1", "senderName": "Вы", "content": "Добрый день! У нас проблема с отчётом по себестоимости.", "type": "text", "createdAt": "2026-07-03T09:46:00", "isSent": true },
    { "id": "m5", "chatRoomId": "chat1", "senderId": "user1", "senderName": "Вы", "content": "screenshot_2026-07-03.png", "type": "file", "fileName": "screenshot_2026-07-03.png", "fileUrl": "#", "createdAt": "2026-07-03T09:48:30", "isSent": true }
  ]
}
```

### 3.7. Отзывы

```
GET /reviews
  Response: Review[]

POST /reviews
  Body: { bookingId: string, rating: number, text: string }
  Response: Review
```

**Review:**
```typescript
{
  id: string;
  userName: string;
  rating: number;                // 1-5
  text: string;
  date: string;                  // "03.07.2026"
  specialistName: string;
  serviceName: string;
}
```

### 3.8. Уведомления

```
GET /notifications
  Response: AppNotification[]

PATCH /notifications/:id/read
  Response: AppNotification

PATCH /notifications/read-all
  Response: 204

GET /notifications/settings
  Response: NotificationSetting[]

PUT /notifications/settings
  Body: { channel: string, enabled: boolean }[]
  Response: NotificationSetting[]
```

**AppNotification:**
```typescript
{
  id: string;
  title: string;
  body: string;
  type: 'booking' | 'message' | 'reminder' | 'review' | 'system';
  read: boolean;
  createdAt: string;             // ISO timestamp
}
```

**NotificationSetting:**
```typescript
{
  channel: 'email' | 'telegram' | 'sms' | 'in_app';
  enabled: boolean;
  label: string;                 // "Email", "Telegram", "SMS"
  value: string;                 // канал
}
```

**Триггеры уведомлений (из моков):**
| ID | Событие | Описание | По умолчанию |
|----|---------|----------|--------------|
| ev1 | Новая запись | При создании записи на консультацию | вкл |
| ev2 | Напоминание за 24ч | За сутки до консультации | вкл |
| ev3 | Напоминание за 1ч | За час до консультации | вкл |
| ev4 | Отмена записи | При отмене записи | вкл |
| ev5 | Новый отзыв | Когда оставлен отзыв | вкл |
| ev6 | Изменение расписания | При изменении времени/даты | выкл |
| ev7 | Системные | Обновления системы, профилактика | выкл |

### 3.9. Сотрудники (для юрлиц)

```
GET /employees
  Response: Employee[]            // сотрудники текущей компании
```

**Employee:**
```typescript
{
  id: string;
  name: string;
  position: string;
  email: string;
  bookingCount: number;
}
```

### 3.10. Дашборд админа

```
GET /admin/dashboard
  Response: AdminDashboard
```

**AdminDashboard:**
```typescript
{
  todayConsultations: number;
  onlineSpecialists: number;
  avgRating: number;
  weeklyBookings: number;
  specialistLoad: { name: string; load: number; color: string }[];
  stats: {
    total: number;
    completed: number;
    cancelled: number;
    noShow: number;
    waitlist: number;
  };
  recentReviews: Review[];
}
```

### 3.11. Существующие заявки (текущий бэк)

Эти эндпоинты уже реализованы и работают. Если бэк будет переписываться — нужно сохранить совместимость или обновить фронт:

```
POST /requests              -> { name, contact, organization?, serviceType, topic, description }
GET /requests               -> ServiceRequest[]
GET /requests/:id           -> ServiceRequest (с comments + history)
PATCH /requests/:id/status  -> { status: 'new' | 'in_progress' | 'done' | 'rejected' }
POST /requests/:id/comments -> { text }
POST /requests/:id/feedback-link -> { url, token }
GET /feedback/:token        -> { number, organization, topic, status, serviceType, feedbackSubmitted }
POST /feedback/:token       -> { rating, text?, customerName? }
```

---

## 4. ITSM API (требования)

Интеграция с ITSM планируется для авторизации юрлиц и синхронизации данных. Документация: `docs/itsm-api-request.md`.

### Нужные методы ITSM

| # | Метод | Назначение | Данные |
|---|-------|-----------|--------|
| 1 | `POST /auth` | Авторизация компании | token, companyId, name, INN, contractStatus |
| 2 | `GET /company/{id}` | Данные компании | name, INN, contacts, contractStatus, remainingHours |
| 3 | `GET /company/{id}/employees` | Сотрудники | [id, name, position, email, phone] |
| 4 | `GET /tickets` | Тикеты | company_id, status, date_from, date_to |
| 5 | `POST /tickets/{id}/feedback}` | Обратная связь | rating, text, date, source |
| 6 | webhook | Уведомления | create/close events |

### Открытые вопросы по ITSM (из `docs/itsm-api-request.md`)
1. REST или SOAP?
2. Есть Swagger/OpenAPI?
3. Тип авторизации (token, Basic Auth, API-key)?
4. Rate limits?
5. URL тестового сервера?
6. Можно ли настроить webhooks?

### Кеширование ITSM на бэке (план)
```
Запрос → Redis cache (TTL 5 мин)
  ├── Hit → отдать из кеша
  └── Miss → вызвать ITSM API → обновить кеш → отдать
       └── ITSM недоступен → отдать stale кеш + warning header → лог → алерт админу
```

---

## 5. Модели данных (Prisma-подобные)

```
User
  id            UUID
  email         String (unique)
  passwordHash  String
  name          String
  phone         String
  userType      enum: company | individual
  role          enum: user | company_admin | specialist | admin
  avatar        String?
  companyId     String?              // для юрлиц — ID из ITSM
  createdAt     DateTime
  updatedAt     DateTime

Service
  id            UUID
  name          String
  description   String
  type          enum: consultation | training | setup | video
  durationMinutes Int
  priceRub      Int?
  isFree        Boolean
  category      String
  icon          String
  iconBg        String
  createdAt     DateTime
  updatedAt     DateTime

Specialist
  id            UUID
  name          String
  role          String
  rating        Float                // агрегированный
  reviewCount   Int
  programTags   String[]
  skillTags     String[]
  avatar        String
  avatarBg      String
  avatarColor   String
  avatarUrl     String?
  startDate     DateTime?
  createdAt     DateTime
  updatedAt     DateTime

Slot
  id            UUID
  specialistId  FK → Specialist
  date          DateTime (date-only)
  time          String               // "HH:MM"
  isAvailable   Boolean
  createdAt     DateTime

Booking
  id            UUID
  serviceId     FK → Service
  serviceName   String               // denormalized
  specialistId  FK → Specialist?
  specialistName String?             // denormalized
  employeeId    String?              // сотрудник компании
  employeeName  String?              // denormalized
  userId        FK → User
  date          DateTime (date-only)
  time          String
  durationMinutes Int
  status        enum: scheduled | in_progress | completed | cancelled | no_show | rescheduled
  topic         String?
  rating        Int?                 // 1-5
  reviewText    String?
  isFree        Boolean
  createdAt     DateTime
  updatedAt     DateTime

ChatRoom
  id            UUID
  bookingId     FK → Booking (unique)
  specialistId  FK → Specialist
  specialistName String
  isOnline      Boolean
  lastMessage   String?
  lastMessageTime DateTime?
  createdAt     DateTime

ChatMessage
  id            UUID
  chatRoomId    FK → ChatRoom
  senderId      FK → User
  senderName    String
  content       String
  type          enum: text | image | file | system
  fileUrl       String?
  fileName      String?
  createdAt     DateTime

Review
  id            UUID
  bookingId     FK → Booking (unique)
  userId        FK → User
  userName      String
  specialistId  FK → Specialist
  specialistName String
  serviceName   String
  rating        Int                  // 1-5
  text          String
  date          DateTime
  createdAt     DateTime

Notification
  id            UUID
  userId        FK → User
  title         String
  body          String
  type          enum: booking | message | reminder | review | system
  read          Boolean
  createdAt     DateTime

NotificationSetting
  id            UUID
  userId        FK → User
  channel       enum: email | telegram | sms | in_app
  enabled       Boolean
  label         String

CompanyCache                      // кеш данных из ITSM (опционально)
  id            String            // ID из ITSM
  name          String
  inn           String
  contractNumber String
  contractStatus enum: active | expired | terminated
  contractValidUntil DateTime?
  lastSyncedAt  DateTime
```

---

## 6. Замечания иKnown Issues

### Два разных enum для типов услуг
- Фронт (`types/index.ts`): `'consultation' | 'training' | 'setup' | 'video'`
- Текущий бэк (`api-client.ts`): `'training' | 'consultation' | 'other'`

**Рекомендация:** Использовать версию фронта (4 значения).

### Два разных enum для статусов
- Заявки (тикеты): `'new' | 'in_progress' | 'done' | 'rejected'` — это поддержка
- Бронирования: `'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled'` — это записи

Это **разные сущности**.

### Два хранилища сессий
- `ucs_admin_session` — cookie для админов (JWT, httpOnly)
- `ucs-auth` — localStorage для пользователей (Zustand, client-side)

Для пользователей нужна серверная сессия (cookie или Bearer token).

---

## 7. Вопросы Амиру

### Стек и архитектура
1. Какой фреймворк / язык для бэка?
2. Prisma + PostgreSQL — подтверждено? Есть ли уже схема?
3. Авторизация — JWT в httpOnly cookie или Bearer tokens?
4. Порт — 4000 или другой?
5. Деплой — где будет хоститься?

### Формат API
6. REST API — да? Или GraphQL?
7. Формат ошибок — `{ message: string | string[] }` с HTTP-кодами — подходит?
8. Пагинация — нужна? Если да — `?page=1&limit=20` или cursor-based?
9. Swagger/OpenAPI — планируешь?

### Данные и авторизация
10. Физлица — регистрация через фронт, бэк хранит в своей БД?
11. Юрлица — вход по номеру договора + код через ITSM?
12. Роли — 4 роли (user, company_admin, specialist, admin) — ок?
13. Сессия — JWT (stateless) или серверные сессии (Redis)?

### ITSM
14. Есть ли уже доступ к ITSM API? Тестовый сервер, документация?
15. Формат ITSM API — REST? SOAP? Авторизация?
16. Кеширование Redis с TTL 5 мин — нужно ли сразу?
17. Что синхронизировать из ITSM? Только авторизация + сотрудники?

### Чат и уведомления
18. Чат — свой на бэке (WebSocket) или через ITSM?
19. Уведомления — email (SMTP/SendGrid?), Telegram (бот?), SMS? Что в MVP?
20. In-app уведомления — хранить в БД, привязка к пользователю?

### Приоритеты
21. Предлагаемый порядок:
   - Фаза 1: Авторизация + CRUD услуг/специалистов
   - Фаза 2: Слоты + бронирования
   - Фаза 3: Чат + уведомления
   - Фаза 4: Аналитика/дашборд
   Согласен?

### Технические детали
22. UUID или auto-increment ID?
23. Даты — ISO 8601 (UTC)?
24. Файлы (аватары, вложения) — где хранить?
25. Rate limiting — нужен?
26. Логирование — формат?

---

## 8. Полезные ссылки

| Файл | Описание |
|------|----------|
| `apps/frontend/src/types/index.ts` | Все TypeScript-типы фронта |
| `apps/frontend/src/lib/api-client.ts` | Реальный HTTP-клиент (работает с текущим бэком) |
| `apps/frontend/src/lib/api.ts` | Мок-клиент (все данные из JSON) |
| `apps/frontend/src/data/*.json` | 13 мок-файлов с реальными данными |
| `apps/frontend/src/stores/notifications.ts` | Zustand store уведомлений |
| `apps/frontend/src/stores/booking.ts` | Zustand store бронирования |
| `apps/backend/prisma/schema.prisma` | Текущая Prisma-схема (бэк на NestJS) |
| `docs/itsm-api-request.md` | Требования к ITSM API |
| `docs/requirements.md` | Полные требования проекта |
| `docs/architecture.md` | Архитектура проекта |
| `docs/project-audit.md` | Аудит проекта (07.07.2026) |
