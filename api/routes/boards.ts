import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req, res) => {
  const boards = await prisma.kanbanBoard.findMany();
  res.json(boards);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid board id' });
  }
  const board = await prisma.kanbanBoard.findUnique({ where: { id } });
  if (!board) return res.status(404).json({ error: 'Board not found' });
  return res.json(board);
});

router.get('/:id/lists', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid board id' });
  }
  const lists = await prisma.tasksList.findMany({ where: { boardId: id } });
  return res.json(lists);
});

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid board id' });
  }
  
  const { name } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const updatedBoard = await prisma.kanbanBoard.update({
      where: { id },
      data: { name: name.trim() },
    });
    return res.json(updatedBoard);
  } catch (error) {
    return res.status(404).json({ error: 'Board not found' });
  }
});

router.post('/', async (req, res) => {
  try {
    const board = await prisma.kanbanBoard.create({
      data: req.body,
    });
    res.status(201).json(board);
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(400).json({ error: 'Failed to create board' });
  }
});

export default router;
