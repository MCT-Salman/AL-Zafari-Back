import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
} from '../controllers/material.controller.js';

import {
  createMaterialRules,
  updateMaterialRules,
  materialIdParamRules,
  getMaterialsQueryRules
} from '../validators/material.validators.js';

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.get('/', validate(getMaterialsQueryRules), getAllMaterials);
router.get('/:id', validate(materialIdParamRules), getMaterialById);

// POST, PUT, DELETE routes - admin only
router.post('/', requireRole(['admin']), validate(createMaterialRules), createMaterial);
router.put('/:id', requireRole(['admin']), validate([...materialIdParamRules, ...updateMaterialRules]), updateMaterial);
router.delete('/:id', requireRole(['admin']), validate(materialIdParamRules), deleteMaterial);

export default router;

