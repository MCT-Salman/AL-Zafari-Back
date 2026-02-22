import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getAllColors,
  getColorsByRulerId,
  getColorById,
  createColor,
  updateColor,
  deleteColor
} from '../controllers/color.controller.js';

import {
  rulerIdParamRules,
  createColorRules,
  updateColorRules,
  colorIdParamRules,
  getColorsQueryRules
} from '../validators/color.validators.js';
import { uploadImage } from "../middlewares/upload.middleware.js";


const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.get('/', validate(getColorsQueryRules), getAllColors);
router.get('/ruler/:id', validate(rulerIdParamRules), getColorsByRulerId);
router.get('/:id', validate(colorIdParamRules), getColorById);

// POST, PUT, DELETE routes - admin only
router.post('/', requireRole(['admin']),uploadImage.single('imageUrl'), validate(createColorRules), createColor);
router.put('/:id', requireRole(['admin']),uploadImage.single('imageUrl'), validate([...colorIdParamRules, ...updateColorRules]), updateColor);
router.delete('/:id', requireRole(['admin']), validate(colorIdParamRules), deleteColor);

export default router;

