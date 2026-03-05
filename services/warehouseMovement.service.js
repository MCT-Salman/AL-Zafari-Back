import prisma from "../prisma/client.js";
import logger from "../utils/logger.js";
import * as WarehouseMovementModel from "../models/warehouseMovement.model.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";
/**
 * جلب جميع حركات المخزن
 */
export const getAllWarehouseMovements = async (filters = {}) => {
  const where = {};
  
  if (filters.production_order_item_id) {
    where.production_order_item_id = parseInt(filters.production_order_item_id);
  }
  if (filters.color_id) {
    where.color_id = parseInt(filters.color_id);
  }
  if (filters.batch_id) {
    where.batch_id = parseInt(filters.batch_id);
  }
  if (filters.destination) {
    where.destination = filters.destination;
  }
 
  const [movements, total] = await Promise.all([
    WarehouseMovementModel.findAll({ where }),
    WarehouseMovementModel.count(where),
  ]);

  return { movements, total };
};

/**
 * جلب حركة مخزن واحدة
 */
export const getWarehouseMovementById = async (id) => {
  const movement = await WarehouseMovementModel.findById(id);
  if (!movement) {
    const error = new Error("حركة المخزن غير موجودة");
    error.statusCode = 404;
    throw error;
  }
  return movement;
};

/**
 * إنشاء حركة مخزن جديدة
 */
export const createWarehouseMovement = async (data, userId , req = null) => {
  // التحقق من وجود عنصر طلب الإنتاج
  const existingItem = await prisma.productionOrderItem.findUnique({
    where: { production_order_item_id: data.production_order_item_id },
  });
  
  if (!existingItem) {
    const error = new Error("عنصر طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // التحقق من وجود اللون
  const existingColor = await prisma.color.findUnique({
    where: { color_id: data.color_id },
  });
  
  if (!existingColor) {
    const error = new Error("اللون غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // التحقق من وجود الدفعة
  const existingBatch = await prisma.batch.findUnique({
    where: { batch_id: data.batch_id },
  });
  
  if (!existingBatch) {
    const error = new Error("الدفعة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  const movement = await WarehouseMovementModel.create({
    ...data,
    user_id: userId,
  });
  
  logger.info("Warehouse movement created", { 
    movement_id: movement.movement_id, 
    user_id: userId 
  });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "warehouse_movement", movement.movement_id, movement, `Movement-${movement.movement_id}`);
  }
  
  return movement;
};

/**
 * تحديث حركة مخزن
 */
export const updateWarehouseMovement = async (id, data , req = null) => {
  const existing = await WarehouseMovementModel.findById(id);
  if (!existing) {
    const error = new Error("حركة المخزن غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  const movement = await WarehouseMovementModel.updateById(id, data);

  logger.info("Warehouse movement updated", { movement_id: id });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "warehouse_movement", id, existing, movement, `Movement-${id}`);
  }
  return movement;
};

/**
 * حذف حركة مخزن
 */
export const deleteWarehouseMovement = async (id , req = null) => {
  const existing = await WarehouseMovementModel.findById(id);
  if (!existing) {
    const error = new Error("حركة المخزن غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  await WarehouseMovementModel.deleteById(id);
  logger.info("Warehouse movement deleted", { movement_id: id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "warehouse_movement", id, existing, `Movement-${id}`);
  }
  return { message: "تم حذف حركة المخزن بنجاح" };
};

