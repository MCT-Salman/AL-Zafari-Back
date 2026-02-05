// services/order.service.js
import {
  OrderModel,
  OrderItemModel,
  CustomerModel,
  UserModel,
  RulerModel,
  BatchModel,
  PriceColorModel,
} from "../models/index.js";
import logger from "../utils/logger.js";
import prisma from "../prisma/client.js";

/**
 * جلب جميع الطلبات مع pagination
 */
export const getAllOrders = async (filters = {}) => {
  const where = {};

  // Filter by customer_id
  if (filters.customer_id) {
    where.customer_id = parseInt(filters.customer_id);
  }

  // Filter by status
  if (filters.status) {
    where.status = filters.status;
  }

  // Filter by sales_user_id
  if (filters.sales_user_id) {
    where.sales_user_id = parseInt(filters.sales_user_id);
  }

  // Date range filter
  if (filters.start_date || filters.end_date) {
    where.created_at = {};
    if (filters.start_date) {
      where.created_at.gte = new Date(filters.start_date);
    }
    if (filters.end_date) {
      where.created_at.lte = new Date(filters.end_date);
    }
  }

  const [orders, total] = await Promise.all([
    OrderModel.findAll({ where }),
    OrderModel.count(where),
  ]);

  return {
    orders,
    total,
  };
};

/**
 * جلب طلب حسب المعرف
 */
export const getOrderById = async (order_id) => {
  const order = await OrderModel.findById(order_id);

  if (!order) {
    const error = new Error("الطلب غير موجود");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

/**
 * إنشاء طلب جديد مع عناصره
 */

export const createOrder = async (data, userId) => {

  const customer = await CustomerModel.findById(data.customer_id);
  if (!customer) {
    const error = new Error("العميل غير موجود");
    error.statusCode = 404;
    throw error;
  }

  if (!data.items || data.items.length === 0) {
    const error = new Error("يجب إضافة عنصر واحد على الأقل للطلب");
    error.statusCode = 400;
    throw error;
  }

  for (const item of data.items) {
    const ruler = await RulerModel.findById(item.ruler_id);
    if (!ruler) {
      const error = new Error(`المسطرة ${item.ruler_id} غير موجودة`);
      error.statusCode = 404;
      throw error;
    }

    const batch = await BatchModel.findById(item.batch_id);
    if (!batch) {
      const error = new Error(`الطبخة ${item.batch_id} غير موجودة`);
      error.statusCode = 404;
      throw error;
    }
  }

  let total_amount = 0;
  const itemsWithSubtotal = [];

  for (const item of data.items) {
    let widthType = "isByBlanck";
    if (item.constant_width === 22) widthType = "isByMeter22";
    else if (item.constant_width === 44) widthType = "isByMeter44";
    else if (item.constant_width === 66) widthType = "isByMeter66";

    if (!item.unit_price || Number(item.unit_price) === 0) {
      const price = await PriceColorModel.findPriceByColorAndValue(
        item.ruler_id,
        widthType
      );

      if (!price) {
        const error = new Error(
          `السعر للمسطرة ${item.ruler_id} مع النوع ${widthType} غير موجود`
        );
        error.statusCode = 400;
        throw error;
      }

      item.unit_price = price.price_per_meter.toString();
    }

    const subtotal = (parseFloat(item.unit_price) * parseFloat(item.length)).toFixed(2);
    total_amount += parseFloat(subtotal);

    itemsWithSubtotal.push({
      ...item,
      unit_price: item.unit_price.toString(),
      subtotal: subtotal.toString(),
    });
  }

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        customer_id: data.customer_id,
        sales_user_id: userId,
        status: data.status || "pending",
        total_amount: total_amount.toFixed(2),
        notes: data.notes || null,
        items: {
          create: itemsWithSubtotal,
        },
      },
      include: {
        customer: true,
        sales: {
          select: {
            id: true,
            username: true,
            full_name: true,
          },
        },
        items: {
          include: {
            ruler: {
              include: {
                material: true,
                color: true,
              },
            },
            batch: true,
          },
        },
      },
    });

    return newOrder;
  });

  logger.info("Order created", { order_id: order.order_id });

  return order;
};

/**
 * تحديث طلب
 */
export const updateOrder = async (order_id, data) => {
  // Check if exists
  const existingOrder = await getOrderById(order_id);

  // Validate customer if provided
  if (data.customer_id) {
    const customer = await CustomerModel.findById(data.customer_id);
    if (!customer) {
      const error = new Error("العميل غير موجود");
      error.statusCode = 404;
      throw error;
    }
  }

  // If updating items, recalculate total
  if (data.items && data.items.length > 0) {
    // Validate each item
    for (const item of data.items) {
      if (item.ruler_id) {
        const ruler = await RulerModel.findById(item.ruler_id);
        if (!ruler) {
          const error = new Error(`المسطرة ${item.ruler_id} غير موجودة`);
          error.statusCode = 404;
          throw error;
        }
      }

      if (item.batch_id) {
        const batch = await BatchModel.findById(item.batch_id);
        if (!batch) {
          const error = new Error(`الطبخة ${item.batch_id} غير موجودة`);
          error.statusCode = 404;
          throw error;
        }
      }
    }

    // Calculate total amount
    let total_amount = 0;
    const itemsWithSubtotal = data.items.map((item) => {
      const subtotal = parseFloat(item.unit_price) * parseInt(item.quantity);
      total_amount += subtotal;
      return {
        ...item,
        subtotal,
      };
    });

    // Update order with items in a transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Delete existing items
      await tx.orderItem.deleteMany({
        where: { order_id },
      });

      // Update order and create new items
      const updated = await tx.order.update({
        where: { order_id },
        data: {
          ...data,
          total_amount,
          items: {
            create: itemsWithSubtotal,
          },
        },
        include: {
          customer: true,
          sales: {
            select: {
              id: true,
              username: true,
              full_name: true,
            },
          },
          items: {
            include: {
              ruler: {
                include: {
                  material: true,
                  color: true,
                },
              },
              batch: true,
            },
          },
        },
      });

      return updated;
    });

    logger.info("Order updated with items", { order_id });
    return updatedOrder;
  } else {
    // Update order without items
    const updatedOrder = await OrderModel.updateById(order_id, data);
    logger.info("Order updated", { order_id });
    return updatedOrder;
  }
};

/**
 * حذف طلب
 */
export const deleteOrder = async (order_id) => {
  // Check if exists
  const order = await getOrderById(order_id);

  // Check if order has invoices
  if (order.invoices && order.invoices.length > 0) {
    const error = new Error("لا يمكن حذف الطلب لأنه يحتوي على فواتير");
    error.statusCode = 400;
    throw error;
  }

  // Delete order and its items in a transaction
  await prisma.$transaction(async (tx) => {
    // Delete items first
    await tx.orderItem.deleteMany({
      where: { order_id },
    });

    // Delete order
    await tx.order.delete({
      where: { order_id },
    });
  });

  logger.info("Order deleted", { order_id });

  return { message: "تم حذف الطلب بنجاح" };
};

