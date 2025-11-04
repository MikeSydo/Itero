# Інструкція з міграції на Ant Design Pro

## Що було зроблено

### 1. ✅ Реструктуризація проекту
- Об'єднано всі папки в єдину структуру
- Видалено старі папки `client/` та `server/`
- Перенесено всі файли з `myapp/` в кореневу теку
- Створено єдиний монорепозиторій

### 2. ✅ Інтеграція Backend
- Створено папку `api/` з Express сервером
- Перенесено Prisma схему до `prisma/`
- Налаштовано скрипти для одночасного запуску frontend і backend
- Додано необхідні залежності: `@prisma/client`, `cors`, `express`

### 3. ✅ API Сервіси
Створено типізовані сервіси в `src/services/itero/`:
- `boards.ts` - робота з дошками
- `lists.ts` - робота зі списками
- `tasks.ts` - робота із завданнями
- `typings.d.ts` - TypeScript типи

### 4. ✅ React Компоненти
Адаптовано компоненти під Ant Design Pro:
- `KanbanBoard/` - головна Kanban дошка
- `TasksList/` - список завдань з можливістю додавання
- `TaskCard/` - картка завдання з діями

### 5. ✅ Сторінки
- `boards/index.tsx` - список всіх дошок
- `boards/[id].tsx` - детальний перегляд дошки
- `Welcome.tsx` - оновлена welcome сторінка

### 6. ✅ Роутинг і Конфігурація
- Оновлено `config/routes.ts` з новими роутами
- Налаштовано `config/proxy.ts` для проксі до API
- Додано локалізацію меню

### 7. ✅ Очищення
- Видалено демо-сторінки (Admin, table-list)
- Видалено демо-сервіси (ant-design-pro, swagger)
- Видалено mock файли

### 8. ✅ Інтеграція Electron
- Створено папку `electron/` з main та preload процесами
- Налаштовано electron-builder
- Додано скрипти для запуску та збірки desktop версії
- Підтримка Windows, macOS, Linux

## Наступні кроки

### Необхідно зробити:

1. **Встановити залежності**
   ```bash
   npm install
   ```

2. **Налаштувати базу даних**
   - Створити `.env` файл (скопіювати з `.env.example`)
   - Вказати `DATABASE_URL`
   - Запустити `npm run prisma:generate`
   - Запустити `npm run prisma:migrate`

3. **Виправити TypeScript помилки**
   - Деякі компоненти мають помилки типізації через `useRequest`
   - Потрібно вказати типи для відповідей API

4. **Додати функціонал**
   - Drag & Drop для завдань
   - Редагування завдань
   - Створення нових дошок
   - Аутентифікація

5. **Готово!**
   - ✅ Старі папки `client/` та `server/` видалені
   - ✅ Всі файли об'єднані в кореневій теці
   - ✅ Проект готовий до запуску

## Структура API

### Endpoints:
- `GET /api/boards` - всі дошки
- `GET /api/boards/:id` - конкретна дошка
- `GET /api/boards/:id/lists` - списки дошки
- `GET /api/lists/:id` - конкретний список
- `GET /api/lists/:id/tasks` - завдання списку
- `POST /api/tasks` - створити завдання
- `DELETE /api/tasks/:id` - видалити завдання
- `DELETE /api/lists/:id` - видалити список

## Запуск проекту

### Web версія (браузер)
```bash
# Development (frontend + backend)
npm run dev

# Тільки frontend
npm run dev:frontend

# Тільки backend
npm run api:dev
```

### Desktop версія (Electron)
```bash
# Development mode
npm run dev:electron
```

### Production
```bash
# Web build
npm run build
npm run api:build

# Electron desktop apps
npm run electron:dist:mac
npm run electron:dist:win
npm run electron:dist:linux
```

### Prisma
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Корисні посилання

- [Ant Design Pro Docs](https://pro.ant.design)
- [UmiJS Docs](https://umijs.org)
- [Ant Design Components](https://ant.design/components)
- [Prisma Docs](https://www.prisma.io/docs)

## Проблеми та рішення

### Якщо не запускається backend:
- Перевірте `.env` файл
- Перевірте чи запущена PostgreSQL
- Запустіть `npm run prisma:generate`

### Якщо не працює проксі:
- Перевірте `config/proxy.ts`
- Переконайтеся що backend запущений на порті 3001

### TypeScript помилки:
- Запустіть `npm run tsc` для перевірки
- Більшість помилок пов'язані з типізацією API відповідей
