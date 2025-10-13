/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    const tasksList = await prisma.tasksList.create({
        data: { name: 'To-do' }
    });
    await prisma.task.createMany({
        data: [
            {
                name: 'Task 1',
                listId: tasksList.id
            }, 
            {
                name: 'Task 2',
                listId: tasksList.id
            }
        ]
    });
}

seed().then(async () => { prisma.$disconnect(); });