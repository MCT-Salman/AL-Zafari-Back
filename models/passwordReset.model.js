import prisma from '../prisma/client.js';
import logger from '../utils/logger.js';

/**
 * Create a new password reset OTP
 * @param {Object} data - { phone, otp, expiresAt, ip, userAgent }
 * @returns {Promise<Object>}
 */
export const createPasswordReset = async (data) => {
  try {
    return await prisma.passwordReset.create({
      data: {
        phone: data.phone,
        otp: data.otp,
        expiresAt: data.expiresAt,
        ip: data.ip || null,
        userAgent: data.userAgent || null
      }
    });
  } catch (error) {
    logger.error('Create password reset error', { message: error?.message, stack: error?.stack });
    throw error;
  }
};

/**
 * Find active OTP by phone and OTP code
 * @param {string} phone
 * @param {string} otp
 * @returns {Promise<Object|null>}
 */
export const findActiveOTP = async (phone, otp) => {
  try {
    return await prisma.passwordReset.findFirst({
      where: {
        phone,
        otp,
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  } catch (error) {
    logger.error('Find active OTP error', { message: error?.message, stack: error?.stack });
    throw error;
  }
};

/**
 * Find latest OTP by phone (used or not)
 * @param {string} phone
 * @returns {Promise<Object|null>}
 */
export const findLatestOTP = async (phone) => {
  try {
    return await prisma.passwordReset.findFirst({
      where: {
        phone
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  } catch (error) {
    logger.error('Find latest OTP error', { message: error?.message, stack: error?.stack });
    throw error;
  }
};

/**
 * Mark OTP as used
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const markOTPAsUsed = async (id) => {
  try {
    return await prisma.passwordReset.update({
      where: { id },
      data: {
        isUsed: true,
        usedAt: new Date()
      }
    });
  } catch (error) {
    logger.error('Mark OTP as used error', { message: error?.message, stack: error?.stack });
    throw error;
  }
};

/**
 * Increment OTP verification attempts
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const incrementAttempts = async (id) => {
  try {
    return await prisma.passwordReset.update({
      where: { id },
      data: {
        attempts: {
          increment: 1
        }
      }
    });
  } catch (error) {
    logger.error('Increment OTP attempts error', { message: error?.message, stack: error?.stack });
    throw error;
  }
};

/**
 * Delete expired OTPs (cleanup)
 * @returns {Promise<number>} - Count of deleted records
 */
export const deleteExpiredOTPs = async () => {
  try {
    const result = await prisma.passwordReset.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    return result.count;
  } catch (error) {
    logger.error('Delete expired OTPs error', { message: error?.message, stack: error?.stack });
    throw error;
  }
};

/**
 * Delete all OTPs for a phone number
 * @param {string} phone
 * @returns {Promise<number>} - Count of deleted records
 */
export const deleteOTPsByPhone = async (phone) => {
  try {
    const result = await prisma.passwordReset.deleteMany({
      where: { phone }
    });
    return result.count;
  } catch (error) {
    logger.error('Delete OTPs by phone error', { message: error?.message, stack: error?.stack });
    throw error;
  }
};

export const PasswordResetModel = {
  createPasswordReset,
  findActiveOTP,
  findLatestOTP,
  markOTPAsUsed,
  incrementAttempts,
  deleteExpiredOTPs,
  deleteOTPsByPhone
};

