// src/routes/assets.ts
import { Router } from 'express';
import { createCrudController } from '../controllers/crudController';
import { assetService } from '../services/assetService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAssetSchema, updateAssetSchema } from '../validators';

const router = Router();
const ctrl = createCrudController(assetService, 'Asset');

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, validate(createAssetSchema), ctrl.create);
router.put('/:id', authenticate, validate(updateAssetSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

export default router;
