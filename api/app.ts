import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import express from 'express';

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.use(
  cors({
    origin: true, //['http://localhost:5123', 'http://127.0.0.1:5123'],
    credentials: true,
  }),
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
  return res.json(task);
});

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
  return res.json(list);
});

app.get('/lists/:id/tasks', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid list id' });
  }
  const tasks = await prisma.task.findMany({ where: { listId: id } });
  return res.json(tasks);
});

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
  return res.json(board);
});

app.get('/boards/:id/lists', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid board id' });
  }
  const lists = await prisma.tasksList.findMany({ where: { boardId: id } });
  return res.json(lists);
});

app.post('/tasks', async (req, res) => {
  try {
    const task = await prisma.task.create({
      data: req.body,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }
    await prisma.task.delete({
      where: { id },
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: 'Failed to delete task' });
  }
});

app.delete('/lists/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: 'Invalid list id' });
    }
    await prisma.task.deleteMany({
      where: { listId: id },
    });
    await prisma.tasksList.delete({
      where: { id },
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: 'Failed to delete list' });
  }
});

export default app;
