import { request } from '@umijs/max';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from './typings';

/**
 * Tasks API Service
 * Сервіс для роботи із завданнями
 */

/** GET /api/tasks - отримати всі завдання */
export async function getTasks() {
  return request<Task[]>('/api/tasks', {
    method: 'GET',
  });
}

/** GET /api/tasks/:id - отримати завдання за ID */
export async function getTask(id: number) {
  return request<Task>(`/api/tasks/${id}`, {
    method: 'GET',
  });
}

/** POST /api/tasks - створити нове завдання */
export async function createTask(data: CreateTaskRequest) {
  return request<Task>('/api/tasks', {
    method: 'POST',
    data,
  });
}

/** PUT /api/tasks/:id - оновити завдання */
export async function updateTask(id: number, data: UpdateTaskRequest) {
  return request<Task>(`/api/tasks/${id}`, {
    method: 'PUT',
    data,
  });
}

/** DELETE /api/tasks/:id - видалити завдання */
export async function deleteTask(id: number) {
  return request<void>(`/api/tasks/${id}`, {
    method: 'DELETE',
  });
}
