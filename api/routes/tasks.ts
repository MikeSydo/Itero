import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  return res.json(task);
});

router.post('/', async (req, res) => {
  try {
    const task = await prisma.task.create({
      data: req.body,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
  }
});

router.delete('/:id', async (req, res) => {
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

export default router;
