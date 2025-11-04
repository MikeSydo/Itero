import { request } from '@umijs/max';
import type { TasksList, Task, CreateListRequest, UpdateListRequest } from './typings';

/**
 * Lists API Service
 * Сервіс для роботи зі списками завдань
 */

/** GET /api/lists - отримати всі списки */
export async function getLists() {
  return request<TasksList[]>('/api/lists', {
    method: 'GET',
  });
}

/** GET /api/lists/:id - отримати список за ID */
export async function getList(id: number) {
  return request<TasksList>(`/api/lists/${id}`, {
    method: 'GET',
  });
}

/** GET /api/lists/:id/tasks - отримати завдання списку */
export async function getListTasks(listId: number) {
  return request<Task[]>(`/api/lists/${listId}/tasks`, {
    method: 'GET',
  });
}

/** POST /api/lists - створити новий список */
export async function createList(data: CreateListRequest) {
  return request<TasksList>('/api/lists', {
    method: 'POST',
    data,
  });
}

/** PUT /api/lists/:id - оновити список */
export async function updateList(id: number, data: UpdateListRequest) {
  return request<TasksList>(`/api/lists/${id}`, {
    method: 'PUT',
    data,
  });
}

/** DELETE /api/lists/:id - видалити список */
export async function deleteList(id: number) {
  return request<void>(`/api/lists/${id}`, {
    method: 'DELETE',
  });
}
