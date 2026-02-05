import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getAllConstantValues,
  getConstantValueById,
  createConstantValue,
  updateConstantValue,
  deleteConstantValue,
  getConstantValuesByTypeId
  
} from '../controllers/constantValue.controller.js';
 
import {
  createConstantValueRules,
  updateConstantValueRules,
  constantValueIdParamRules,
  getConstantValuesQueryRules,
  constantTypeIdParamRules
} from '../validators/constantValue.validators.js';

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.get('/', validate(getConstantValuesQueryRules), getAllConstantValues);
router.get('/by-type/:id', validate(constantTypeIdParamRules), getConstantValuesByTypeId);
router.get('/:id', validate(constantValueIdParamRules), getConstantValueById);

// POST, PUT, DELETE routes - admin only
router.post('/', requireRole(['admin']), validate(createConstantValueRules), createConstantValue);
router.put('/:id', requireRole(['admin']), validate([...constantValueIdParamRules, ...updateConstantValueRules]), updateConstantValue);
router.delete('/:id', requireRole(['admin']), validate(constantValueIdParamRules), deleteConstantValue);

export default router;

