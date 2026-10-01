// src/routes/tasks.ts
import { Router } from 'express';
import { createCrudController } from '../controllers/crudController';
import { taskService } from '../services/taskService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema } from '../validators';

const router = Router();
const ctrl = createCrudController(taskService, 'Task');

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, validate(createTaskSchema), ctrl.create);
router.put('/:id', authenticate, validate(updateTaskSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

export default router;
