import prisma from "../prisma/client.js";
import logger from "../utils/logger.js";

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
export const createProductionProcess = async (data, userId, userRole) => {
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
    const existingBarcode = await prisma.productionProcess.findUnique({
        where: { barcode: data.barcode },
    });

    if (existingBarcode) {
        const error = new Error("الباركود مستخدم مسبقاً");
        error.statusCode = 400;
        throw error;
    }

    const process = await prisma.productionProcess.create({
        data: {
            production_order_item_id: data.production_order_item_id,
            input_length: data.input_length,
            output_length: data.output_length,
            input_width: data.input_width,
            waste: data.waste,
            barcode: data.barcode,
            user_id: userId,
            notes: data.notes || null,
        },
        include: {
            item: true,
            user: {
                select: { id: true, username: true, full_name: true },
            },
        },
    });

    logger.info("Production process created", {
        process_id: process.process_id,
        user_id: userId,
    });

    return process;
};

/**
 * تحديث عملية إنتاج
 */
export const updateProductionProcess = async (process_id, data, userRole) => {
    const existing = await prisma.productionProcess.findUnique({
        where: { process_id },
    });

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

    const updated = await prisma.productionProcess.update({
        where: { process_id },
        data,
    });

    logger.info("Production process updated", { process_id });

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

    const process = await prisma.productionProcess.findUnique({
        where: { process_id },
        include: {
            item: true,
            user: true,
        },
    });

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

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const where = {};

    if (filters.production_order_item_id) {
        where.production_order_item_id = Number(filters.production_order_item_id);
    }

    const [processes, total] = await Promise.all([
        prisma.productionProcess.findMany({
            where,
            skip,
            take: limit,
            orderBy: { created_at: "desc" },
            include: { item: true, user: true },
        }),
        prisma.productionProcess.count({ where }),
    ]);

    return { processes, total };
};

/**
 * حذف عملية إنتاج
 */
export const deleteProductionProcess = async (process_id, userRole) => {
    if (!["admin", "production_manager"].includes(userRole)) {
        const error = new Error("ليس لديك صلاحية للحذف");
        error.statusCode = 403;
        throw error;
    }

    const existing = await prisma.productionProcess.findUnique({
        where: { process_id },
    });

    if (!existing) {
        const error = new Error("عملية الإنتاج غير موجودة");
        error.statusCode = 404;
        throw error;
    }

    await prisma.productionProcess.delete({
        where: { process_id },
    });

    logger.info("Production process deleted", { process_id });

    return { message: "تم حذف عملية الإنتاج بنجاح" };
};