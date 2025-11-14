-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TasksList" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;
