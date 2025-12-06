import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Налаштування для завантаження файлів
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

router.get('/', async (_req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { position: 'asc' },
  });
  res.json(tasks);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }
  const task = await prisma.task.findUnique({ 
    where: { id },
    include: { attachments: true }
  });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  return res.json(task);
});

// Отримати всі вкладення таска
router.get('/:id/attachments', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }
  
  try {
    const attachments = await prisma.attachment.findMany({
      where: { taskId: id },
      orderBy: { uploadedAt: 'desc' }
    });
    return res.json(attachments);
  } catch (error) {
    console.error('Error fetching attachments:', error);
    return res.status(500).json({ error: 'Failed to fetch attachments' });
  }
});

// Завантажити файл
router.post('/:id/attachments', upload.single('file'), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Перевірити чи існує таск
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      // Видалити завантажений файл якщо таск не знайдено
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Task not found' });
    }

    const attachment = await prisma.attachment.create({
      data: {
        taskId: id,
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      }
    });

    return res.status(201).json(attachment);
  } catch (error) {
    console.error('Error creating attachment:', error);
    // Видалити файл у разі помилки
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ error: 'Failed to create attachment' });
  }
});

// Видалити вкладення
router.delete('/attachments/:attachmentId', async (req, res) => {
  const attachmentId = Number(req.params.attachmentId);
  if (!Number.isFinite(attachmentId)) {
    return res.status(400).json({ error: 'Invalid attachment id' });
  }

  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId }
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    // Видалити файл з файлової системи
    const filePath = path.join(process.cwd(), attachment.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Видалити запис з бази даних
    await prisma.attachment.delete({
      where: { id: attachmentId }
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting attachment:', error);
    return res.status(500).json({ error: 'Failed to delete attachment' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { listId } = req.body;
    const maxPosition = await prisma.task.findFirst({
      where: { listId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const position = (maxPosition?.position ?? -1) + 1;
    
    const task = await prisma.task.create({
      data: { ...req.body, position },
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

    // Отримати всі вкладення перед видаленням
    const attachments = await prisma.attachment.findMany({
      where: { taskId: id }
    });

    // Видалити файли з файлової системи
    for (const attachment of attachments) {
      const filePath = path.join(process.cwd(), attachment.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Видалити таск (вкладення видаляться автоматично через onDelete: Cascade)
    await prisma.task.delete({
      where: { id },
    });
    
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: 'Failed to delete task' });
  }
});

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }
  
  try {
    const updateData: any = {};
    
    // Оновлення опису
    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }
    
    // Оновлення дат
    if (req.body.startedDate !== undefined) {
      updateData.startedDate = req.body.startedDate ? new Date(req.body.startedDate) : null;
    }
    if (req.body.endDate !== undefined) {
      updateData.endDate = req.body.endDate ? new Date(req.body.endDate) : null;
    }
    
    // Оновлення інших полів
    if (req.body.name !== undefined) {
      updateData.name = req.body.name;
    }
    if (req.body.position !== undefined) {
      updateData.position = req.body.position;
    }
    if (req.body.listId !== undefined) {
      updateData.listId = req.body.listId;
    }
    if (req.body.isCompleted !== undefined) {
      updateData.isCompleted = req.body.isCompleted;
    }
    if (req.body.repeatInterval !== undefined) {
      updateData.repeatInterval = req.body.repeatInterval;
    }
    if (req.body.repeatDays !== undefined) {
      updateData.repeatDays = req.body.repeatDays;
    }
    if (req.body.hasReminder !== undefined) {
      updateData.hasReminder = req.body.hasReminder;
    }
    if (req.body.reminderTime !== undefined) {
      updateData.reminderTime = req.body.reminderTime ? new Date(req.body.reminderTime) : null;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: { attachments: true }
    });
    
    return res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(404).json({ error: 'Task not found' });
  }
});

export default router;