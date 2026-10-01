// src/routes/contacts.ts
import { Router } from 'express';
import { createCrudController } from '../controllers/crudController';
import { contactService } from '../services/contactService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createContactSchema, updateContactSchema } from '../validators';

const router = Router();
const ctrl = createCrudController(contactService, 'Contact');

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, validate(createContactSchema), ctrl.create);
router.put('/:id', authenticate, validate(updateContactSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

export default router;
