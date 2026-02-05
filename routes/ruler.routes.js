import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getAllRulers,
  getRulerById,
  createRuler,
  updateRuler,
  deleteRuler
} from '../controllers/ruler.controller.js';

import {
  createRulerRules,
  updateRulerRules,
  rulerIdParamRules,
  getRulersQueryRules
} from '../validators/ruler.validators.js';

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.get('/', validate(getRulersQueryRules), getAllRulers);
router.get('/:id', validate(rulerIdParamRules), getRulerById);

// POST, PUT, DELETE routes - admin only
router.post('/', requireRole(['admin']), validate(createRulerRules), createRuler);
router.put('/:id', requireRole(['admin']), validate([...rulerIdParamRules, ...updateRulerRules]), updateRuler);
router.delete('/:id', requireRole(['admin']), validate(rulerIdParamRules), deleteRuler);

export default router;

