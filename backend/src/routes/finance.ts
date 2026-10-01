// src/routes/finance.ts
import { Router } from 'express';
import { createCrudController } from '../controllers/crudController';
import { financeService } from '../services/financeService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createFinanceSchema, updateFinanceSchema } from '../validators';

const router = Router();
const ctrl = createCrudController(financeService, 'Finance record');

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, validate(createFinanceSchema), ctrl.create);
router.put('/:id', authenticate, validate(updateFinanceSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

export default router;
