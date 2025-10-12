import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    await prisma.task.createMany({
        data: [
            { title: 'To-do' }, 
            { title: 'Done' }
        ]
    });
}

seed().then(async () => { prisma.$disconnect(); });