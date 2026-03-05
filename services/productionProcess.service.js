import prisma from "../prisma/client.js";
import logger from "../utils/logger.js";
import * as ProductionProcessModel from "../models/productionProcess.model.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

/**
 * صلاحيات الوصول حسب نوع العملية
 */
const canAccessProcess = (userRole) => {
    return [
        "admin",
        "production_manager",
        "Warehouse_Keeper",
        "Dissection_Technician",
        "Cutting_Technician",
        "Gluing_Technician",
    ].includes(userRole);
};

/**
 * إنشاء عملية إنتاج
 */
export const createProductionProcess = async (data, userId, userRole, req = null) => {
    if (!canAccessProcess(userRole)) {
        const error = new Error("ليس لديك صلاحية لإنشاء عملية إنتاج");
        error.statusCode = 403;
        throw error;
    }
    const existingItem = await prisma.productionOrderItem.findUnique({
        where: { production_order_item_id: data.production_order_item_id },
    });
    if (!existingItem) {
        const error = new Error("عنصر طلب الإنتاج غير موجود");
        error.statusCode = 404;
        throw error;
    }
    if (existingItem.status !== "pending") {
        const error = new Error("لا يمكن إنشاء عملية إنتاج لعنصر طلب إنتاج مكتمل أو ملغى");
        error.statusCode = 400;
        throw error;
    }

    if (existingItem.type !== "cutting" && existingItem.type !== "gluing") {
        const error = new Error("لا يمكن إنشاء عملية إنتاج لعنصر طلب إنتاج من هذا النوع");
        error.statusCode = 400;
        throw error;
    }

    // التأكد من عدم تكرار الباركود
    const existingBarcode = await ProductionProcessModel.findByBarcode(data.barcode);

    if (existingBarcode) {
        const error = new Error("الباركود مستخدم مسبقاً");
        error.statusCode = 400;
        throw error;
    }

    const process = await ProductionProcessModel.create({
        production_order_item_id: data.production_order_item_id,
        input_length: data.input_length,
        output_length: data.output_length,
        input_width: data.input_width,
        waste: data.waste,
        barcode: data.barcode,
        type: existingItem.type,
        destination: data.destination,
        user_id: userId,
        notes: data.notes || null,
    });

    logger.info("Production process created", {
        process_id: process.process_id,
        user_id: userId,
    });
    // تسجيل النشاط
    if (req) {
        await logCreate(req, "production_process", process.process_id, process, `Production process-${process.process_id}`);
    }
    return process;
};

/**
 * تحديث عملية إنتاج
 */
export const updateProductionProcess = async (process_id, data, userRole, req = null) => {
    const existing = await ProductionProcessModel.findById(process_id);

    if (!existing) {
        const error = new Error("عملية الإنتاج غير موجودة");
        error.statusCode = 404;
        throw error;
    }

    if (!canAccessProcess(userRole)) {
        const error = new Error("ليس لديك صلاحية لتحديث العملية");
        error.statusCode = 403;
        throw error;
    }

    const updated = await ProductionProcessModel.updateById(process_id, data);

    logger.info("Production process updated", { process_id });
    // تسجيل النشاط
    if (req) {
        await logUpdate(req, "production_process", process_id, existing, updated, `Production process-${process_id}`);
    }

    return updated;
};

/**
 * جلب عملية إنتاج حسب ID
 */
export const getProductionProcessById = async (process_id, userRole) => {
    if (!canAccessProcess(userRole)) {
        const error = new Error("ليس لديك صلاحية");
        error.statusCode = 403;
        throw error;
    }

    const process = await ProductionProcessModel.findById(process_id);

    if (!process) {
        const error = new Error("عملية الإنتاج غير موجودة");
        error.statusCode = 404;
        throw error;
    }

    return process;
};

/**
 * جلب جميع عمليات الإنتاج (مع pagination)
 */
export const getAllProductionProcesses = async (filters = {}, userRole) => {
    if (!canAccessProcess(userRole)) {
        const error = new Error("ليس لديك صلاحية");
        error.statusCode = 403;
        throw error;
    }

    const where = {};

    if (filters.production_order_item_id) {
        where.production_order_item_id = Number(filters.production_order_item_id);
    }
    if (filters.type) {
        where.type = filters.type;
    }

    const [processes, total] = await Promise.all([
        ProductionProcessModel.findAll({ where }),
        ProductionProcessModel.count(where),
    ]);

    return { processes, total };
};

/**
 * حذف عملية إنتاج
 */
export const deleteProductionProcess = async (process_id, userRole, req = null) => {
    if (!["admin", "production_manager"].includes(userRole)) {
        const error = new Error("ليس لديك صلاحية للحذف");
        error.statusCode = 403;
        throw error;
    }

    const existing = await ProductionProcessModel.findById(process_id);

    if (!existing) {
        const error = new Error("عملية الإنتاج غير موجودة");
        error.statusCode = 404;
        throw error;
    }

    await ProductionProcessModel.deleteById(process_id);

    logger.info("Production process deleted", { process_id });
    // تسجيل النشاط
    if (req) {
        await logDelete(req, "production_process", process_id, existing, `Production process-${process_id}`);
    }
    return { message: "تم حذف عملية الإنتاج بنجاح" };
};