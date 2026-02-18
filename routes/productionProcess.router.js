import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

import {
    getProcesses,
    getProcessById,
    createProcess,
    updateProcess,
    deleteProcess,
} from '../controllers/productionProcess.controller.js';

import {
    productionProcessIdParamRules,
    getProductionProcessesQueryRules,
    createProductionProcessRules,
    updateProductionProcessRules,
} from '../validators/productionProcess.validators.js';

const router = Router();

// Auth required
router.use(requireAuth);

// Routes
router.get('/', requireRole(["admin", "production_manager", "Warehouse_Keeper", "Dissection_Technician", "Cutting_Technician", "Gluing_Technician",]), validate(getProductionProcessesQueryRules), getProcesses);
router.get('/:id', requireRole(["admin", "production_manager", "Warehouse_Keeper", "Dissection_Technician", "Cutting_Technician", "Gluing_Technician",]), validate(productionProcessIdParamRules), getProcessById);
router.post('/', requireRole(["admin", "production_manager"]), validate(createProductionProcessRules), createProcess);
router.put('/:id', requireRole(["admin", "production_manager"]), validate([...productionProcessIdParamRules, ...updateProductionProcessRules]), updateProcess);
router.delete('/:id', requireRole(["admin", "production_manager"]), validate(productionProcessIdParamRules), deleteProcess);

export default router;