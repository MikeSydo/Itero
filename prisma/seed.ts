/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const board = await prisma.kanbanBoard.create({
    data: { name: 'Board1' },
  });

  const todoList = await prisma.tasksList.create({
    data: {
      name: 'To-do',
      board: { connect: { id: board.id } },
    },
  });
  const doneList = await prisma.tasksList.create({
    data: {
      name: 'Done',
      board: { connect: { id: board.id } },
    },
  });

  await prisma.task.createMany({
    data: [
      {
        name: 'Task 1',
        listId: todoList.id,
      },
      {
        name: 'Task 2',
        listId: todoList.id,
      },
      {
        name: 'Task 1',
        listId: doneList.id,
      },
      {
        name: 'Task 2',
        listId: doneList.id,
      },
    ],
  });
}

seed().then(async () => {
  prisma.$disconnect();
});
