import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import * as UserController from '../controllers/user.controller.js';
import {
  createUserRules,
  updateUserRules,
  userIdParamRules,
  getUsersQueryRules
} from '../validators/user.validators.js';

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

/**
 * @route   GET /user
 * @desc    Get all users with pagination and filters
 * @access  Admin only
 */
router.get(
  '/',
  requireRole(['admin']),
  validate(getUsersQueryRules),
  UserController.getAllUsers
);

/**
 * @route   GET /user/:id
 * @desc    Get user by ID
 * @access  Admin only
 */
router.get(
  '/:id',
  requireRole(['admin']),
  validate(userIdParamRules),
  UserController.getUserById
);

/**
 * @route   POST /user
 * @desc    Create new user
 * @access  Admin only
 */
router.post(
  '/',
  requireRole(['admin']),
  validate(createUserRules),
  UserController.createUser
);

/**
 * @route   PUT /user/:id
 * @desc    Update user
 * @access  Admin only
 */
router.put(
  '/:id',
  requireRole(['admin']),
  validate([...userIdParamRules, ...updateUserRules]),
  UserController.updateUser
);

/**
 * @route   DELETE /user/:id
 * @desc    Delete user
 * @access  Admin only
 */
router.delete(
  '/:id',
  requireRole(['admin']),
  validate(userIdParamRules),
  UserController.deleteUser
);

/**
 * @route   PATCH /user/:id/toggle-status
 * @desc    Toggle user active status
 * @access  Admin only
 */
router.patch(
  '/:id/toggle-status',
  requireRole(['admin']),
  validate(userIdParamRules),
  UserController.toggleUserStatus
);

export default router;
