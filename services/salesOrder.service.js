// services/SalesOrder.service.js
import {
  SalesOrderModel,
  SalesOrderItemModel,
  RulerModel,
  BatchModel,
  ConstantValueModel,
  ColorModel,
} from "../models/index.js";
import logger from "../utils/logger.js";
import prisma from "../prisma/client.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

/**
 * جلب جميع أوامر الإنتاج مع الفلتر والصلاحيات
 */
export const getAllSalesOrders = async (filters = {}, userId) => {

  const where = {};

  // Filter by status
  if (filters.status) {
    where.status = filters.status;
  }

  // Search functionality
  if (filters.search) {
    where.OR = [
      { notes: { contains: filters.search } },
      { Sales_order_id: isNaN(parseInt(filters.search)) ? undefined : parseInt(filters.search) },
    ].filter(item => item.Sales_order_id !== undefined || item.notes);
  }

  const [SalesOrders, total] = await Promise.all([
    SalesOrderModel.findAll({ where }),
    SalesOrderModel.count(where),
  ]);

  const response = SalesOrders.map((order) => ({
    Sales_order_id: order.sales_order_id,
    issued_by: order.user,
    items: order.salesOrderItems.map((item) => ({
      sales_order_item_id: item.sales_order_item_id,
      type_item: item.type_item,
      width: item.width,
      length: item.length,
      thickness: item.thickness,
      material_name: item.color.ruler.material.material_name,
      ruler_type: item.color.ruler.ruler_name,
      color_code: item.color.color_code,
      color_name: item.color.color_name,
      batch_number: item.batch?.batch_number,
      quantity: item.quantity,
      notes: item.notes,

    })),
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
export const getSalesOrderById = async (sales_order_id, userRole) => {
  const SalesOrder = await SalesOrderModel.findById(sales_order_id);
  if (!SalesOrder) {
    const error = new Error("طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }
  const response = {
    Sales_order_id: SalesOrder.sales_order_id,
    issued_by: SalesOrder.user,
    items: SalesOrder.salesOrderItems.map((item) => ({
      sales_order_item_id: item.sales_order_item_id,
      type_item: item.type_item,
      width: item.width,
      length: item.length,
      thickness: item.thickness,
      material_name: item.color.ruler.material.material_name,
      ruler_type: item.color.ruler.ruler_name,
      color_code: item.color.color_code,
      color_name: item.color.color_name,
      batch_number: item.batch?.batch_number,
      quantity: item.quantity,
      notes: item.notes,
    })),
    status: SalesOrder.status,
    notes: SalesOrder.notes,
    created_at: SalesOrder.created_at,
  };

  return {
    ...response,
  };
};

/**
 * إنشاء طلب إنتاج جديد مع عناصر متعددة حسب أنواع الإنتاج
 */
export const createSalesOrder = async (data, userId, userRole, req = null) => {

  // ✅ التحقق من الصلاحيات
  if (!['admin', 'production_manager', 'sales', 'accountant'].includes(userRole)) {
    const error = new Error("ليس لديك صلاحية لإنشاء طلبات الإنتاج");
    error.statusCode = 403;
    throw error;
  }

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("يجب إدخال عناصر للطلب");
  }

  // ✅ التحقق من كل عنصر
  for (const item of data.items) {

    const color = await prisma.color.findUnique({
      where: { color_id: item.color_id }
    });

    if (!color) {
      throw new Error(`اللون برقم ${item.color_id} غير موجود`);
    }

    if (item.batch_id) {
      const batch = await prisma.batch.findUnique({
        where: { batch_id: item.batch_id }
      });

      if (!batch) {
        throw new Error(`الطبخة برقم ${item.batch_id} غير موجودة`);
      }
    }
  }

  const result = await prisma.salesOrder.create({
    data: {
      issued_by: userId,
      status: data.status || 'pending',
      notes: data.notes,
      salesOrderItems: {
        create: data.items.map(item => ({
          color_id: item.color_id,
          batch_id: item.batch_id,
          type_item: item.type_item,
          width: item.width,
          length: item.length,
          thickness: item.thickness,
          quantity: item.quantity,
          notes: item.notes
        }))
      }
    },
    include: {
      user: true,
      salesOrderItems: {
        include: { color: { include: { ruler: { include: { material: true } } } }, batch: true }
      }
    }
  });

  logger.info("Sales order created", {
    sales_order_id: result.sales_order_id,
    user_id: userId,
  });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "sales_order", result.sales_order_id, result, `Sales order-${result.sales_order_id}`);

    // إرسال إشعار لمسؤول الإنتاج
    try {
      const { notifySalesOrder } = await import("../utils/notificationHelper.js");
      await notifySalesOrder(result, userId);
    } catch (error) {
      logger.error("Error sending sales order notification:", error);
    }
  }

  return result;
};

/**
 * تحديث طلب إنتاج
 */
export const updateSalesOrder = async (salesOrderId, data, userId, userRole, req = null) => {

  // ✅ التحقق من الصلاحيات
  if (!['admin', 'production_manager'].includes(userRole)) {
    const error = new Error("ليس لديك صلاحية لتعديل طلبات الإنتاج");
    error.statusCode = 403;
    throw error;
  }

  // ✅ التحقق من وجود الطلب
  const existingOrder = await prisma.salesOrder.findUnique({
    where: { sales_order_id: salesOrderId },
  });

  if (!existingOrder) {
    const error = new Error("طلب المبيعات غير موجود");
    error.statusCode = 404;
    throw error;
  }

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("يجب إدخال عناصر للطلب");
  }

  // ✅ التحقق من صحة العناصر
  for (const item of data.items) {

    const color = await prisma.color.findUnique({
      where: { color_id: item.color_id }
    });

    if (!color) {
      throw new Error(`اللون برقم ${item.color_id} غير موجود`);
    }

    if (item.batch_id) {
      const batch = await prisma.batch.findUnique({
        where: { batch_id: item.batch_id }
      });

      if (!batch) {
        throw new Error(`الطبخة برقم ${item.batch_id} غير موجودة`);
      }
    }
  }

  // ✅ تنفيذ التعديل داخل Transaction
  const result = await prisma.$transaction(async (tx) => {

    // 1️⃣ تحديث بيانات الطلب الأساسية
    await tx.salesOrder.update({
      where: { sales_order_id: salesOrderId },
      data: {
        status: data.status || existingOrder.status,
        notes: data.notes ?? existingOrder.notes,
      }
    });

    // 2️⃣ حذف العناصر القديمة
    await tx.salesOrderItem.deleteMany({
      where: { sales_order_id: salesOrderId }
    });

    // 3️⃣ إنشاء العناصر الجديدة
    await tx.salesOrderItem.createMany({
      data: data.items.map(item => ({
        sales_order_id: salesOrderId,
        color_id: item.color_id,
        batch_id: item.batch_id || null,
        type_item: item.type_item,
        width: item.width,
        length: item.length,
        thickness: item.thickness,
        quantity: item.quantity,
        notes: item.notes || null
      }))
    });

    // 4️⃣ إعادة جلب الطلب كامل مع العلاقات
    const fullOrder = await tx.salesOrder.findUnique({
      where: { sales_order_id: salesOrderId },
      include: {
        user: {
          select: { id: true, username: true, full_name: true }
        },
        salesOrderItems: {
          include: {
            color: {
              include: {
                ruler: {
                  include: {
                    material: true
                  }
                }
              }
            },
            batch: true
          }
        }
      }
    });

    return fullOrder;
  });

  logger.info("Sales order updated", {
    sales_order_id: salesOrderId,
    updated_by: userId,
  });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "sales_order", salesOrderId, existingOrder, result, `Sales order-${salesOrderId}`);
  }

  return result;
};

