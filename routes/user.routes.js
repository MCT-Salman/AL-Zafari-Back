import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus
} from '../controllers/user.controller.js';

import {
  createUserRules,
  updateUserRules,
  userIdParamRules,
  getUsersQueryRules
} from '../validators/user.validators.js';

const router = Router();

// Apply authentication to all routes
router.use(requireAuth, requireRole(['admin']));

router.get('/', validate(getUsersQueryRules), getAllUsers);
router.get('/:id', validate(userIdParamRules), getUserById);
router.post('/', validate(createUserRules), createUser);
router.put('/:id', validate([...userIdParamRules, ...updateUserRules]), updateUser);
router.delete('/:id', validate(userIdParamRules), deleteUser);
router.patch('/:id/toggle-status', validate(userIdParamRules), toggleUserStatus);

export default router;
