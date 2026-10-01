# Event Photo Mall

Приложение для фото с событий: организатор создаёт событие и получает QR-код, гости сканируют его телефоном, вводят имя и загружают фото в общую ленту. Можно ставить реакции и писать комментарии. Новые фото, реакции и комментарии появляются у всех сразу, без обновления страницы.

**Демо:** https://event-photo-lime.vercel.app

## Экраны

Дизайн сделан в Figma, реализованы 6 экранов, десктоп и мобильная версия:
создание события → QR → вход гостя → лента фото → детали фото (реакции, комментарии) → пустая лента.

## Стек

| Часть | Технологии |
|---|---|
| Фронт (`event-front`) | Next.js 16 (App Router), TypeScript, SCSS, React Query, axios, react-hook-form + zod, zustand, qrcode.react |
| Бэк (`event-back`) | Express 5, TypeScript, PostgreSQL (`pg`, чистый SQL), multer |
| Данные и файлы | Supabase: Postgres, Storage (фото), Realtime (мгновенные обновления) |
| Хостинг | Vercel (два проекта: сайт и API) |

## Как устроено

- Сайт и API лежат на разных адресах, но браузер ходит только на сайт: Next.js проксирует `/api/*` на бэк (`rewrites` в `event-front/next.config.ts`, адрес бэка в переменной `API_URL`).
- Бэк по слоям: `routes` → `controllers` → `services` → SQL. Ошибки через `apiError` и общий `errorHandler`.
- Гость не регистрируется: при входе бэк выдаёт случайный токен, он хранится в localStorage (zustand) и проверяется при загрузке фото, реакциях, комментариях и удалении своего фото.
- Фото перед отправкой сжимаются на телефоне (лимит тела запроса на Vercel 4,5 МБ) и сохраняются в Supabase Storage.
- Мгновенные обновления: после любого изменения бэк шлёт сигнал в канал Supabase Realtime, открытые страницы получают его и перезапрашивают данные.

## Запуск локально

Нужны Node.js 20+ и PostgreSQL.

```bash
# бэк
cd event-back
npm install
cp .env.example .env        # заполнить DB_PASSWORD
# создать базу event_photo и применить db/schema.sql
npm run dev                 # http://localhost:5000

# фронт (в другом терминале)
cd event-front
npm install
npm run dev                 # http://localhost:3000
```

Без ключей Supabase бэк сохраняет фото в папку `event-back/uploads`, а мгновенные обновления отключены.

## Переменные окружения

**event-back**
- `DATABASE_URL` для продакшена (Supabase pooler) или `DB_NAME`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` локально
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (секретный ключ, только на сервере)

**event-front**
- `API_URL` адрес бэкенда (по умолчанию `http://localhost:5000`)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` публичные значения для приёма сигналов Realtime

## Структура

```
event-back/
  db/schema.sql            схема базы (events, guests, photos, reactions, comments)
  src/routes|controllers|services|middlewares|plugins|utils
event-front/
  src/app                  маршруты, layout.tsx и layout.c.tsx
  src/components/pages     страницы
  src/components/widgets   карточка фото, реакции, комментарии и др.
  src/components/hooks     запросы (react-query) и realtime
  src/components/store     zustand
```
