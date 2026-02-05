import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getAllPriceColors,
  getPriceColorById,
  createPriceColor,
  updatePriceColor,
  deletePriceColor
} from '../controllers/priceColor.controller.js';

import {
  createPriceColorRules,
  updatePriceColorRules,
  priceColorIdParamRules,
  getPriceColorsQueryRules
} from '../validators/priceColor.validators.js';

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.get('/', validate(getPriceColorsQueryRules), getAllPriceColors);
router.get('/:id', validate(priceColorIdParamRules), getPriceColorById);

// POST, PUT, DELETE routes - admin only
router.post('/', requireRole(['admin']), validate(createPriceColorRules), createPriceColor);
router.put('/:id', requireRole(['admin']), validate([...priceColorIdParamRules, ...updatePriceColorRules]), updatePriceColor);
router.delete('/:id', requireRole(['admin']), validate(priceColorIdParamRules), deletePriceColor);

export default router;

