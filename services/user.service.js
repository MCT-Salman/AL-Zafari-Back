import { UserModel } from '../models/index.js';
import { getCountryFromPhone } from '../utils/phoneCountry.js';
import { INSUFFICIENT_PERMISSIONS, NUMBER_ALREADY_EXIST, USERNAME_ALREADY_EXIST, USER_NOT_FOUND } from '../validators/messagesResponse.js';
import prisma from '../prisma/client.js';
import logger from '../utils/logger.js';
import { hashPassword } from '../utils/hash.js';

/**
 * Get all users with filtering and pagination (for admins)
 * @param {object} filters - { page, limit, search, role, isActive }
 * @returns {Promise<{users: User[], total: number, page: number, totalPages: number}>}
 */
export const getAllUsers = async (filters = {}) => {
  try {
    const { page = 1, limit = 10, search = '', role, isActive } = filters;
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    // Search by name, username, or phone
    if (search) {
      where.OR = [
        { full_name: { contains: search } },
        { username: { contains: search } },
        { phone: { contains: search } }
      ];
    }

    // Filter by role
    if (role) {
      where.role = role;
    }

    // Filter by active status
    if (isActive !== undefined) {
      where.is_active = isActive === 'true' || isActive === true;
    }

    // Get users and total count
    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          phone: true,
          username: true,
          full_name: true,
          role: true,
          country: true,
          countryCode: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          notes: true
        }
      }),
      prisma.users.count({ where })
    ]);

    return {
      users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / take),
      limit: take
    };
  } catch (error) {
    logger.error('Get all users error', { message: error?.message, stack: error?.stack });
    throw new Error('فشل في جلب المستخدمين');
  }
};

/**
 * Get user by ID
 * @param {number} userId
 * @returns {Promise<User>}
 */
export const getUserById = async (userId) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        username: true,
        full_name: true,
        role: true,
        country: true,
        countryCode: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        notes: true,
        fcmToken: true
      }
    });

    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    return user;
  } catch (error) {
    logger.error('Get user by ID error', { message: error?.message, stack: error?.stack, userId });
    throw error;
  }
};

/**
 * Create new user (Admin only)
 * @param {object} userData - { username, phone, password, full_name, role, notes }
 * @param {number} adminId - ID of admin creating the user
 * @returns {Promise<User>}
 */
export const createUser = async (userData, adminId) => {
  try {
    const { username, phone, password, full_name, role, notes } = userData;

    // Check if username already exists
    const existingUsername = await UserModel.findByUsername(username);
    if (existingUsername) {
      throw new Error(USERNAME_ALREADY_EXIST);
    }

    // Check if phone already exists
    const existingPhone = await UserModel.findByPhone(phone);
    if (existingPhone) {
      throw new Error(NUMBER_ALREADY_EXIST);
    }

    // Get country info from phone
    const phoneInfo = getCountryFromPhone(phone);
    if (!phoneInfo.success) {
      throw new Error('رقم الهاتف غير صالح');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await prisma.users.create({
      data: {
        username,
        phone,
        password: hashedPassword,
        full_name,
        role: role || 'sales',
        country: phoneInfo.country,
        countryCode: phoneInfo.countryCode,
        is_active: true,
        notes: notes || null
      },
      select: {
        id: true,
        phone: true,
        username: true,
        full_name: true,
        role: true,
        country: true,
        countryCode: true,
        is_active: true,
        created_at: true,
        notes: true
      }
    });

    logger.info('User created', { userId: newUser.id, createdBy: adminId, username: newUser.username });

    return newUser;
  } catch (error) {
    logger.error('Create user error', { message: error?.message, stack: error?.stack, adminId });
    throw error;
  }
};

/**
 * Update user (Admin only)
 * @param {number} userId
 * @param {object} updateData - { username, phone, password, full_name, role, is_active, notes }
 * @param {number} adminId - ID of admin updating the user
 * @returns {Promise<User>}
 */
export const updateUser = async (userId, updateData, adminId) => {
  try {
    // Check if user exists
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw new Error(USER_NOT_FOUND);
    }

    const { username, phone, password, full_name, role, is_active, notes } = updateData;
    const dataToUpdate = {};

    // Check username uniqueness if changed
    if (username && username !== existingUser.username) {
      const usernameExists = await UserModel.findByUsername(username);
      if (usernameExists) {
        throw new Error(USERNAME_ALREADY_EXIST);
      }
      dataToUpdate.username = username;
    }

    // Check phone uniqueness if changed
    if (phone && phone !== existingUser.phone) {
      const phoneExists = await UserModel.findByPhone(phone);
      if (phoneExists) {
        throw new Error(NUMBER_ALREADY_EXIST);
      }

      // Get country info from new phone
      const phoneInfo = getCountryFromPhone(phone);
      if (!phoneInfo.success) {
        throw new Error('رقم الهاتف غير صالح');
      }

      dataToUpdate.phone = phone;
      dataToUpdate.country = phoneInfo.country;
      dataToUpdate.countryCode = phoneInfo.countryCode;
    }

    // Update password if provided
    if (password) {
      dataToUpdate.password = await hashPassword(password);
    }

    // Update other fields
    if (full_name !== undefined) dataToUpdate.full_name = full_name;
    if (role !== undefined) dataToUpdate.role = role;
    if (is_active !== undefined) dataToUpdate.is_active = is_active;
    if (notes !== undefined) dataToUpdate.notes = notes;

    // Update user
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        phone: true,
        username: true,
        full_name: true,
        role: true,
        country: true,
        countryCode: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        notes: true
      }
    });

    logger.info('User updated', { userId, updatedBy: adminId, changes: Object.keys(dataToUpdate) });

    return updatedUser;
  } catch (error) {
    logger.error('Update user error', { message: error?.message, stack: error?.stack, userId, adminId });
    throw error;
  }
};

/**
 * Delete user (Admin only)
 * @param {number} userId
 * @param {number} adminId - ID of admin deleting the user
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deleteUser = async (userId, adminId) => {
  try {
    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    // Prevent admin from deleting themselves
    if (userId === adminId) {
      throw new Error('لا يمكنك حذف حسابك الخاص');
    }

    // Delete user (this will cascade delete related records)
    await prisma.users.delete({
      where: { id: userId }
    });

    logger.info('User deleted', { userId, deletedBy: adminId, username: user.username });

    return {
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    };
  } catch (error) {
    logger.error('Delete user error', { message: error?.message, stack: error?.stack, userId, adminId });
    throw error;
  }
};

/**
 * Toggle user active status (Admin only)
 * @param {number} userId
 * @param {number} adminId - ID of admin toggling status
 * @returns {Promise<User>}
 */
export const toggleUserStatus = async (userId, adminId) => {
  try {
    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    // Prevent admin from deactivating themselves
    if (userId === adminId) {
      throw new Error('لا يمكنك تعطيل حسابك الخاص');
    }

    // Toggle status
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { is_active: !user.is_active },
      select: {
        id: true,
        phone: true,
        username: true,
        full_name: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true
      }
    });

    logger.info('User status toggled', { userId, toggledBy: adminId, newStatus: updatedUser.is_active });

    return updatedUser;
  } catch (error) {
    logger.error('Toggle user status error', { message: error?.message, stack: error?.stack, userId, adminId });
    throw error;
  }
};