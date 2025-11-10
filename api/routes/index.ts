import { Router } from 'express';
import tasksRouter from './tasks';
import listsRouter from './lists';
import boardsRouter from './boards';

const router = Router();

router.use('/tasks', tasksRouter);
router.use('/lists', listsRouter);
router.use('/boards', boardsRouter);

export default router;
