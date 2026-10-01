// src/routes/leads.ts
import { Router } from 'express';
import { createCrudController } from '../controllers/crudController';
import { leadService } from '../services/leadService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLeadSchema, updateLeadSchema } from '../validators';

const router = Router();
const ctrl = createCrudController(leadService, 'Lead');

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, validate(createLeadSchema), ctrl.create);
router.put('/:id', authenticate, validate(updateLeadSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

export default router;
