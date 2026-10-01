// src/routes/expenses.ts
import { Router } from 'express';
import { createCrudController } from '../controllers/crudController';
import { expenseService } from '../services/expenseService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createExpenseSchema, updateExpenseSchema } from '../validators';

const router = Router();
const ctrl = createCrudController(expenseService, 'Expense');

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, validate(createExpenseSchema), ctrl.create);
router.put('/:id', authenticate, validate(updateExpenseSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

export default router;
