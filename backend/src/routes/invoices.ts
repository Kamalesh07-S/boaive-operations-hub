// src/routes/invoices.ts
import { Router } from 'express';
import { createCrudController } from '../controllers/crudController';
import { invoiceService } from '../services/invoiceService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createInvoiceSchema, updateInvoiceSchema } from '../validators';

const router = Router();
const ctrl = createCrudController(invoiceService, 'Invoice');

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, validate(createInvoiceSchema), ctrl.create);
router.put('/:id', authenticate, validate(updateInvoiceSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

export default router;
