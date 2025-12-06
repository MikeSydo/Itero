export type Task = {
  id: number;
  listId: number;
  name: string;
  description?: string;
  isCompleted?: boolean;
  startedDate?: string;
  endDate?: string;
};

export type TasksList = {
  id: number;
  name: string;
  boardId: number;
  position: number;
};

export type kanbanBoard = {
  id: number;
  name: string;
  isFavorite?: boolean;
}

export type Attachment = {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}
