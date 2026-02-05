import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getAllBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch
} from '../controllers/batch.controller.js';

import {
  createBatchRules,
  updateBatchRules,
  batchIdParamRules,
  getBatchesQueryRules
} from '../validators/batch.validators.js';

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.get('/', validate(getBatchesQueryRules), getAllBatches);
router.get('/:id', validate(batchIdParamRules), getBatchById);

// POST, PUT, DELETE routes - admin only
router.post('/', requireRole(['admin']), validate(createBatchRules), createBatch);
router.put('/:id', requireRole(['admin']), validate([...batchIdParamRules, ...updateBatchRules]), updateBatch);
router.delete('/:id', requireRole(['admin']), validate(batchIdParamRules), deleteBatch);

export default router;

