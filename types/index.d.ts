/**
 * Itero API Types
 * Типи для Kanban Board API
 */
export namespace API {
  /** Task - завдання в списку */
  export interface Task {
    id: number;
    name: string;
    listId: number;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  /** TasksList - список завдань на дошці */
  export interface TasksList {
    id: number;
    name: string;
    boardId: number;
    position?: number;
    tasks?: Task[];
    createdAt?: string;
    updatedAt?: string;
  }

  /** KanbanBoard - канбан дошка */
  export interface KanbanBoard {
    id: number;
    name: string;
    description?: string;
    lists?: TasksList[];
    createdAt?: string;
    updatedAt?: string;
  }

  // ============= Boards API =============

  /** GET /api/boards - отримати всі дошки */
  export type GetBoardsResponse = KanbanBoard[];

  /** GET /api/boards/:id - отримати дошку за ID */
  export type GetBoardResponse = KanbanBoard;

  /** GET /api/boards/:id/lists - отримати списки дошки */
  export type GetBoardListsResponse = TasksList[];

  /** POST /api/boards - створити нову дошку */
  export interface CreateBoardRequest {
    name: string;
    description?: string;
  }

  /** PUT /api/boards/:id - оновити дошку */
  export interface UpdateBoardRequest {
    name?: string;
    description?: string;
  }

  // ============= Lists API =============

  /** GET /api/lists - отримати всі списки */
  export type GetListsResponse = TasksList[];

  /** GET /api/lists/:id - отримати список за ID */
  export type GetListResponse = TasksList;

  /** GET /api/lists/:id/tasks - отримати завдання списку */
  export type GetListTasksResponse = Task[];

  /** POST /api/lists - створити новий список */
  export interface CreateListRequest {
    name: string;
    boardId: number;
    position?: number;
  }

  /** PUT /api/lists/:id - оновити список */
  export interface UpdateListRequest {
    name?: string;
    position?: number;
  }

  // ============= Tasks API =============

  /** GET /api/tasks - отримати всі завдання */
  export type GetTasksResponse = Task[];

  /** GET /api/tasks/:id - отримати завдання за ID */
  export type GetTaskResponse = Task;

  /** POST /api/tasks - створити нове завдання */
  export interface CreateTaskRequest {
    name: string;
    listId: number;
    description?: string;
  }

  /** PUT /api/tasks/:id - оновити завдання */
  export interface UpdateTaskRequest {
    name?: string;
    description?: string;
    listId?: number;
  }

  // ============= Common Types =============

  /** Відповідь з помилкою */
  export interface ErrorResponse {
    error: string;
    message?: string;
    statusCode?: number;
  }

  /** Успішна відповідь */
  export interface SuccessResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
  }
}
