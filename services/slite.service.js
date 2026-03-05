import prisma from "../prisma/client.js";
import logger from "../utils/logger.js";
import * as SliteModel from "../models/slite.model.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js"; 

/**
 * جلب جميع Slite
 */
export const getAllSlites = async (filters = {}) => {
  const where = {};
  if (filters.production_order_item_id) {
    where.production_order_item_id = parseInt(filters.production_order_item_id);
  }
  if (filters.destination) {
    where.destination = filters.destination;
  }

  const [slites, total] = await Promise.all([
    SliteModel.findAll({ where }),
    SliteModel.count(where),
  ]);

  return { slites, total };
};

/**
 * جلب Slite واحد
 */
export const getSliteById = async (id) => {
  const slite = await SliteModel.findById(id);
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
export const createSlite = async (data, userId , req = null) => {
  // التحقق من وجود عنصر طلب الإنتاج
  const existingItem = await prisma.productionOrderItem.findUnique({
    where: { production_order_item_id: data.production_order_item_id },
  });

  if (!existingItem) {
    const error = new Error("عنصر طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // التأكد من عدم تكرار الباركود
  const existingBarcode = await SliteModel.findByBarcode(data.barcode);
  if (existingBarcode) {
    const error = new Error("الباركود مستخدم مسبقاً");
    error.statusCode = 400;
    throw error;
  }

  const slite = await SliteModel.create({
    ...data,
    user_id: userId,
  });

  logger.info("Slite created", { slite_id: slite.slite_id, user_id: userId });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "slite", slite.slite_id, slite, `Slite-${slite.slite_id}`);
  }
  return slite;
};

/**
 * تحديث Slite
 */
export const updateSlite = async (id, data , req = null) => {
  const existing = await SliteModel.findById(id);
  if (!existing) {
    const error = new Error("عملية Slite غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  const slite = await SliteModel.updateById(id, data);

  logger.info("Slite updated", { slite_id: id });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "slite", id, existing, slite, `Slite-${id}`);
  }
  return slite;
};

/**
 * حذف Slite
 */
export const deleteSlite = async (id , req = null) => {
  const existing = await SliteModel.findById(id);
  if (!existing) {
    const error = new Error("عملية Slite غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  await SliteModel.deleteById(id);
  logger.info("Slite deleted", { slite_id: id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "slite", id, existing, `Slite-${id}`);
  }
  return { message: "تم حذف عملية التقطيع بنجاح" };
};