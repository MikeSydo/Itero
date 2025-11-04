import { request } from '@umijs/max';
import type { KanbanBoard, TasksList, CreateBoardRequest, UpdateBoardRequest } from './typings';

/**
 * Boards API Service
 * Сервіс для роботи з канбан дошками
 */

/** GET /api/boards - отримати всі дошки */
export async function getBoards() {
  return request<KanbanBoard[]>('/api/boards', {
    method: 'GET',
  });
}

/** GET /api/boards/:id - отримати дошку за ID */
export async function getBoard(id: number) {
  return request<KanbanBoard>(`/api/boards/${id}`, {
    method: 'GET',
  });
}

/** GET /api/boards/:id/lists - отримати списки дошки */
export async function getBoardLists(boardId: number) {
  return request<TasksList[]>(`/api/boards/${boardId}/lists`, {
    method: 'GET',
  });
}

/** POST /api/boards - створити нову дошку */
export async function createBoard(data: CreateBoardRequest) {
  return request<KanbanBoard>('/api/boards', {
    method: 'POST',
    data,
  });
}

/** PUT /api/boards/:id - оновити дошку */
export async function updateBoard(id: number, data: UpdateBoardRequest) {
  return request<KanbanBoard>(`/api/boards/${id}`, {
    method: 'PUT',
    data,
  });
}

/** DELETE /api/boards/:id - видалити дошку */
export async function deleteBoard(id: number) {
  return request<void>(`/api/boards/${id}`, {
    method: 'DELETE',
  });
}
