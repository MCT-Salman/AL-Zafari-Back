// services/productionOrder.service.js
import {
  ProductionOrderModel,
  ProductionOrderItemModel,
  RulerModel,
  BatchModel,
  ConstantValueModel,
  ColorModel,
} from "../models/index.js";
import logger from "../utils/logger.js";
import prisma from "../prisma/client.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";
const { notifyProductionOrder , notifyProductionOrderCompleted } = await import("../utils/notificationHelper.js");

/**
 * Helper function to check user permissions based on production type
 */
const canAccessProductionType = (userRole, productionType) => {
  const rolePermissions = {
    admin: ['warehouse', 'slitting', 'cutting', 'gluing'],
    production_manager: ['warehouse', 'slitting', 'cutting', 'gluing'],
    Warehouse_Keeper: ['warehouse'],
    Warehouse_Products: ['warehouse'],
    Dissection_Technician: ['slitting'],
    Cutting_Technician: ['cutting'],
    Gluing_Technician: ['gluing'],
  };

  const allowedTypes = rolePermissions[userRole] || [];
  return allowedTypes.includes(productionType);
};

/**
 * Get allowed production types for a user role
 */
const getAllowedProductionTypes = (userRole) => {
  const rolePermissions = {
    admin: ['warehouse', 'slitting', 'cutting', 'gluing'],
    production_manager: ['warehouse', 'slitting', 'cutting', 'gluing'],
    Warehouse_Keeper: ['warehouse'],
    Warehouse_Products: ['warehouse'],
    Dissection_Technician: ['slitting'],
    Cutting_Technician: ['cutting'],
    Gluing_Technician: ['gluing'],
  };

  return rolePermissions[userRole] || [];
};

/**
 * جلب جميع أوامر الإنتاج مع الفلتر والصلاحيات
 */
export const getAllProductionOrders = async (filters = {}, userRole, userId) => {
  const where = {};

  // Filter by status
  if (filters.status) {
    where.status = filters.status;
  }

  // Search functionality
  if (filters.search) {
    where.OR = [
      { notes: { contains: filters.search } },
      { production_order_id: isNaN(parseInt(filters.search)) ? undefined : parseInt(filters.search) },
    ].filter(item => item.production_order_id !== undefined || item.notes);
  }

  const [productionOrders, total] = await Promise.all([
    ProductionOrderModel.findAll({ where }),
    ProductionOrderModel.count(where),
  ]);

  // Filter items based on user role
  const allowedTypes = getAllowedProductionTypes(userRole);
  const filteredOrders = productionOrders.map(order => {
    const filteredItems = order.items.filter(item =>
      allowedTypes.includes(item.type)
    );

    return {
      ...order,
      items: filteredItems,
    };
  });

  const response = filteredOrders.map((order) => ({
    production_order_id: order.production_order_id,
    issued_by: order.user,
    status: order.status,
    notes: order.notes,
    created_at: order.created_at,
  }));
  return {
    orders: response,
    total
  };
};

/**
 * جلب طلب إنتاج حسب المعرف مع الصلاحيات
 */
