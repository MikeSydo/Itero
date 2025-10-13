import express from 'express';
import cors from 'cors';
import { PrismaClient} from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.use(
  cors({
    origin: [
      'http://localhost:5123',
      'http://127.0.0.1:5123',
    ],
    credentials: true,
  })
);

app.get('/', (_req, res) => {
  res.json({ message: 'server started' });
});

app.get('/tasks', async (_req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

export default app;