/**
 * حذف طلب إنتاج
 */
export const deleteSalesOrder = async (salesOrderId, userRole, req = null) => {

  if (!['admin', 'production_manager'].includes(userRole)) {
    throw new Error("ليس لديك صلاحية لحذف الطلب");
  }

  const existingOrder = await prisma.salesOrder.findUnique({
    where: { sales_order_id: salesOrderId }
  });

  if (!existingOrder) {
    throw new Error("الطلب غير موجود");
  }

  await prisma.$transaction(async (tx) => {

    await tx.salesOrderItem.deleteMany({
      where: { sales_order_id: salesOrderId }
    });

    await tx.salesOrder.delete({
      where: { sales_order_id: salesOrderId }
    });

  });
  logger.info("Sales order deleted", {
    sales_order_id: salesOrderId,
  });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "sales_order", salesOrderId, existingOrder, `Sales order-${salesOrderId}`);
  }
  return { message: "تم حذف الطلب بنجاح" };
};

/**
 * جلب عنصر طلب إنتاج حسب المعرف مع التحقق من الصلاحيات
 */
export const getSalesOrderItemById = async (Sales_order_item_id) => {
  const item = await SalesOrderItemModel.findById(Sales_order_item_id);

  if (!item) {
    const error = new Error("عنصر طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  return item;
};

/**
 * إنشاء عنصر طلب إنتاج
 */
export const createSalesOrderItem = async (
  Sales_order_id,
  data,
  req = null
) => {
  const existingOrder = await SalesOrderModel.findById(Sales_order_id);
  if (!existingOrder) {
    const error = new Error("طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  if (existingOrder.status !== 'pending') {
    const error = new Error("لا يمكن إضافة أمر إنتاج إلى طلب مكتمل أو ملغى");
    error.statusCode = 400;
    throw error;
  }
  data.sales_order_id = Sales_order_id;
  const createdItem = await SalesOrderItemModel.create(data);

  logger.info("Sales order items created", {
    Sales_order_id,
    count: createdItem.length,
  });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "sales_order_item", createdItem.sales_order_item_id, createdItem, `Sales order item-${createdItem.sales_order_item_id}`);
  }

  return createdItem;
};

export const updateSalesOrderItemStatus = async (Sales_order_item_id, status) => {
  // Check if item exists
  const existingItem = await SalesOrderItemModel.findById(Sales_order_item_id);
  if (!existingItem) {
    const error = new Error("عنصر طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  const updatedItem = await SalesOrderItemModel.updateById(Sales_order_item_id, { status });

  logger.info("Sales order item status updated", {
    Sales_order_item_id,
    type: existingItem.type,
  });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "sales_order_item", Sales_order_item_id, existingItem, updatedItem, `Sales order item-${Sales_order_item_id}`);
  }

  return updatedItem;
};

/**
 * تحديث عنصر طلب إنتاج
 */
export const updateSalesOrderItem = async (Sales_order_item_id, data, req = null) => {
  // Check if item exists
  const existingItem = await SalesOrderItemModel.findById(Sales_order_item_id);
  if (!existingItem) {
    const error = new Error("عنصر طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  const updatedItem = await SalesOrderItemModel.updateById(Sales_order_item_id, data);

  logger.info("Sales order item updated", {
    Sales_order_item_id,
    type: existingItem.type,
  });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "sales_order_item", Sales_order_item_id, existingItem, updatedItem, `Sales order item-${Sales_order_item_id}`);
  }

  return updatedItem;
};

/**
 * حذف عنصر طلب إنتاج
 */
export const deleteSalesOrderItem = async (Sales_order_item_id, req = null) => {
  // Check if item exists
  const existingItem = await SalesOrderItemModel.findById(Sales_order_item_id);
  if (!existingItem) {
    const error = new Error("عنصر طلب الإنتاج غير موجود");
    error.statusCode = 404;
    throw error;
  }

  await SalesOrderItemModel.deleteById(Sales_order_item_id);

  logger.info("Sales order item deleted", { Sales_order_item_id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "sales_order_item", Sales_order_item_id, existingItem, `Sales order item-${Sales_order_item_id}`);
  }
  return { message: "تم حذف عنصر طلب الإنتاج بنجاح" };
};