export const getProductionOrderById = async (production_order_id, userRole) => {
  const productionOrder = await ProductionOrderModel.findById(production_order_id);
  if (!productionOrder) {
    const error = new Error("طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }
  const response = {
    production_order_id: productionOrder.production_order_id,
    issued_by: productionOrder.user,
    type_item: productionOrder.type_item,
    width: productionOrder.width,
    length: productionOrder.length,
    thickness: productionOrder.thickness,
    material_name: productionOrder.color.ruler.material.material_name,
    ruler_type: productionOrder.color.ruler.ruler_name,
    color_code: productionOrder.color.color_code,
    color_name: productionOrder.color.color_name,
    batch_number: productionOrder.batch.batch_number,
    status: productionOrder.status,
    notes: productionOrder.notes,
    created_at: productionOrder.created_at,
  };

  return {
    ...response,
  };
};

/**
 * إنشاء طلب إنتاج جديد مع عناصر متعددة حسب أنواع الإنتاج
 */
export const createProductionOrder = async (userId, data, req = null) => {
  return await prisma.$transaction(async (tx) => {

    const order = await tx.productionOrder.create({
      data: {
        issued_by: userId,
        status: "preparing",
        notes: data.notes || null,
      },
    });

    const FLOW_MAP = {
      warehouse: { destination: "slitting" },
      slitting: { destination: "production" },
      cutting: { destination: "gluing" },
      gluing: { destination: "production" },
    };

    const PROCESS_ORDER = ["warehouse", "slitting", "cutting", "gluing"];

    const createdItems = [];

    for (const item of data.items) {

      const orderedProcesses = PROCESS_ORDER.filter(p =>
        item.production_types.includes(p)
      );

      let previousProcess = null;

      for (const process of orderedProcesses) {

        let destination = FLOW_MAP[process]?.destination;
        if (process === "slitting") {
          previousProcess = item.source;
        }

        // تعديل المسار إذا كان هناك cutting
        if (process === "slitting" && orderedProcesses.includes("cutting")) {
          destination = "cutting";
        }

        const createdItem = await tx.productionOrderItem.create({
          data: {
            production_order_id: order.production_order_id,

            type: process,

            source: previousProcess ? previousProcess : process,

            destination,

            color_id: item.color_id,
            batch_id: item.batch_id,
            thickness: item.thickness,
            type_item: item.type_item,

            width: item.width,
            length: item.length,

            quantity: item.quantity || 0,

            status: "pending",
            notes: item.notes || null,
          },
        });

        createdItems.push(createdItem);

        previousProcess = process;
      }
    }

    logger.info("Production order items created", {
      production_order_id: order.production_order_id,
      count: createdItems.length,
    });

    if (req) {
      await logCreate(
        req,
        "production_order_item",
        order.production_order_id,
        createdItems,
        `Production order item-${createdItems.map(i => i.production_order_item_id)}`
      );

      try {
        await notifyProductionOrder(order, createdItems, userId);
      } catch (error) {
        logger.error("Error sending production order notification:", error);
      }
    }

    return { order, items: createdItems };
  });
};

/**
 * تحديث طلب إنتاج
 */
export const updateProductionOrder = async (production_order_id, data, userId, userRole, req = null) => {
  // Check if production order exists
  const existingOrder = await ProductionOrderModel.findById(production_order_id);
  if (!existingOrder) {
    const error = new Error("طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }


  // Validate permissions
  if (!['admin', 'production_manager'].includes(userRole)) {
    const error = new Error("ليس لديك صلاحية لتحديث طلبات الإنتاج");
    error.statusCode = 403;
    throw error;
  }


  const updatedOrder = await ProductionOrderModel.updateById(production_order_id, data);
  const response = {
    production_order_id: updatedOrder.production_order_id,
    issued_by: updatedOrder.user,
    status: updatedOrder.status,
    notes: updatedOrder.notes,
    created_at: updatedOrder.created_at,
  };

  logger.info("Production order updated", {
    production_order_id,
    user_id: userId,
  });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "production_order", production_order_id, existingOrder, updatedOrder, `Production order-${production_order_id}`);
  }
  return response;
};

/**
 * حذف طلب إنتاج
 */
export const deleteProductionOrder = async (production_order_id, userRole, req = null) => {

  const existingOrder = await ProductionOrderModel.findById(production_order_id);
  if (!existingOrder) {
    const error = new Error("طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  if (!['admin', 'production_manager'].includes(userRole)) {
    const error = new Error("ليس لديك صلاحية لحذف طلبات الإنتاج");
    error.statusCode = 403;
    throw error;
  }

  const items = await ProductionOrderItemModel.findByProductionOrderId(production_order_id);

  // إذا عندك عمليات مرتبطة بكل عنصر
  const hasCompletedProcess = items.some(item => item.status === 'completed');

  if (hasCompletedProcess) {
    const error = new Error("لا يمكن حذف طلب إنتاج يحتوي على عمليات مكتملة");
    error.statusCode = 400;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.productionOrderItem.deleteMany({
      where: { production_order_id }
    });

    await tx.productionOrder.delete({
      where: { production_order_id }
    });
  });

  logger.info("Production order deleted", { production_order_id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "production_order", production_order_id, existingOrder, `Production order-${production_order_id}`);
  }
  return { message: "تم حذف طلب الإنتاج بنجاح" };
};

/**
 * جلب عنصر طلب إنتاج حسب المعرف مع التحقق من الصلاحيات
 */
export const getProductionOrderItemById = async (production_order_item_id, userRole) => {
  const item = await ProductionOrderItemModel.findById(production_order_item_id);

  if (!item) {
    const error = new Error("عنصر طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // Check if user has permission to view this item type
  if (!canAccessProductionType(userRole, item.type)) {
    const error = new Error("ليس لديك صلاحية لعرض هذا العنصر");
    error.statusCode = 403;
    throw error;
  }

  return item;
};

/**
 * إنشاء عنصر طلب إنتاج
 */
export const createProductionOrderItem = async (
  userId,
  production_order_id,
  data,
  req = null
) => {
  // Check if order exists
  const existingOrder = await ProductionOrderModel.findById(production_order_id);
  if (!existingOrder) {
    const error = new Error("طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }
  const createdItem = await ProductionOrderItemModel.create(data);
  logger.info("Production order item created", {
    production_order_item_id: createdItem.production_order_item_id,
    user_id: userId,
  });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "production_order_item", createdItem.production_order_item_id, createdItem, `Production order item-${createdItem.production_order_item_id}`);
  }
  return createdItem;
};

export const updateProductionOrderItemStatus = async (production_order_item_id, status, userRole, userId, req = null) => {
  // Check if item exists
  const existingItem = await ProductionOrderItemModel.findById(production_order_item_id);
  if (!existingItem) {
    const error = new Error("عنصر طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // Check if user has permission to update this item type
  if (!canAccessProductionType(userRole, existingItem.type)) {
    const error = new Error("ليس لديك صلاحية لتحديث هذا العنصر");
    error.statusCode = 403;
    throw error;
  }

  const updatedItem = await ProductionOrderItemModel.updateById(production_order_item_id, { status });
  if (status === "completed") {

    await notifyProductionOrderCompleted(existingItem, updatedItem, userId);
  }

  logger.info("Production order item status updated", {
    production_order_item_id,
    type: existingItem.type,
  });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "production_order_item", production_order_item_id, existingItem, updatedItem, `Production order item-${production_order_item_id}`);
  }

  return updatedItem;
};

/**
 * تحديث عنصر طلب إنتاج
 */
export const updateProductionOrderItem = async (production_order_item_id, data, userRole, req = null) => {
  // Check if item exists
  const existingItem = await ProductionOrderItemModel.findById(production_order_item_id);
  if (!existingItem) {
    const error = new Error("عنصر طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // Check if user has permission to update this item type
  if (!canAccessProductionType(userRole, existingItem.type)) {
    const error = new Error("ليس لديك صلاحية لتحديث هذا العنصر");
    error.statusCode = 403;
    throw error;
  }

  const updatedItem = await ProductionOrderItemModel.updateById(production_order_item_id, data);

  logger.info("Production order item updated", {
    production_order_item_id,
    type: existingItem.type,
  });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "production_order_item", production_order_item_id, existingItem, updatedItem, `Production order item-${production_order_item_id}`);
  }
  return updatedItem;
};

/**
 * حذف عنصر طلب إنتاج
 */
export const deleteProductionOrderItem = async (production_order_item_id, userRole, req = null) => {
  // Check if item exists
  const existingItem = await ProductionOrderItemModel.findById(production_order_item_id);
  if (!existingItem) {
    const error = new Error("عنصر طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // Check if user has permission to delete this item type
  if (!['admin', 'production_manager'].includes(userRole)) {
    const error = new Error("ليس لديك صلاحية لحذف عناصر أوامر الإنتاج");
    error.statusCode = 403;
    throw error;
  }

  // Check if item has processes
  if (existingItem.processes && existingItem.processes.length > 0) {
    const error = new Error("لا يمكن حذف العنصر لأنه يحتوي على عمليات مرتبطة");
    error.statusCode = 400;
    throw error;
  }

  await ProductionOrderItemModel.deleteById(production_order_item_id);

  logger.info("Production order item deleted", { production_order_item_id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "production_order_item", production_order_item_id, existingItem, `Production order item-${production_order_item_id}`);
  }
  return { message: "تم حذف عنصر طلب الإنتاج بنجاح" };
};

/**
 * جلب عناصر طلب إنتاج حسب نوع الإنتاج
 */
export const getProductionOrderItemsByType = async (production_order_id, userRole) => {
  const productionOrder = await ProductionOrderModel.findByIdWithItems(production_order_id);

  if (!productionOrder) {
    const error = new Error("طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // Filter items based on user role
  const allowedTypes = getAllowedProductionTypes(userRole);
  const filteredItems = productionOrder.items.filter(item =>
    allowedTypes.includes(item.type)
  );

  return filteredItems;
};

export const getAllProductionOrderItemsByType = async (type, userRole) => {

  console.log("type", type);
  // Check if user has permission to view this item type
  if (!canAccessProductionType(userRole, type)) {
    const error = new Error("ليس لديك صلاحية لعرض هذا النوع من العناصر");
    error.statusCode = 403;
    throw error;
  }

  const items = await ProductionOrderItemModel.findAll({ where: { type } });
  return items;
};
