import prisma from "../prisma/client.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع Slite
 */
export const getAllSlites = async (filters = {}) => {
  const where = {};
  if (filters.production_order_item_id) {
    where.production_order_item_id = parseInt(filters.production_order_item_id);
  }

  const slites = await prisma.slite.findMany({
    where,
    orderBy: { created_at: "desc" },
  });

  return slites;
};

/**
 * جلب Slite واحد
 */
export const getSliteById = async (id) => {
  const slite = await prisma.slite.findUnique({ where: { slite_id: id } });
  if (!slite) {
    const error = new Error("عملية Slite غير موجودة");
    error.statusCode = 404;
    throw error;
  }
  return slite;
};

/**
 * إنشاء Slite جديد
 */
export const createSlite = async (data, userId) => {
  const slite = await prisma.slite.create({
    data: {
      ...data,
      user_id: userId,
    },
  });
  logger.info("Slite created", { slite_id: slite.slite_id, user_id: userId });
  return slite;
};

/**
 * تحديث Slite
 */
export const updateSlite = async (id, data) => {
  const existing = await prisma.slite.findUnique({ where: { slite_id: id } });
  if (!existing) {
    const error = new Error("عملية Slite غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  const slite = await prisma.slite.update({
    where: { slite_id: id },
    data,
  });

  logger.info("Slite updated", { slite_id: id });
  return slite;
};

/**
 * حذف Slite
 */
export const deleteSlite = async (id) => {
  const existing = await prisma.slite.findUnique({ where: { slite_id: id } });
  if (!existing) {
    const error = new Error("عملية Slite غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  await prisma.slite.delete({ where: { slite_id: id } });
  logger.info("Slite deleted", { slite_id: id });
  return { message: "تم حذف عملية التقطيع بنجاح" };
};