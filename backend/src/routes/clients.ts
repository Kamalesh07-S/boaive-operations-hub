// src/routes/clients.ts
import { Router } from 'express';
import { createCrudController } from '../controllers/crudController';
import { clientService } from '../services/clientService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createClientSchema, updateClientSchema } from '../validators';

const router = Router();
const ctrl = createCrudController(clientService, 'Client');

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: List all clients with pagination and filters
 *     tags: [Clients]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 */
router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, validate(createClientSchema), ctrl.create);
router.put('/:id', authenticate, validate(updateClientSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

export default router;
