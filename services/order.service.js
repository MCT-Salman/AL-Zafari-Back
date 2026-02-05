// services/order.service.js
import {
  OrderModel,
  OrderItemModel,
  CustomerModel,
  ConstantValueModel,
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
  // تحقق من العميل
  const customer = await CustomerModel.findById(data.customer_id);
  if (!customer) {
    const error = new Error("العميل غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // تحقق من وجود عناصر في الطلب
  if (!data.items || data.items.length === 0) {
    const error = new Error("يجب إضافة عنصر واحد على الأقل للطلب");
    error.statusCode = 400;
    throw error;
  }

  // تحقق من المساطر والـ batch لكل عنصر
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

  // حساب السعر الكلي والـ subtotal لكل عنصر
  let total_amount = 0;
  const itemsWithSubtotal = [];

  for (const item of data.items) {
    let widthType = "isByBlanck";
    if (item.constant_width === 22) widthType = "isByMeter22";
    else if (item.constant_width === 44) widthType = "isByMeter44";
    else if (item.constant_width === 66) widthType = "isByMeter66";

    // جلب السعر إذا لم يكن موجود
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

    const subtotal = (parseFloat(item.unit_price) * parseFloat(item.length)).toFixed(2) * parseFloat(item.quantity);
    total_amount += parseFloat(subtotal);

    itemsWithSubtotal.push({
      ...item,
      unit_price: item.unit_price.toString(),
      subtotal: subtotal.toString(),
    });
  }

  // إنشاء الطلب داخل transaction
  const newOrder = await prisma.$transaction(async (tx) => {
    return await tx.order.create({
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
          select: { id: true, username: true, full_name: true },
        },
        items: {
          include: {
            ruler: { include: { material: true, color: true } },
            batch: true,
          },
        },
      },
    });
  });

  // إعادة تشكيل JSON للـ response
  const orderResponse = {
    order_id: newOrder.id,
    customer_id: newOrder.customer_id,
    sales_user_id: newOrder.sales_user_id,
    status: newOrder.status,
    total_amount: newOrder.total_amount,
    created_at: newOrder.created_at,
    notes: newOrder.notes,
    customer: {
      customer_id: newOrder.customer.id,
      name: newOrder.customer.name,
      phone: newOrder.customer.phone,
      customer_type: newOrder.customer.customer_type,
      city: newOrder.customer.city,
      address: newOrder.customer.address,
      country: newOrder.customer.country,
      countryCode: newOrder.customer.countryCode,
      is_active: newOrder.customer.is_active,
      fcmToken: newOrder.customer.fcmToken,
      notes: newOrder.customer.notes,
      created_at: newOrder.customer.created_at,
    },
    sales: newOrder.sales,
    items: await Promise.all(newOrder.items.map(async (item) => {
      const type_item = await ConstantValueModel.findById(item.type_item);

      return {
        order_item_id: item.id,
        order_id: item.order_id,
        material_name: item.ruler?.material?.material_name || null,
        color_code: item.ruler?.color?.color_code || null,
        color_name: item.ruler?.color?.color_name || null,
        batch_number: item.batch?.batch_number || null,
        ruler_type: item.ruler?.type || "new",
        type_item: type_item?.value || null,
        constant_width: item.constant_width,
        length: item.length,
        constant_thickness: item.constant_thickness,
        batch_id: item.batch_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        notes: item.notes,
      };
    })),
  };

  logger.info("Order created", { order_id: orderResponse.order_id });
  return orderResponse;
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

