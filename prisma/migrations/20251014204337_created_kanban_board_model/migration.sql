/*
  Warnings:

  - Added the required column `boardId` to the `TasksList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TasksList" ADD COLUMN     "boardId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "KanbanBoard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "KanbanBoard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TasksList" ADD CONSTRAINT "TasksList_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "KanbanBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
