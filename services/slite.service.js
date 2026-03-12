import prisma from "../prisma/client.js";
import logger from "../utils/logger.js";
import * as SliteModel from "../models/slite.model.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js"; 

/**
 * جلب جميع Slite
 */
export const getAllSlites = async (filters = {}) => {
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
  if (filters.source) {
    where.source = filters.source;
  }
  if (filters.type_item) {
    where.type_item = filters.type_item;
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
  // التحقق من وجود اللون
  const color = await prisma.color.findUnique({
    where: { color_id: data.color_id },
  });
  if (!color) {
    const error = new Error("اللون غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // التحقق من وجود الطبخة
  const batch = await prisma.batch.findUnique({
    where: { batch_id: data.batch_id },
  });
  if (!batch) {
    const error = new Error("الطبخة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  const slite = await SliteModel.create({
    color_id: data.color_id,
    batch_id: data.batch_id,
    type_item: data.type_item || null,
    input_length: data.input_length,
    output_length: data.output_length,
    input_width: data.input_width,
    output_length_22: data.output_length_22,
    output_length_44: data.output_length_44,
    source: data.source || null,
    destination: data.destination || null,
    user_id: userId,
    notes: data.notes || null,
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

export const deleteallSlite = async (ids, req = null) => {
  const slites = await SliteModel.findAll({ where: { slite_id: { in: ids } } });
  if (slites.length === 0) {
    const error = new Error("لا توجد عمليات تقطيع لحذفها");
    error.statusCode = 404;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.slite.deleteMany({
      where: { slite_id: { in: ids } }
    });
  });

  logger.info("Slites deleted", { ids });

  // تسجيل النشاط
  if (req) {
    for (const slite of slites) {
      await logDelete(req, "slite", slite.slite_id, slite, `Slite-${slite.slite_id}`);
    }
  }

  return { message: "تم حذف عمليات التقطيع بنجاح" };
};
