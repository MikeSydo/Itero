import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req, res) => {
  const lists = await prisma.tasksList.findMany({
    orderBy: { position: 'asc' },
  });
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
  const tasks = await prisma.task.findMany({ 
    where: { listId: id },
    orderBy: { position: 'asc' },
  });
  return res.json(tasks);
});

router.post('/', async (req, res) => {
  try {
    const { boardId } = req.body;
    const maxPosition = await prisma.tasksList.findFirst({
      where: { boardId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const position = (maxPosition?.position ?? -1) + 1;
    
    const list = await prisma.tasksList.create({
      data: { ...req.body, position },
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
  
  const { name, position } = req.body;
  
  const updateData: any = {};
  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name must be a non-empty string' });
    }
    updateData.name = name.trim();
  }
  if (position !== undefined) {
    if (!Number.isFinite(position)) {
      return res.status(400).json({ error: 'Position must be a number' });
    }
    updateData.position = position;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  try {
    const updatedList = await prisma.tasksList.update({
      where: { id },
      data: updateData,
    });
    return res.json(updatedList);
  } catch (error) {
    return res.status(404).json({ error: 'List not found' });
  }
});

export default router;
