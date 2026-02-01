import * as UserService from '../services/user.service.js';
import { serializeResponse } from '../utils/serialize.js';
import { FAILURE_REQUEST, SUCCESS_REQUEST } from '../validators/messagesResponse.js';
import { BAD_REQUEST_STATUS_CODE, NOT_FOUND_STATUS_CODE, SUCCESS_CREATE_STATUS_CODE, SUCCESS_STATUS_CODE } from '../validators/statusCode.js';
import logger from '../utils/logger.js';

/**
 * Get all users with pagination and filters
 * GET /user
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, search, role, isActive } = req.query;

    const result = await UserService.getAllUsers({
      page,
      limit,
      search,
      role,
      isActive
    });

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: 'تم جلب المستخدمين بنجاح',
      data: serializeResponse(result)
    });
  } catch (error) {
    logger.error('Get all users controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id
    });
    error.statusCode = error.statusCode || BAD_REQUEST_STATUS_CODE;
    return next(error);
  }
};

/**
 * Get user by ID
 * GET /user/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_STATUS_CODE).json({
        success: FAILURE_REQUEST,
        message: 'معرف المستخدم غير صالح',
        data: {}
      });
    }

    const user = await UserService.getUserById(userId);

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: 'تم جلب بيانات المستخدم بنجاح',
      data: serializeResponse(user)
    });
  } catch (error) {
    logger.error('Get user by ID controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
      targetUserId: req.params.id
    });
    error.statusCode = error.statusCode || NOT_FOUND_STATUS_CODE;
    return next(error);
  }
};

/**
 * Create new user
 * POST /user
 */
export const createUser = async (req, res, next) => {
  try {
    const { username, phone, password, full_name, role, notes } = req.body;
    const adminId = req.user.id;

    const newUser = await UserService.createUser(
      { username, phone, password, full_name, role, notes },
      adminId
    );

    res.status(SUCCESS_CREATE_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: 'تم إنشاء المستخدم بنجاح',
      data: serializeResponse(newUser)
    });
  } catch (error) {
    logger.error('Create user controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
      body: req.body
    });
    error.statusCode = error.statusCode || BAD_REQUEST_STATUS_CODE;
    return next(error);
  }
};

/**
 * Update user
 * PUT /user/:id
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_STATUS_CODE).json({
        success: FAILURE_REQUEST,
        message: 'معرف المستخدم غير صالح',
        data: {}
      });
    }

    const { username, phone, password, full_name, role, is_active, notes } = req.body;
    const adminId = req.user.id;

    const updatedUser = await UserService.updateUser(
      userId,
      { username, phone, password, full_name, role, is_active, notes },
      adminId
    );

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: 'تم تحديث بيانات المستخدم بنجاح',
      data: serializeResponse(updatedUser)
    });
  } catch (error) {
    logger.error('Update user controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
      targetUserId: req.params.id,
      body: req.body
    });
    error.statusCode = error.statusCode || BAD_REQUEST_STATUS_CODE;
    return next(error);
  }
};

/**
 * Delete user
 * DELETE /user/:id
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_STATUS_CODE).json({
        success: FAILURE_REQUEST,
        message: 'معرف المستخدم غير صالح',
        data: {}
      });
    }

    const adminId = req.user.id;
    const result = await UserService.deleteUser(userId, adminId);

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {}
    });
  } catch (error) {
    logger.error('Delete user controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
      targetUserId: req.params.id
    });
    error.statusCode = error.statusCode || BAD_REQUEST_STATUS_CODE;
    return next(error);
  }
};

/**
 * Toggle user active status
 * PATCH /user/:id/toggle-status
 */
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_STATUS_CODE).json({
        success: FAILURE_REQUEST,
        message: 'معرف المستخدم غير صالح',
        data: {}
      });
    }

    const adminId = req.user.id;
    const updatedUser = await UserService.toggleUserStatus(userId, adminId);

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: `تم ${updatedUser.is_active ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح`,
      data: serializeResponse(updatedUser)
    });
  } catch (error) {
    logger.error('Toggle user status controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
      targetUserId: req.params.id
    });
    error.statusCode = error.statusCode || BAD_REQUEST_STATUS_CODE;
    return next(error);
  }
};
