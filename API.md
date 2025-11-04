# Itero API Documentation

## Базова інформація

**Base URL (розробка):** `http://localhost:3001`  
**Base URL (продакшн):** визначається через змінну середовища `API_URL`

Всі endpoints повертають JSON. У разі помилки повертається об'єкт з полем `error`.

---

## 📋 Boards (Дошки)

### GET `/api/boards`
Отримати список всіх канбан дошок.

**Response:**
```typescript
API.GetBoardsResponse = API.KanbanBoard[]
```

**Приклад:**
```json
[
  {
    "id": 1,
    "name": "Мій проєкт",
    "description": "Опис проєкту",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### GET `/api/boards/:id`
Отримати конкретну дошку за ID.

**Parameters:**
- `id` (number) - ID дошки

**Response:**
```typescript
API.GetBoardResponse = API.KanbanBoard
```

**Приклад:**
```json
{
  "id": 1,
  "name": "Мій проєкт",
  "description": "Опис проєкту"
}
```

---

### GET `/api/boards/:id/lists`
Отримати всі списки конкретної дошки.

**Parameters:**
- `id` (number) - ID дошки

**Response:**
```typescript
API.GetBoardListsResponse = API.TasksList[]
```

**Приклад:**
```json
[
  {
    "id": 1,
    "name": "To Do",
    "boardId": 1,
    "position": 0
  },
  {
    "id": 2,
    "name": "In Progress",
    "boardId": 1,
    "position": 1
  }
]
```

---

### POST `/api/boards`
Створити нову дошку.

**Request Body:**
```typescript
API.CreateBoardRequest = {
  name: string;
  description?: string;
}
```

**Response:**
```typescript
API.KanbanBoard
```

---

### PUT `/api/boards/:id`
Оновити існуючу дошку.

**Parameters:**
- `id` (number) - ID дошки

**Request Body:**
```typescript
API.UpdateBoardRequest = {
  name?: string;
  description?: string;
}
```

**Response:**
```typescript
API.KanbanBoard
```

---

### DELETE `/api/boards/:id`
Видалити дошку.

**Parameters:**
- `id` (number) - ID дошки

**Response:** `204 No Content`

---

## 📝 Lists (Списки)

### GET `/api/lists`
Отримати всі списки.

**Response:**
```typescript
API.GetListsResponse = API.TasksList[]
```

---

### GET `/api/lists/:id`
Отримати конкретний список за ID.

**Parameters:**
- `id` (number) - ID списку

**Response:**
```typescript
API.GetListResponse = API.TasksList
```

---

### GET `/api/lists/:id/tasks`
Отримати всі завдання конкретного списку.

**Parameters:**
- `id` (number) - ID списку

**Response:**
```typescript
API.GetListTasksResponse = API.Task[]
```

**Приклад:**
```json
[
  {
    "id": 1,
    "name": "Реалізувати UI",
    "listId": 1,
    "description": "Створити компоненти для канбану"
  },
  {
    "id": 2,
    "name": "Тестування",
    "listId": 1
  }
]
```

---

### POST `/api/lists`
Створити новий список.

**Request Body:**
```typescript
API.CreateListRequest = {
  name: string;
  boardId: number;
  position?: number;
}
```

**Response:**
```typescript
API.TasksList
```

---

### PUT `/api/lists/:id`
Оновити список.

**Parameters:**
- `id` (number) - ID списку

**Request Body:**
```typescript
API.UpdateListRequest = {
  name?: string;
  position?: number;
}
```

**Response:**
```typescript
API.TasksList
```

---

### DELETE `/api/lists/:id`
Видалити список (також видаляє всі завдання в ньому).

**Parameters:**
- `id` (number) - ID списку

**Response:** `204 No Content`

---

## ✅ Tasks (Завдання)

### GET `/api/tasks`
Отримати всі завдання.

**Response:**
```typescript
API.GetTasksResponse = API.Task[]
```

---

### GET `/api/tasks/:id`
Отримати конкретне завдання за ID.

**Parameters:**
- `id` (number) - ID завдання

**Response:**
```typescript
API.GetTaskResponse = API.Task
```

---

### POST `/api/tasks`
Створити нове завдання.

**Request Body:**
```typescript
API.CreateTaskRequest = {
  name: string;
  listId: number;
  description?: string;
}
```

**Response:**
```typescript
API.Task
```

**Приклад:**
```json
{
  "name": "Нове завдання",
  "listId": 1,
  "description": "Опис завдання"
}
```

---

### PUT `/api/tasks/:id`
Оновити завдання.

**Parameters:**
- `id` (number) - ID завдання

**Request Body:**
```typescript
API.UpdateTaskRequest = {
  name?: string;
  description?: string;
  listId?: number;  // Для переміщення між списками
}
```

**Response:**
```typescript
API.Task
```

---

### DELETE `/api/tasks/:id`
Видалити завдання.

**Parameters:**
- `id` (number) - ID завдання

**Response:** `204 No Content`

---

## ❌ Обробка помилок

Всі помилки повертаються у форматі:

```typescript
API.ErrorResponse = {
  error: string;
  message?: string;
  statusCode?: number;
}
```

**Приклади:**

```json
{
  "error": "Invalid board id",
  "statusCode": 400
}
```

```json
{
  "error": "Board not found",
  "statusCode": 404
}
```

---

## 🔧 Використання в коді

### Приклад використання сервісів

```typescript
import { getBoards, getBoardById, createTask } from '@/services';

// Отримати всі дошки
const boards = await getBoards();

// Отримати конкретну дошку
const board = await getBoardById(1);

// Створити завдання
const newTask = await createTask({
  name: 'Нове завдання',
  listId: 1,
  description: 'Опис'
});
```

### Приклад з useRequest

```typescript
import { useRequest } from '@umijs/max';
import { getBoards } from '@/services';

function MyComponent() {
  const { data: boards, loading, error } = useRequest(getBoards);

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error.message}</div>;

  return <div>{boards?.map(board => board.name)}</div>;
}
```

---

## 📁 Типи

Всі типи визначені в:
- `types/index.d.ts` - глобальні API типи
- `src/services/typings.d.ts` - експорти для використання в сервісах

Типи доступні через namespace `API.*` у всьому проєкті.
