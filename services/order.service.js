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
import { count } from "../models/notification.model.js";

/**
 * جلب جميع الطلبات مع pagination
 */
export const getAllOrders = async (filters = {}) => {
  const where = {};

  if (filters.customer_id) {
    where.customer_id = Number(filters.customer_id);
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.sales_user_id) {
    where.sales_user_id = Number(filters.sales_user_id);
  }

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
    OrderModel.findAll({
      where,
      include: {
        customer: true,
        sales: {
          select: {
            id: true,
            username: true,
            full_name: true,
          },
        },
        items: true,
      },
      orderBy: {
        created_at: "desc",
      },
    }),
    // ✅ هنا التصحيح المهم
    OrderModel.count(where),
  ]);

  const ordersResponse = orders.map((order) => ({
    order_id: order.order_id,
    status: order.status,
    total_amount: order.total_amount,
    count_items: order.items?.length ?? 0,
    notes: order.notes,
    created_at: order.created_at,
    customer: order.customer
      ? {
          customer_id: order.customer.customer_id,
          name: order.customer.name,
          phone: order.customer.phone,
          balance: order.customer.balance,
          customer_type: order.customer.customer_type,
          city: order.customer.city,
          address: order.customer.address,
        }
      : null,
    sales: order.sales ?? null,
  }));

  return {
    total,
    orders: ordersResponse,
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

  const orderResponse = {
    order_id: order.id,
    customer_id: order.customer_id,
    sales_user_id: order.sales_user_id,
    status: order.status,
    count_items: order.items.length,
    total_amount: order.total_amount,
    created_at: order.created_at,
    notes: order.notes,
    customer: {
      name: order.customer.name,  
      phone: order.customer.phone,
      balance: order.customer.balance,
      customer_type: order.customer.customer_type,
      city: order.customer.city,
      address: order.customer.address,
    },
    sales: order.sales,
    items: await Promise.all(order.items.map(async (item) => {
      const typeItemValue = await ConstantValueModel.findById(item.type_item);
      return {
        order_item_id: item.id,
        order_id: item.order_id,
        material_name: item.ruler?.material?.material_name || null,
        color_code: item.ruler?.color?.color_code || null,
        color_name: item.ruler?.color?.color_name || null,
        batch_number: item.batch?.batch_number || null,
        ruler_type: item.ruler?.type || "new",
        type_item: typeItemValue?.value || null,
        constant_width: item.constant_width,
        length: item.length,
        constant_thickness: item.constant_thickness,
        batch_id: item.batch_id,
        quantity: item.quantity,
        price_per_meter: item.unit_price,
        subtotal: item.subtotal,
        notes: item.notes,
      };
    })),
  };

  return orderResponse;
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
    count_items: newOrder.items.length,
    total_amount: newOrder.total_amount,
    created_at: newOrder.created_at,
    notes: newOrder.notes,
    customer: {
      name: newOrder.customer.name,
      phone: newOrder.customer.phone,
      balance: newOrder.customer.balance,
      customer_type: newOrder.customer.customer_type,
      city: newOrder.customer.city,
      address: newOrder.customer.address,
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
        price_per_meter: item.unit_price,
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
  // تحقق من وجود الطلب
  const existingOrder = await getOrderById(order_id);
  if (!existingOrder) {
    const error = new Error("الطلب غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // تحقق من العميل إذا تم تحديثه
  if (data.customer_id) {
    const customer = await CustomerModel.findById(data.customer_id);
    if (!customer) {
      const error = new Error("العميل غير موجود");
      error.statusCode = 404;
      throw error;
    }
  }

  // إذا تم تحديث العناصر
  let total_amount = 0;
  let itemsWithSubtotal = [];
  if (data.items && data.items.length > 0) {
    for (const item of data.items) {
      // تحقق من المسطرة والطبخة
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

      // تحديد نوع العرض للـ unit_price
      let widthType = "isByBlanck";
      if (item.constant_width === 22) widthType = "isByMeter22";
      else if (item.constant_width === 44) widthType = "isByMeter44";
      else if (item.constant_width === 66) widthType = "isByMeter66";

      // جلب السعر إذا لم يكن موجود
      if (!item.unit_price || Number(item.unit_price) === 0) {
        const price = await PriceColorModel.findPriceByColorAndValue(item.ruler_id, widthType);
        if (!price) {
          const error = new Error(
            `السعر للمسطرة ${item.ruler_id} مع النوع ${widthType} غير موجود`
          );
          error.statusCode = 400;
          throw error;
        }
        item.unit_price = price.price_per_meter.toString();
      }

      const subtotal = (parseFloat(item.unit_price) * parseFloat(item.length) * parseFloat(item.quantity)).toFixed(2);
      total_amount += parseFloat(subtotal);

      itemsWithSubtotal.push({
        ...item,
        unit_price: item.unit_price.toString(),
        subtotal: subtotal.toString(),
      });
    }
  }

  // تحديث الطلب داخل transaction
  const updatedOrder = await prisma.$transaction(async (tx) => {
    // حذف العناصر القديمة إذا تم تحديثها
    if (itemsWithSubtotal.length > 0) {
      await tx.orderItem.deleteMany({ where: { order_id } });
    }

    // تحديث الطلب
    const updated = await tx.order.update({
      where: { order_id },
      data: {
        ...data,
        total_amount: total_amount.toFixed(2),
        ...(itemsWithSubtotal.length > 0 && { items: { create: itemsWithSubtotal } }),
      },
      include: {
        customer: true,
        sales: { select: { id: true, username: true, full_name: true } },
        items: { include: { ruler: { include: { material: true, color: true } }, batch: true } },
      },
    });

    // إعادة تشكيل JSON للـ response
    return {
      order_id: updated.id,
      customer_id: updated.customer_id,
      sales_user_id: updated.sales_user_id,
      status: updated.status,
      count_items: updated.items.length,
      total_amount: updated.total_amount,
      created_at: updated.created_at,
      notes: updated.notes,
      customer: {
        name: updated.customer.name,
        phone: updated.customer.phone,
        balance: updated.customer.balance,
        customer_type: updated.customer.customer_type,
        city: updated.customer.city,
        address: updated.customer.address,
      },
      sales: updated.sales,
      items: await Promise.all(updated.items.map(async (item) => {
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
          price_per_meter: item.unit_price,
          subtotal: item.subtotal,
          notes: item.notes,
        };
      })),
    };
  });

  logger.info("Order updated", { order_id: updatedOrder.order_id });
  return updatedOrder;
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

/**
 * إضافة عنصر جديد لطلب موجود
 */
export const addOrderItem = async (order_id, itemData) => {
  // التحقق من وجود الطلب
  const order = await OrderModel.findById(order_id);
  if (!order) {
    const error = new Error("الطلب غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // التحقق من وجود المسطرة
  const ruler = await RulerModel.findById(itemData.ruler_id);
  if (!ruler) {
    const error = new Error("المسطرة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  // التحقق من وجود الطبخة
  const batch = await BatchModel.findById(itemData.batch_id);
  if (!batch) {
    const error = new Error("الطبخة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  // حساب السعر إذا لم يتم تمريره
  let unit_price = itemData.unit_price;
  if (!unit_price || Number(unit_price) === 0) {
    const widthType = itemData.constant_width === 22
      ? "isByMeter22"
      : itemData.constant_width === 44
        ? "isByMeter44"
        : "isByBlanck";

    const priceColor = await PriceColorModel.findPriceByColorAndValue(
      itemData.ruler_id,
      widthType
    );

    if (!priceColor) {
      const error = new Error("لم يتم العثور على سعر لهذه المنتج");
      error.statusCode = 404;
      throw error;
    }

    unit_price = priceColor.price_per_meter;
  }

  // حساب subtotal
  const subtotal = unit_price * itemData.length * itemData.quantity;

  // معاملة Prisma لإنشاء العنصر وتحديث الطلب
  const result = await prisma.$transaction(async (tx) => {
    // إنشاء العنصر الجديد
    const newItem = await tx.orderItem.create({
      data: {
        order_id,
        type_item: itemData.type_item,
        ruler_id: itemData.ruler_id,
        constant_width: itemData.constant_width,
        length: itemData.length,
        constant_thickness: itemData.constant_thickness,
        batch_id: itemData.batch_id,
        quantity: itemData.quantity,
        unit_price,
        subtotal,
        notes: itemData.notes,
      },
      include: {
        ruler: {
          include: {
            material: true,
            color: true,
          },
        },
        batch: true,
      },
    });

    // تحديث المبلغ الإجمالي للطلب
    const updatedOrder = await tx.order.update({
      where: { order_id },
      data: {
        total_amount: {
          increment: subtotal,
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
            ruler: { include: { material: true, color: true } },
            batch: true,
          },
        },
      },
    });

    return { newItem, updatedOrder };
  });

  // إعادة تشكيل JSON مرتب
  const type_item = await ConstantValueModel.findById(result.newItem.type_item);

  const response = {
    order_id: result.updatedOrder.order_id,
    customer_id: result.updatedOrder.customer_id,
    sales_user_id: result.updatedOrder.sales_user_id,
    status: result.updatedOrder.status,
    count_items: result.updatedOrder.items.length,
    total_amount: result.updatedOrder.total_amount,
    created_at: result.updatedOrder.created_at,
    notes: result.updatedOrder.notes,
    customer: {
      name: result.updatedOrder.customer.name,
      phone: result.updatedOrder.customer.phone,
      balance: result.updatedOrder.customer.balance,
      customer_type: result.updatedOrder.customer.customer_type,
      city: result.updatedOrder.customer.city,
      address: result.updatedOrder.customer.address,
    },
    sales: result.updatedOrder.sales,
    items: await Promise.all(result.updatedOrder.items.map(async (item) => {
      const typeItemValue = await ConstantValueModel.findById(item.type_item);
      return {
        order_item_id: item.id,
        order_id: item.order_id,
        material_name: item.ruler?.material?.material_name || null,
        color_code: item.ruler?.color?.color_code || null,
        color_name: item.ruler?.color?.color_name || null,
        batch_number: item.batch?.batch_number || null,
        ruler_type: item.ruler?.type || "new",
        type_item: typeItemValue?.value || null,
        constant_width: item.constant_width,
        length: item.length,
        constant_thickness: item.constant_thickness,
        batch_id: item.batch_id,
        quantity: item.quantity,
        price_per_meter: item.unit_price,
        subtotal: item.subtotal,
        notes: item.notes,
      };
    })),
  };

  logger.info("Order item added", { order_id: response.order_id, item_id: result.newItem.id });
  return response;
};

/**
 * تعديل عنصر من طلب
 */
export const updateOrderItem = async (order_id, order_item_id, itemData) => {
  // التحقق من وجود الطلب
  const order = await OrderModel.findById(order_id);
  if (!order) {
    const error = new Error("الطلب غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // التحقق من وجود العنصر
  const existingItem = await OrderItemModel.findById(order_item_id);
  if (!existingItem || existingItem.order_id !== order_id) {
    const error = new Error("العنصر غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // التحقق من المسطرة إذا تم تمريرها
  if (itemData.ruler_id) {
    const ruler = await RulerModel.findById(itemData.ruler_id);
    if (!ruler) {
      const error = new Error("المسطرة غير موجودة");
      error.statusCode = 404;
      throw error;
    }
  }

  // التحقق من الطبخة إذا تم تمريرها
  if (itemData.batch_id) {
    const batch = await BatchModel.findById(itemData.batch_id);
    if (!batch) {
      const error = new Error("الطبخة غير موجودة");
      error.statusCode = 404;
      throw error;
    }
  }

  // حساب السعر و subtotal
  let unit_price = itemData.unit_price ?? existingItem.unit_price;

  if (!unit_price || Number(unit_price) === 0) {
    const widthType = itemData.constant_width === 22
      ? "isByMeter22"
      : itemData.constant_width === 44
        ? "isByMeter44"
        : "isByBlanck";

    const priceColor = await PriceColorModel.findPriceByColorAndValue(
      itemData.ruler_id || existingItem.ruler_id,
      widthType
    );

    if (!priceColor) {
      const error = new Error("لم يتم العثور على سعر لهذه المنتج");
      error.statusCode = 404;
      throw error;
    }

    unit_price = priceColor.price_per_meter;
  }

  const subtotal = unit_price * (itemData.length || existingItem.length) * (itemData.quantity || existingItem.quantity);

  // تحديث العنصر والطلب داخل transaction
  const result = await prisma.$transaction(async (tx) => {
    // تحديث العنصر
    const updatedItem = await tx.orderItem.update({
      where: { order_item_id },
      data: {
        ...itemData,
        unit_price,
        subtotal,
      },
      include: {
        ruler: { include: { material: true, color: true } },
        batch: true,
      },
    });

    // تحديث المبلغ الإجمالي للطلب
    const updatedOrder = await tx.order.update({
      where: { order_id },
      data: {
        total_amount: await calculateTotalAmount(tx, order_id), // دالة لحساب المجموع الجديد
      },
      include: {
        customer: true,
        sales: { select: { id: true, username: true, full_name: true } },
        items: { include: { ruler: { include: { material: true, color: true } }, batch: true } },
      },
    });

    return { updatedItem, updatedOrder };
  });

  // إعادة JSON مرتب
  const type_item = await ConstantValueModel.findById(result.updatedItem.type_item);

  const response = {
    order_id: result.updatedOrder.order_id,
    customer_id: result.updatedOrder.customer_id,
    sales_user_id: result.updatedOrder.sales_user_id,
    status: result.updatedOrder.status,
    count_items: result.updatedOrder.items.length,
    total_amount: result.updatedOrder.total_amount,
    created_at: result.updatedOrder.created_at,
    notes: result.updatedOrder.notes,
    customer: {
      name: result.updatedOrder.customer.name,
      phone: result.updatedOrder.customer.phone,
      balance: result.updatedOrder.customer.balance,
      customer_type: result.updatedOrder.customer.customer_type,
      city: result.updatedOrder.customer.city,
      address: result.updatedOrder.customer.address,
    },
    sales: result.updatedOrder.sales,
    items: await Promise.all(result.updatedOrder.items.map(async (item) => {
      const typeItemValue = await ConstantValueModel.findById(item.type_item);
      return {
        order_item_id: item.id,
        order_id: item.order_id,
        material_name: item.ruler?.material?.material_name || null,
        color_code: item.ruler?.color?.color_code || null,
        color_name: item.ruler?.color?.color_name || null,
        batch_number: item.batch?.batch_number || null,
        ruler_type: item.ruler?.type || "new",
        type_item: typeItemValue?.value || null,
        constant_width: item.constant_width,
        length: item.length,
        constant_thickness: item.constant_thickness,
        batch_id: item.batch_id,
        quantity: item.quantity,
        price_per_meter: item.unit_price,
        subtotal: item.subtotal,
        notes: item.notes,
      };
    })),
  };

  logger.info("Order item updated", { order_id: response.order_id, item_id: result.updatedItem.id });
  return response;
};

// دالة مساعدة لحساب المجموع الجديد للطلب
async function calculateTotalAmount(tx, order_id) {
  const items = await tx.orderItem.findMany({ where: { order_id } });
  return items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
}

/**
 * حذف عنصر من طلب
 */
export const deleteOrderItem = async (order_id, order_item_id) => {
  // التحقق من وجود الطلب
  const order = await OrderModel.findById(order_id);
  if (!order) {
    const error = new Error("الطلب غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // التحقق من وجود العنصر
  const existingItem = await OrderItemModel.findById(order_item_id);
  if (!existingItem || existingItem.order_id !== order_id) {
    const error = new Error("عنصر الطلب غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // التحقق من أن الطلب يحتوي على أكثر من عنصر واحد
  const itemsCount = await OrderItemModel.count({ order_id });
  if (itemsCount <= 1) {
    const error = new Error("لا يمكن حذف العنصر الوحيد من الطلب");
    error.statusCode = 400;
    throw error;
  }

  // حذف العنصر وتحديث المبلغ الإجمالي في معاملة واحدة
  const result = await prisma.$transaction(async (tx) => {
    // حذف العنصر
    const deletedItem = await tx.orderItem.delete({
      where: { order_item_id },
    });

    // تحديث المبلغ الإجمالي للطلب
    const updatedOrder = await tx.order.update({
      where: { order_id },
      data: {
        total_amount: {
          decrement: deletedItem.subtotal,
        },
      },
      include: {
        customer: true,
        sales: { select: { id: true, username: true, full_name: true } },
        items: {
          include: {
            ruler: { include: { material: true, color: true } },
            batch: true,
          },
        },
      },
    });

    return { deletedItem, updatedOrder };
  });

  // إعادة JSON مرتب ومنسّق
  const orderResponse = {
    order_id: result.updatedOrder.id,
    customer_id: result.updatedOrder.customer_id,
    sales_user_id: result.updatedOrder.sales_user_id,
    status: result.updatedOrder.status,
    count_items: result.updatedOrder.items.length,
    total_amount: result.updatedOrder.total_amount,
    created_at: result.updatedOrder.created_at,
    notes: result.updatedOrder.notes,
    customer: {
      name: result.updatedOrder.customer.name,
      phone: result.updatedOrder.customer.phone,
      balance: result.updatedOrder.customer.balance,
      customer_type: result.updatedOrder.customer.customer_type,
      city: result.updatedOrder.customer.city,
      address: result.updatedOrder.customer.address,
    },
    sales: result.updatedOrder.sales,
    items: await Promise.all(result.updatedOrder.items.map(async (item) => {
      const typeItemValue = await ConstantValueModel.findById(item.type_item);
      return {
        order_item_id: item.id,
        order_id: item.order_id,
        material_name: item.ruler?.material?.material_name || null,
        color_code: item.ruler?.color?.color_code || null,
        color_name: item.ruler?.color?.color_name || null,
        batch_number: item.batch?.batch_number || null,
        ruler_type: item.ruler?.type || "new",
        type_item: typeItemValue?.value || null,
        constant_width: item.constant_width,
        length: item.length,
        constant_thickness: item.constant_thickness,
        batch_id: item.batch_id,
        quantity: item.quantity,
        price_per_meter: item.unit_price,
        subtotal: item.subtotal,
        notes: item.notes,
      };
    })),
  };

  logger.info("Order item deleted", { order_id, item_id: order_item_id });
  return orderResponse;
};
/**
 * تعديل حالة طلب
 */
export const updateOrderStatus = async (order_id, status) => {
  // التحقق من وجود الطلب
  const order = await OrderModel.findById(order_id);
  if (!order) {
    const error = new Error("الطلب غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // تحديث حالة الطلب
  const updatedOrder = await prisma.order.update({
    where: { order_id },
    data: { status },
    include: {
      customer: true,
      sales: { select: { id: true, username: true, full_name: true } },
      items: {
        include: {
          ruler: { include: { material: true, color: true } },
          batch: true,
        },
      },
    },
  });

  // إعادة JSON مرتب ومنسّق
  const orderResponse = {
    order_id: updatedOrder.id,
    customer_id: updatedOrder.customer_id,
    sales_user_id: updatedOrder.sales_user_id,
    status: updatedOrder.status,
    count_items: updatedOrder.items.length,
    total_amount: updatedOrder.total_amount,
    created_at: updatedOrder.created_at,
    notes: updatedOrder.notes,
    customer: {
      name: updatedOrder.customer.name,
      phone: updatedOrder.customer.phone,
      balance: updatedOrder.customer.balance,
      customer_type: updatedOrder.customer.customer_type,
      city: updatedOrder.customer.city,
      address: updatedOrder.customer.address,
    },
    sales: updatedOrder.sales,
    items: await Promise.all(
      updatedOrder.items.map(async (item) => {
        const typeItemValue = await ConstantValueModel.findById(item.type_item);
        return {
          order_item_id: item.id,
          order_id: item.order_id,
          material_name: item.ruler?.material?.material_name || null,
          color_code: item.ruler?.color?.color_code || null,
          color_name: item.ruler?.color?.color_name || null,
          batch_number: item.batch?.batch_number || null,
          ruler_type: item.ruler?.type || "new",
          type_item: typeItemValue?.value || null,
          constant_width: item.constant_width,
          length: item.length,
          constant_thickness: item.constant_thickness,
          batch_id: item.batch_id,
          quantity: item.quantity,
          price_per_meter: item.unit_price,
          subtotal: item.subtotal,
          notes: item.notes,
        };
      })
    ),
  };

  logger.info("Order status updated", { order_id, status });
  return orderResponse;
};
