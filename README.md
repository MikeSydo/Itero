# Itero - Project Management Application# Itero - Project Management Application# Itero - Project Management Application# Ant Design Pro



**Itero** - це додаток для управління проєктами з Kanban-дошками, доступний як веб-додаток та desktop-застосунок (Electron).



## 🎯 Архітектура**Itero** - це додаток для управління проєктами з Kanban-дошками, доступний як веб-додаток та desktop-застосунок (Electron).



Проект підтримує два режими:

- **Web-версія** - веб-додаток в браузері (http://localhost:8000)

- **Desktop-версія** - Electron застосунок для Windows, macOS, Linux## 🎯 Архітектура**Itero** - це додаток для управління проєктами з Kanban-дошками.This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.



## 📦 Технологічний стек



### FrontendПроект підтримує два режими:

- React 19 + TypeScript

- Ant Design Pro (UI framework)- **Web-версія** - веб-додаток в браузері (http://localhost:8000)

- UmiJS (роутинг та конфігурація)

- Ant Design (UI компоненти)- **Desktop-версія** - Electron застосунок для Windows, macOS, Linux## Технологічний стек## Environment Prepare



### Backend

- Node.js + TypeScript

- Express.js## 📦 Технологічний стек

- Prisma ORM



### Desktop

- Electron 38 (підтримка Windows, macOS, Linux)### Frontend### FrontendInstall `node_modules`:



### Database- React 19 + TypeScript

- PostgreSQL

- Ant Design Pro (UI framework)- React 19 + TypeScript

## 📁 Структура проєкту

- UmiJS (роутинг)

```

itero/- Ant Design Pro```bash

├── electron/              # Electron main/preload процеси

│   ├── main.ts           # Головний процес### Backend

│   ├── preload.cts       # Preload script

│   ├── util.ts           # Утиліти- Node.js + Express- UmiJSnpm install

│   └── pathResolver.ts   # Резолвер шляхів

├── api/                  # Backend API (Express)- Prisma ORM

│   ├── app.ts           # Express застосунок

│   └── server.ts        # Запуск сервера- PostgreSQL```

├── prisma/              # Схема БД та міграції

│   ├── schema.prisma

│   └── migrations/

├── src/                 # Frontend (React + Ant Design Pro)### Desktop### Backend

│   ├── components/      # Компоненти

│   │   ├── KanbanBoard/- Electron 38

│   │   ├── TasksList/

│   │   └── TaskCard/- Node.js + Expressor

│   ├── pages/          # Сторінки

│   │   ├── boards/## 📁 Структура проєкту

│   │   └── Welcome.tsx

│   └── services/       # API сервіси- Prisma ORM

│       └── itero/

└── config/             # Конфігурація UmiJS```

    ├── config.ts

    ├── routes.tsmyapp/- PostgreSQL```bash

    └── proxy.ts

```├── electron/              # Electron main/preload процеси



## 🚀 Встановлення│   ├── main.ts           # Головний процесyarn



```bash│   ├── preload.cts       # Preload script

# Встановіть залежності

npm install│   ├── util.ts           # Утиліти## Структура проєкту```



# Створіть .env файл (скопіюйте з .env.example)│   └── pathResolver.ts   # Резолвер шляхів

cp .env.example .env

├── api/                  # Backend API (Express)

# Налаштуйте DATABASE_URL в .env

│   ├── app.ts           # Express застосунок

# Запустіть міграції

npm run prisma:generate│   └── server.ts        # Запуск сервера```## Provided Scripts

npm run prisma:migrate

```├── prisma/              # Схема БД та міграції



## 🎮 Запуск│   ├── schema.prismamyapp/



### Web-версія (браузер)│   └── migrations/



```bash├── src/                 # Frontend (React + Ant Design Pro)├── api/                    # Backend APIAnt Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

# Запуск frontend + backend

npm run dev│   ├── components/      # Компоненти



# Або окремо:│   │   ├── KanbanBoard/├── prisma/                # Схема БД

npm run dev:frontend  # Тільки frontend на :8000

npm run api:dev       # Тільки backend на :3001│   │   ├── TasksList/

```

│   │   └── TaskCard/├── src/Scripts provided in `package.json`. It's safe to modify or add additional script:

Відкрийте http://localhost:8000

│   ├── pages/          # Сторінки

### Desktop-версія (Electron)

│   │   ├── boards/│   ├── components/        # React компоненти

```bash

# Запуск в режимі розробки│   │   └── Welcome.tsx

npm run dev:electron

```│   └── services/       # API сервіси│   ├── pages/            # Сторінки### Start project



Це запустить:│       └── itero/

- ✅ Frontend dev server (:8000)

- ✅ Backend API server (:3001)└── config/             # Конфігурація UmiJS│   └── services/         # API сервіси

- ✅ Electron вікно з додатком

    ├── config.ts

## 📦 Збірка Production

    ├── routes.ts└── config/               # Конфігурація```bash

### Web версія

    └── proxy.ts

```bash

npm run build``````npm start

```



### Electron Desktop Apps

## 🚀 Встановлення```

```bash

# Збірка для поточної платформи

npm run build:electron

```bash## Встановлення

# Або для конкретної платформи:

npm run electron:dist:mac    # macOS (dmg)cd myapp

npm run electron:dist:win    # Windows (portable, nsis)

npm run electron:dist:linux  # Linux (AppImage, deb)npm install### Build project

```

```

Готові файли з'являться в папці `dist/`

```bash

## 📝 Доступні скрипти

## ⚙️ Налаштування

### Розробка

- `npm run dev` - Web версія (frontend + backend)cd myapp```bash

- `npm run dev:electron` - Desktop версія (Electron + frontend + backend)

- `npm run dev:frontend` - Тільки frontend### База даних

- `npm run api:dev` - Тільки backend API

npm installnpm run build

### Збірка

- `npm run build` - Збірка web версіїСтворіть `.env` файл (скопіюйте з `.env.example`):

- `npm run build:electron` - Збірка desktop версії

- `npm run api:build` - Збірка backend``````



### Electron```env

- `npm run electron:transpile` - Компіляція Electron TS файлів

- `npm run electron:start` - Запуск ElectronDATABASE_URL="postgresql://user:password@localhost:5432/itero?schema=public"

- `npm run electron:dist:mac` - Збірка для macOS

- `npm run electron:dist:win` - Збірка для WindowsAPI_PORT=3001

- `npm run electron:dist:linux` - Збірка для Linux

```## Налаштування БД### Check code style

### База даних

- `npm run prisma:generate` - Генерація Prisma клієнта

- `npm run prisma:migrate` - Запуск міграцій

- `npm run prisma:studio` - Відкрити Prisma StudioЗапустіть міграції:



### Інше

- `npm run lint` - Перевірка коду

- `npm test` - Запуск тестів```bashСтворіть `.env`:```bash

- `npm run tsc` - TypeScript перевірка

npm run prisma:generate

## ✨ Функціонал

npm run prisma:migratenpm run lint

- ✅ Kanban дошки

- ✅ Списки завдань```

- ✅ Керування завданнями (створення, видалення)

- ✅ Desktop застосунок (Electron)```env```

- ✅ Web версія

- 🚧 Редагування завдань (в розробці)## 🎮 Запуск

- 🚧 Drag & Drop (в розробці)

- 🚧 Аутентифікація (в розробці)DATABASE_URL="postgresql://user:password@localhost:5432/itero"

- 🚧 Робочі простори (в розробці)

- 🚧 Ітерації (в розробці)### Web-версія (браузер)



## 🔌 API EndpointsAPI_PORT=3001You can also use script to auto fix some lint error:



### Boards (Дошки)```bash

- `GET /api/boards` - Всі дошки

- `GET /api/boards/:id` - Конкретна дошка# Запуск frontend + backend```

- `GET /api/boards/:id/lists` - Списки дошки

npm run dev

### Lists (Списки)

- `GET /api/lists` - Всі списки```bash

- `GET /api/lists/:id` - Конкретний список

- `GET /api/lists/:id/tasks` - Завдання списку# Або окремо:

- `DELETE /api/lists/:id` - Видалити список

npm run dev:frontend  # Тільки frontend на :8000Запустіть міграції:npm run lint:fix

### Tasks (Завдання)

- `GET /api/tasks` - Всі завданняnpm run api:dev       # Тільки backend на :3001

- `GET /api/tasks/:id` - Конкретне завдання

- `POST /api/tasks` - Створити завдання``````

- `DELETE /api/tasks/:id` - Видалити завдання



## 🛠️ Особливості Electron інтеграції

Відкрийте http://localhost:8000```bash

- **Context Isolation** - включена для безпеки

- **Preload Script** - для безпечної комунікації між процесами

- **Dev Mode** - підключається до dev-сервера UmiJS

- **Production** - завантажує зібраний HTML### Desktop-версія (Electron)npm run prisma:generate### Test code



### Використання Electron API в React



```typescript```bashnpm run prisma:migrate

// Типи вже підключені через electron/types.d.ts

const version = window.electron.getStaticData();# Запуск в режимі розробки

console.log('App version:', version);

```npm run dev:electron``````bash



## 📚 Додаткові ресурси```



- [Ant Design Pro](https://pro.ant.design)npm test

- [UmiJS](https://umijs.org)

- [Electron](https://www.electronjs.org)Це запустить:

- [Prisma](https://www.prisma.io/docs)

- **QUICKSTART.md** - швидкий старт гайд- Frontend dev server (:8000)## Запуск```

- **MIGRATION.md** - інформація про міграцію

- **ELECTRON.md** - детальний гайд по Electron- Backend API server (:3001)



## 🔧 Troubleshooting- Electron вікно з додатком



### Backend не запускається

- Перевірте `.env` файл

- Переконайтеся що PostgreSQL запущена## 📦 Збірка```bash## More

- Виконайте `npm run prisma:generate`



### Electron не відкривається

- Виконайте `npm run electron:transpile`### Web Productionnpm run dev

- Перевірте чи запущений dev-сервер на :8000

- Перевірте логи в терміналі



### Проблеми з proxy```bash```You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).

- Перевірте `config/proxy.ts`

- Переконайтеся що backend запущений на :3001npm run build



## 🎨 UI Візуалізація```



Дизайн додатку у Figma:Frontend: http://localhost:8000

https://www.figma.com/site/IBW0ymCPIhNlZcdzTfM8qW/Itero

### Electron Desktop AppsBackend: http://localhost:3001

## 📄 Ліцензія



Private

```bash## Скрипти

---

# Збірка для поточної платформи

**Автор**: MikeSydo  

**Repository**: https://github.com/MikeSydo/Iteronpm run build:electron- `npm run dev` - Запуск frontend + backend


- `npm run dev:frontend` - Тільки frontend

# Або для конкретної платформи:- `npm run api:dev` - Тільки backend

npm run electron:dist:mac    # macOS (dmg)- `npm run build` - Збірка production

npm run electron:dist:win    # Windows (portable, nsis)- `npm run prisma:studio` - Prisma Studio

npm run electron:dist:linux  # Linux (AppImage, deb)

```## Функціонал



Готові файли з'являться в папці `dist/` (для Electron).- ✅ Kanban дошки

- ✅ Списки завдань

## 📝 Доступні скрипти- ✅ Керування завданнями

- 🚧 Редагування (в розробці)

### Розробка- 🚧 Drag & Drop (в розробці)

- `npm run dev` - Web версія (frontend + backend)

- `npm run dev:electron` - Desktop версія (Electron + frontend + backend)## API Endpoints

- `npm run dev:frontend` - Тільки frontend

- `npm run api:dev` - Тільки backend API- `GET /api/boards` - Всі дошки

- `GET /api/boards/:id` - Дошка за ID

### Збірка- `GET /api/boards/:id/lists` - Списки дошки

- `npm run build` - Збірка web версії- `GET /api/tasks` - Всі завдання

- `npm run build:electron` - Збірка desktop версії- `POST /api/tasks` - Створити завдання

- `npm run api:build` - Збірка backend- `DELETE /api/tasks/:id` - Видалити завдання


### Electron
- `npm run electron:transpile` - Компіляція Electron TS файлів
- `npm run electron:start` - Запуск Electron
- `npm run electron:dist:mac` - Збірка для macOS
- `npm run electron:dist:win` - Збірка для Windows
- `npm run electron:dist:linux` - Збірка для Linux

### База даних
- `npm run prisma:generate` - Генерація Prisma клієнта
- `npm run prisma:migrate` - Запуск міграцій
- `npm run prisma:studio` - Відкрити Prisma Studio

### Інше
- `npm run lint` - Перевірка коду
- `npm test` - Запуск тестів
- `npm run tsc` - TypeScript перевірка

## ✨ Функціонал

- ✅ Kanban дошки
- ✅ Списки завдань
- ✅ Керування завданнями (створення, видалення)
- ✅ Desktop застосунок (Electron)
- 🚧 Редагування завдань (в розробці)
- 🚧 Drag & Drop (в розробці)
- 🚧 Аутентифікація (в розробці)
- 🚧 Робочі простори (в розробці)

## 🔌 API Endpoints

### Boards (Дошки)
- `GET /api/boards` - Всі дошки
- `GET /api/boards/:id` - Конкретна дошка
- `GET /api/boards/:id/lists` - Списки дошки

### Lists (Списки)
- `GET /api/lists` - Всі списки
- `GET /api/lists/:id` - Конкретний список
- `GET /api/lists/:id/tasks` - Завдання списку
- `DELETE /api/lists/:id` - Видалити список

### Tasks (Завдання)
- `GET /api/tasks` - Всі завдання
- `GET /api/tasks/:id` - Конкретне завдання
- `POST /api/tasks` - Створити завдання
- `DELETE /api/tasks/:id` - Видалити завдання

## 🛠️ Особливості Electron інтеграції

- **Context Isolation** - включена для безпеки
- **Preload Script** - для безпечної комунікації між процесами
- **Dev Mode** - підключається до dev-сервера UmiJS
- **Production** - завантажує зібраний HTML

### Використання Electron API в React

```typescript
// Типи вже підключені через electron/types.d.ts
const version = window.electron.getStaticData();
console.log('App version:', version);
```

## 📚 Додаткові ресурси

- [Ant Design Pro](https://pro.ant.design)
- [UmiJS](https://umijs.org)
- [Electron](https://www.electronjs.org)
- [Prisma](https://www.prisma.io/docs)

## 🔧 Troubleshooting

### Backend не запускається
- Перевірте `.env` файл
- Переконайтеся що PostgreSQL запущена
- Виконайте `npm run prisma:generate`

### Electron не відкривається
- Виконайте `npm run electron:transpile`
- Перевірте чи запущений dev-сервер на :8000
- Перевірте логи в терміналі

### Проблеми з proxy
- Перевірте `config/proxy.ts`
- Переконайтеся що backend запущений на :3001

## 📄 Ліцензія

Private
