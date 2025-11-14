const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPositions() {
  const lists = await prisma.tasksList.findMany({ 
    orderBy: { position: 'asc' } 
  });
  console.log('Lists with positions:');
  lists.forEach(list => {
    console.log(`  ID: ${list.id}, Name: ${list.name}, Position: ${list.position}`);
  });
  await prisma.$disconnect();
}

checkPositions().catch(console.error);
