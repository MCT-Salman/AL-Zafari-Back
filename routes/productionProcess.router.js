import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

import {
    getProcesses,
    getProcessesByType,
    getProcessById,
    createProcess,
    updateProcess,
    deleteProcess,
    deleteallProductionProcess
} from '../controllers/productionProcess.controller.js';

import {
    productionProcessIdParamRules,
    getProductionProcessesQueryRules,
    createProductionProcessRules,
    updateProductionProcessRules,
    allProductionProcessesarrayRules,
    productionProcessTypeParamRules
} from '../validators/productionProcess.validators.js';

const router = Router();

// Auth required
router.use(requireAuth);

// Routes
router.get('/', requireRole(["admin", "production_manager", "Cutting_Technician", "Gluing_Technician",]), validate(getProductionProcessesQueryRules), getProcesses);
router.get('/type/:type', requireRole(["admin", "production_manager", "Cutting_Technician", "Gluing_Technician",]), validate(productionProcessTypeParamRules), getProcessesByType);
router.get('/:id', requireRole(["admin", "production_manager", "Cutting_Technician", "Gluing_Technician",]), validate(productionProcessIdParamRules), getProcessById);
router.post('/', requireRole(["admin", "production_manager" , "Cutting_Technician", "Gluing_Technician"]), validate(createProductionProcessRules), createProcess);
router.put('/:id', requireRole(["admin", "production_manager" , "Cutting_Technician", "Gluing_Technician"]), validate([...productionProcessIdParamRules, ...updateProductionProcessRules]), updateProcess);
router.delete('/all', requireRole(["admin", "production_manager"]), validate(allProductionProcessesarrayRules), deleteallProductionProcess);
router.delete('/:id', requireRole(["admin", "production_manager" , "Cutting_Technician", "Gluing_Technician"]), validate(productionProcessIdParamRules), deleteProcess);

export default router;