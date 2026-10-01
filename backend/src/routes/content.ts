// src/routes/content.ts
import { Router } from 'express';
import { createCrudController } from '../controllers/crudController';
import { contentService } from '../services/contentService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createContentSchema, updateContentSchema } from '../validators';

const router = Router();
const ctrl = createCrudController(contentService, 'Content');

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, validate(createContentSchema), ctrl.create);
router.put('/:id', authenticate, validate(updateContentSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

export default router;
