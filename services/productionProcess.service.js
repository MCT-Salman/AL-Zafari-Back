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

    // التحقق من اللون
    const color = await prisma.color.findUnique({
        where: { color_id: data.color_id },
    });
    if (!color) {
        const error = new Error("اللون غير موجود");
        error.statusCode = 404;
        throw error;
    }

    // التحقق من الطبخة
    const batch = await prisma.batch.findUnique({
        where: { batch_id: data.batch_id },
    });
    if (!batch) {
        const error = new Error("الطبخة غير موجودة");
        error.statusCode = 404;
        throw error;
    }

    // التحقق من نوع العملية
    if (!["cutting", "gluing"].includes(data.type)) {
        const error = new Error("نوع العملية غير صحيح (قص أو تغرية فقط)");
        error.statusCode = 400;
        throw error;
    }
    if (data.type === "gluing" ) {
        data.waste = data.input_length - Number(data.output_length);
    }


    const process = await ProductionProcessModel.create({
        color_id: data.color_id,
        batch_id: data.batch_id,
        type_item: data.type_item || null,
        input_length: data.input_length,
        output_length: data.output_length,
        input_width: data.input_width,
        waste: data.waste || null,
        type: data.type,
        source: data.source || null,
        destination: data.destination || null,
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

    if (filters.color_id) {
        where.color_id = Number(filters.color_id);
    }
    if (filters.batch_id) {
        where.batch_id = Number(filters.batch_id);
    }
    if (filters.type) {
        where.type = filters.type;
    }
    if (filters.source) {
        where.source = filters.source;
    }
    if (filters.type_item) {
        where.type_item = filters.type_item;
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

export const deleteallProductionProcess = async (ids, req = null) => {
    const processes = await ProductionProcessModel.findAll({ where: { process_id: { in: ids } } });
    if (processes.length === 0) {
        const error = new Error("لا توجد عمليات إنتاج لحذفها");
        error.statusCode = 404;
        throw error;
    }

    await prisma.$transaction(async (tx) => {
        await tx.productionProcess.deleteMany({
            where: { process_id: { in: ids } }
        });
    });

    logger.info("Production processes deleted", { ids });

    // تسجيل النشاط
    if (req) {
        for (const process of processes) {
            await logDelete(req, "production_process", process.process_id, process, `Production process-${process.process_id}`);
        }
    }

    return { message: "تم حذف عمليات الإنتاج بنجاح" };
};
