// src/routes/projects.ts
import { Router } from 'express';
import { createCrudController } from '../controllers/crudController';
import { projectService } from '../services/projectService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createProjectSchema, updateProjectSchema } from '../validators';

const router = Router();
const ctrl = createCrudController(projectService, 'Project');

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, validate(createProjectSchema), ctrl.create);
router.put('/:id', authenticate, validate(updateProjectSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

export default router;
