-- CreateTable
CREATE TABLE "Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "listId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startedDate" DATETIME,
    "endDate" DATETIME,
    "repeatInterval" TEXT,
    "repeatDays" TEXT,
    "hasReminder" BOOLEAN NOT NULL DEFAULT false,
    "reminderTime" DATETIME,
    CONSTRAINT "Task_listId_fkey" FOREIGN KEY ("listId") REFERENCES "TasksList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TasksList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "boardId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "TasksList_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "KanbanBoard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KanbanBoard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
