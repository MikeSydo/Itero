import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import express from 'express';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
    credentials: true,
  }),
);

// Boards endpoints without /api prefix (for compatibility)
app.get('/boards', async (_req, res) => {
  const boards = await prisma.kanbanBoard.findMany();
  res.json(boards);
});

app.get('/boards/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid board id' });
  }
  const board = await prisma.kanbanBoard.findUnique({ where: { id } });
  if (!board) return res.status(404).json({ error: 'Board not found' });
  res.json(board);
});

app.get('/boards/:id/lists', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid board id' });
  }
  const lists = await prisma.tasksList.findMany({ where: { boardId: id } });
  res.json(lists);
});

// Lists endpoints without /api prefix
app.get('/lists', async (_req, res) => {
  const lists = await prisma.tasksList.findMany();
  res.json(lists);
});

app.get('/lists/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid list id' });
  }
  const list = await prisma.tasksList.findUnique({ where: { id } });
  if (!list) return res.status(404).json({ error: 'List not found' });
  res.json(list);
});

app.get('/lists/:id/tasks', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid list id' });
  }
  const tasks = await prisma.task.findMany({ where: { listId: id } });
  res.json(tasks);
});

// Tasks endpoints without /api prefix
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
