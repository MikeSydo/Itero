import express from 'express';
import { PrismaClient} from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'server started' });
});

app.get('/tasks', async (_req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

export default app;
