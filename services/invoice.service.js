// services/invoice.service.js
import { InvoiceModel, PriceColorModel, CustomerModel, SettingModel, DiscountModel } from "../models/index.js";
import logger from "../utils/logger.js";
import prisma from "../prisma/client.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

export const getPriceMaterial = async (data) => {
  const widthType =
    data.width === 22
      ? "isByMeter22"
      : data.width === 44
        ? "isByMeter44"
        : "isByBlanck";

  const price = await PriceColorModel.findPriceByColorAndValue(
    data.color_id,
    widthType,
    data.type_item
  );

  if (!price) {
    const error = new Error("لم يتم العثور على سعر لهذا المنتج");
    error.statusCode = 404;
    throw error;
  }

  const exchangeRate = await SettingModel.findByKey("exchange");

  if (!exchangeRate) {
    const error = new Error("لم يتم العثور على سعر تصريف العملة");
    error.statusCode = 404;
    throw error;
  }

  const exchangeRateValue = Number(exchangeRate.value);

  // سعر المتر بعد الصرف
  const unitPrice = Number(price.price_per_meter);
  const quantity = Number(data.quantity) || 1;
  const length = Number(data.length) || 1;

  const totalQuantity = quantity * length;

  // الإجمالي قبل الخصم
  const subtotal = unitPrice * totalQuantity;

  const discount =
    await DiscountModel.findByMaterialIdAndQuantity(
      price.color.ruler.material.material_id,
      totalQuantity
    );

  let discountAmount = 0;
  let discountType = null;
  let discountValue = 0;

  if (discount) {
    discountType = discount.type;
    discountValue = Number(discount.value);

    if (discount.type === "percentage") {
      discountAmount = (subtotal * discountValue) / 100;
    } else if (discount.type === "fixed") {
      discountAmount = discountValue;
    }
  }

  // حماية من الخصم الأكبر من السعر
  discountAmount = Math.min(discountAmount, subtotal);

  const total = subtotal - discountAmount;

  const unitPriceWithExchange = unitPrice * exchangeRateValue;
  const subtotalWithExchange = subtotal * exchangeRateValue;
  const discountAmountWithExchange = discountAmount * exchangeRateValue;
  const totalWithExchange = total * exchangeRateValue;


  return {
    unitPrice: Number(unitPriceWithExchange.toFixed(2)),
    quantity,
    length,
    totalQuantity,

    subtotal: Number(subtotalWithExchange.toFixed(2)),

    discountType,
    discountValue,
    discount: Number(discountAmountWithExchange.toFixed(2)),

    total: Number(totalWithExchange.toFixed(2)),
  };
};

/**
 * جلب جميع الفواتير 
 */
export const getAllInvoices = async (filters = {}) => {
  const where = {};

  if (filters.customer_id) {
    where.customer_id = Number(filters.customer_id);
  }

  if (filters.issued_by) {
    where.issued_by = Number(filters.issued_by);
  }

  if (filters.start_date || filters.end_date) {
    where.issued_at = {};
    if (filters.start_date) {
      where.issued_at.gte = new Date(filters.start_date);
    }
    if (filters.end_date) {
      where.issued_at.lte = new Date(filters.end_date);
    }
  }


  const [invoices, total] = await Promise.all([
    InvoiceModel.findAll({ where }),
    InvoiceModel.count(where),
  ]);

  return {
    total,
    invoices,
  };
};

/**
 * جلب فاتورة حسب المعرف
 */
