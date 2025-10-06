# Itero
**Itero** - це додаток для управління проєктами, розроблений для індивідуального та командного використання. Головна ідея проєкту - структуроване відстеження прогресу на **Kanban**-дошці. Можливість розділення проєкту на **ітерації**, а самі ітерації вже містять дошку для встановлення різних списків завдань.

## Ідея
Ідея полягає у створенні простого та ефективного інструменту для управління проєктами, що базується на двох ключових принципах гнучкої розробки:
- **Планування по ітераціях**: Робота організовується на чіткі часові відрізки (ітерації).
- **Візуалізація робочого процесу**: Використання класичної Kanban-дошки для відстеження завдань на кожному етапі виконання (Backlog, In Progress, Done).

## Функціонал
- **Обліковий запис** - створення та керування обліковим записом.
Реалізувати реєстрацію та вхід(вихід) у додаток за допомогою електроної пошти. Налаштування профілю, адреси ел. пошти та інших параметрів облікового запису.  
- **Робочий простір** - створення та керування робочого простору. Можливість додавання учасників та встановлення їм ролі(організатор, учасник, глядач).
- **Управління проєктами** - створення та організація проєктів в певному просторі.
- **Планування ітерацій** - розбиття роботи на ітерації. Ітерація має свої параметри(дедлайн, прогрес та ін.). В проєкті можна створювати не одну часову лінію з ітерацій, щоб розбити проєкт на конкретні розділи(e.g. Marketing, Engineering, HR).
- **Канбан-дошка** - класична дошка з перетягуванням карток для відстеження завдань по етапах.
- **Пошукова система** - можливість шукати необхідну інформацію аж до певного завдання в канбан-дошці.

## Stack
### UI
- React
- Electron
- TypeScript
- Vite
- Tailwind CSS 
### Backend
- Node.js
- TypeScript
- Express.js
- ESLint
- Prettier

### Databases
-

## Development

### Backend Scripts
The backend is set up with Node.js, TypeScript, and Express.js. Available scripts:

- `npm run dev:backend` - Start backend in development mode with auto-reload (using nodemon + tsx)
- `npm run build:backend` - Build backend TypeScript to JavaScript in `dist-backend/`
- `npm run start:backend` - Start the built backend server
- `npm run lint` - Run ESLint on all TypeScript code
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format all code with Prettier
- `npm run format:check` - Check if code is formatted correctly
- `npm test` - Run tests (placeholder - test runner to be configured)

### Environment Configuration
The backend supports multiple environments through environment variables:
- `.env.development` - Development environment configuration
- `.env.test` - Test environment configuration
- `.env.production` - Production environment configuration

Copy `.env.example` to `.env` and configure as needed.

### Backend API Endpoints
- `GET /` - API information
- `GET /health` - Health check endpoint

## UI візуалізація
Дизайн додатку у figma:
https://www.figma.com/site/IBW0ymCPIhNlZcdzTfM8qW/Itero?node-id=0-1&t=EEhRGHKZqkem1sxq-1

Екскізи для візуального представлення додатку: 
---
<img width="1075" height="760" alt="image" src="https://github.com/user-attachments/assets/1a699fde-e485-410c-a5d2-33ba62fccadb" />
<img width="1071" height="751" alt="image" src="https://github.com/user-attachments/assets/19d90b2e-1ec7-40e4-a943-39f5d8d5b01e" />
<img width="1061" height="743" alt="image" src="https://github.com/user-attachments/assets/d1742535-9f4e-4928-849c-f3ba08d1b7f8" />
