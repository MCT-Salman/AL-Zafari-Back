import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getAllConstantTypes,
  getConstantTypeById,
  createConstantType,
  updateConstantType,
  deleteConstantType
} from '../controllers/constantType.controller.js';

import {
  createConstantTypeRules,
  updateConstantTypeRules,
  constantTypeIdParamRules,
  getConstantTypesQueryRules
} from '../validators/constantType.validators.js';

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.get('/', validate(getConstantTypesQueryRules), getAllConstantTypes);
router.get('/:id', validate(constantTypeIdParamRules), getConstantTypeById);

// POST, PUT, DELETE routes - admin only
router.post('/', requireRole(['admin']), validate(createConstantTypeRules), createConstantType);
router.put('/:id', requireRole(['admin']), validate([...constantTypeIdParamRules, ...updateConstantTypeRules]), updateConstantType);
router.delete('/:id', requireRole(['admin']), validate(constantTypeIdParamRules), deleteConstantType);

export default router;