export const getInvoiceById = async (invoice_id) => {
  const invoice = await InvoiceModel.findById(invoice_id);

  if (!invoice) {
    const error = new Error("الفاتورة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  return invoice;
};

/**
 * جلب فواتير حسب العميل
 */
export const getInvoicesByCustomerId = async (customer_id) => {
  const customer = await CustomerModel.findById(customer_id);
  if (!customer) {
    const error = new Error("العميل غير موجود");
    error.statusCode = 404;
    throw error;
  }

  const invoices = await InvoiceModel.findByCustomerId(customer_id);
  return invoices;
};

/**
 * إنشاء فاتورة جديدة
 */
export const createInvoice = async (data, userId, req = null) => {

  const customer = await CustomerModel.findById(data.customer_id);
  if (!customer) {
    const error = new Error("العميل غير موجود");
    error.statusCode = 404;
    throw error;
  }

  if (customer.balance > 0) {
    const error = new Error("لا يمكن إنشاء فاتورة لعميل قبل تسديد الذمة");
    error.statusCode = 400;
    throw error;
  }

  const total_amount = Number(data.total_amount);
  const paid_amount = Number(data.paid_amount) || 0;
  const discount = Number(data.discount) || 0;
  const amountAfterDiscount = total_amount - discount;

  if (paid_amount > amountAfterDiscount) throw new Error("المبلغ المدفوع لا يمكن أن يتجاوز المبلغ الإجمالي");

  const remaining_amount = amountAfterDiscount - paid_amount;

  const invoice = await prisma.$transaction(async (tx) => {
    // إنشاء الفاتورة الرئيسية
    const newInvoice = await tx.invoice.create({
      data: {
        order_id: data.order_id || null,
        customer_id: data.customer_id,
        total_amount : amountAfterDiscount.toFixed(2),
        paid_amount,
        discount,
        remaining_amount,
        issued_by: userId,
        notes: data.notes || null,
      },
      include: {
        customer: true,
        user: {
          select: { id: true, username: true, full_name: true },
        },
      },
    });

    // إنشاء عناصر الفاتورة من عناصر الطلب
    const invoiceItemsData = data.items.map((item) => ({
      invoice_id: newInvoice.invoice_id,
      type_item: item.type_item,
      color_id: item.color_id,
      batch_id: item.batch_id,
      thickness: item.thickness,
      width: item.width || 0,
      length: item.length || 0,
      unit_price: item.unit_price || 0,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    // إدراج عناصر الفاتورة
    await tx.invoiceItem.createMany({
      data: invoiceItemsData,
    });

    // تحديث رصيد العميل إذا كان هناك مبلغ متبقي
    if (remaining_amount > 0) {
      await tx.customer.update({
        where: { customer_id: data.customer_id },
        data: { balance: { increment: remaining_amount } },
      });
    }

    // جلب الفاتورة مع جميع العلاقات بما في ذلك InvoiceItems
    const completeInvoice = await tx.invoice.findUnique({
      where: { invoice_id: newInvoice.invoice_id },
      include: {
        invoiceItems: {
          include: {
            color: {
              include: {
                ruler: {
                  include: {
                    material: true,
                  },
                },
              },
            },
            batch: true,
          },
        },
        customer: true,
        user: {
          select: { id: true, username: true, full_name: true },
        },
      },
    });

    return completeInvoice;
  });

  logger.info("Invoice created with items", {
    invoice_id: invoice.invoice_id,
    items_count: invoice.invoiceItems.length,
  });

  // تسجيل النشاط
  if (req) {
    await logCreate(req, "invoice", invoice.invoice_id, invoice, `Invoice-${ invoice.invoice_number}`);
  }

  return invoice;
};

/**
 * تحديث فاتورة
 */
export const updateInvoice = async (invoice_id, data, req = null) => {
  const existingInvoice = await getInvoiceById(invoice_id);
  if (!existingInvoice) {
    const error = new Error("الفاتورة غير موجودة");
    error.statusCode = 404;
    throw error;
  }
  const total_amount = Number(data.total_amount ?? existingInvoice.total_amount);
  const new_paid_amount = Number(data.paid_amount ?? existingInvoice.paid_amount);
  const discount = Number(data.discount ?? existingInvoice.discount);
  const amountAfterDiscount = total_amount - discount;

  if (new_paid_amount > amountAfterDiscount) {
    const error = new Error("المبلغ المدفوع لا يمكن أن يتجاوز المبلغ الإجمالي");
    error.statusCode = 400;
    throw error;
  }

  const new_remaining_amount = amountAfterDiscount - new_paid_amount;
  const balanceChange = new_remaining_amount - Number(existingInvoice.remaining_amount);

  const updatedInvoice = await prisma.$transaction(async (tx) => {
    // تحديث الفاتورة
    const invoice = await tx.invoice.update({
      where: { invoice_id },
      data: {
        customer_id: data.customer_id ?? existingInvoice.customer_id,
        total_amount: amountAfterDiscount.toFixed(2),
        discount,
        paid_amount: new_paid_amount,
        remaining_amount: new_remaining_amount,
      },
    });

    await tx.invoiceItem.deleteMany({
      where: { invoice_id: 10 }
    });

    await tx.invoiceItem.createMany({
      data: data.items.map(item => ({
        ...item,
        invoice_id: 10
      }))
    });

    // تحديث رصيد العميل
    if (balanceChange !== 0) {
      await tx.customer.update({
        where: { customer_id: invoice.customer_id },
        data: { balance: { increment: balanceChange } },
      });
    }

    return await tx.invoice.findUnique({
      where: { invoice_id: 10 },
      include: {
        invoiceItems: true,
        customer: true,
        user: true
      }
    });;
  });

  logger.info("Invoice updated", { invoice_id });

  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "invoice", invoice_id, existingInvoice, updatedInvoice,  `Invoice-${ updatedInvoice.invoice_number}`);
  }

  return updatedInvoice;
};
/**
 * حذف فاتورة
 */
export const deleteInvoice = async (invoice_id, req = null) => {
  const invoice = await getInvoiceById(invoice_id);
  if (!invoice) {
    const error = new Error("الفاتورة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    const balanceChange = Number(invoice.remaining_amount);

    // تحديث رصيد العميل إذا لزم
    if (balanceChange !== 0) {
      await tx.customer.update({
        where: { customer_id: invoice.customer_id },
        data: { balance: { decrement: balanceChange } },
      });
    }
    // حذف عناصر الفاتورة
    await tx.invoiceItem.deleteMany({
      where: { invoice_id }
    });

    // حذف الفاتورة
    await tx.invoice.delete({
      where: { invoice_id },
    });
  });

  logger.info("Invoice deleted", { invoice_id });

  // تسجيل النشاط
  if (req) {
    await logDelete(req, "invoice", invoice_id, invoice, `Invoice-${ invoice.invoice_number }`);
  }

  return { message: "تم حذف الفاتورة بنجاح" };
};

/**
 * إضافة دفعة للفاتورة
 */
export const addPayment = async (invoice_id, payment_amount , req = null) => {
  const invoice = await getInvoiceById(invoice_id);
  if (!invoice) throw new Error("الفاتورة غير موجودة");

  const paymentAmount = Number(payment_amount);
  if (paymentAmount <= 0) throw new Error("مبلغ الدفعة يجب أن يكون أكبر من صفر");

  const currentPaid = Number(invoice.paid_amount);
  const totalAmount = Number(invoice.total_amount);
  const discount = Number(invoice.discount);
  const amountAfterDiscount = totalAmount - discount;
  const newPaidAmount = currentPaid + paymentAmount;

  if (newPaidAmount > amountAfterDiscount) throw new Error("مبلغ الدفعة يتجاوز المبلغ المتبقي");

  const newRemainingAmount = amountAfterDiscount - newPaidAmount;

  const updatedInvoice = await prisma.$transaction(async (tx) => {
    // تحديث الفاتورة
    const invoiceUpdate = await tx.invoice.update({
      where: { invoice_id },
      data: {
        paid_amount: newPaidAmount,
        remaining_amount: newRemainingAmount,
      },
      include: {
        customer: true,
        user: {
          select: { id: true, username: true, full_name: true },
        },
      },
    });

    // تحديث رصيد العميل
    if (paymentAmount > 0) {
      await tx.customer.update({
        where: { customer_id: invoice.customer_id },
        data: { balance: { decrement: paymentAmount } },
      });
    }

    return invoiceUpdate;
  });

  logger.info("Payment added to invoice", {
    invoice_id,
    payment_amount: paymentAmount,
    new_paid_amount: newPaidAmount
  });

  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "invoice", invoice_id, invoice, updatedInvoice, `Invoice-${ updatedInvoice.invoice_number}`);
  }

  return updatedInvoice;
};

