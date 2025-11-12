import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req, res) => {
  const lists = await prisma.tasksList.findMany();
  res.json(lists);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid list id' });
  }
  const list = await prisma.tasksList.findUnique({ where: { id } });
  if (!list) return res.status(404).json({ error: 'List not found' });
  return res.json(list);
});

router.get('/:id/tasks', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid list id' });
  }
  const tasks = await prisma.task.findMany({ where: { listId: id } });
  return res.json(tasks);
});

router.post('/', async (req, res) => {
  try {
    const list = await prisma.tasksList.create({
      data: req.body,
    });
    res.status(201).json(list);
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(400).json({ error: 'Failed to create list' });
  }
});

router.delete('/:id', async (req, res) => {
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

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid list id' });
  }
  
  const { name } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const updatedList = await prisma.tasksList.update({
      where: { id },
      data: { name: name.trim() },
    });
    return res.json(updatedList);
  } catch (error) {
    return res.status(404).json({ error: 'List not found' });
  }
});

export default router;
