import prisma from "../prisma/client.js";
import logger from "../utils/logger.js";
import * as WarehouseMovementModel from "../models/warehouseMovement.model.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";
/**
 * جلب جميع حركات المخزن
 */
export const getAllWarehouseMovements = async (filters = {}) => {
  const where = {};

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
  const color_id = parseInt(data.color_id);
  const batch_id = parseInt(data.batch_id);
  // التحقق من وجود اللون
  const existingColor = await prisma.color.findUnique({
    where: { color_id: color_id },
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
    color_id: color_id,
    batch_id: batch_id,
    quantity: Number(data.quantity) || null,
    length: Number(data.length),
    width: Number(data.width),
    thickness: Number(data.thickness) || null,
    destination: data.destination || null,
    user_id: parseInt(userId),
    notes: data.notes || null,
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
  data.color_id = parseInt(data.color_id);
  data.batch_id = parseInt(data.batch_id);
  data.length = Number(data.length);
  data.width = Number(data.width);
  data.thickness = Number(data.thickness) || null;
  data.quantity = Number(data.quantity) || null;
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

export const deleteallWarehouseMovement = async (ids, req = null) => {
  const movements = await WarehouseMovementModel.findAll({ where: { movement_id: { in: ids } } });
  if (movements.length === 0) {
    const error = new Error("لا توجد حركات مخزن لحذفها");
    error.statusCode = 404;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.warehouseMovement.deleteMany({
      where: { movement_id: { in: ids } }
    });
  });

  logger.info("Warehouse movements deleted", { ids });

  // تسجيل النشاط
  if (req) {
    for (const movement of movements) {
      await logDelete(req, "warehouse_movement", movement.movement_id, movement, `Movement-${movement.movement_id}`);
    }
  }

  return { message: "تم حذف حركات المخزن بنجاح" };
};
