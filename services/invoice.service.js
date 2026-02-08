// services/invoice.service.js
import { InvoiceModel, OrderModel, CustomerModel } from "../models/index.js";
import logger from "../utils/logger.js";
import prisma from "../prisma/client.js";

/**
 * جلب جميع الفواتير 
 */
export const getAllInvoices = async (filters = {}) => {
  const where = {};

  if (filters.customer_id) {
    where.customer_id = Number(filters.customer_id);
  }

  if (filters.order_id) {
    where.order_id = Number(filters.order_id);
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
 * إنشاء فاتورة جديدة
 */
export const createInvoice = async (data, userId) => {
  const order = await OrderModel.findById(data.order_id);
  if (!order) throw new Error("الطلب غير موجود");
  if (order.status !== "completed") throw new Error("لا يمكن إنشاء فاتورة لطلب غير مكتمل");

  //تحقق من وجود فاتورة مسبقًا 
  const existingInvoice = await InvoiceModel.findByOrderId(data.order_id);
  if (existingInvoice && existingInvoice.length > 0) throw new Error("تم إنشاء فاتورة لهذا الطلب مسبقًا");

  const total_amount = Number(order.total_amount);
  const paid_amount = Number(data.paid_amount) || 0;
  if (paid_amount > total_amount) throw new Error("المبلغ المدفوع لا يمكن أن يتجاوز المبلغ الإجمالي");

  const remaining_amount = total_amount - paid_amount;

  const invoice = await prisma.$transaction(async (tx) => {
    const newInvoice = await tx.invoice.create({
      data: {
        order_id: data.order_id,
        customer_id: order.customer_id,
        total_amount,
        paid_amount,
        remaining_amount,
        issued_by: userId,
        notes: data.notes || null,
      },
    });

    if (remaining_amount > 0) {
      await tx.customer.update({
        where: { customer_id: order.customer_id },
        data: { balance: { increment: remaining_amount } },
      });
    }

    return newInvoice;
  });

  return invoice;
};

/**
 * تحديث فاتورة
 */
export const updateInvoice = async (invoice_id, data) => {
  const existingInvoice = await getInvoiceById(invoice_id);
  if (!existingInvoice) {
    const error = new Error("الفاتورة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  const order = await OrderModel.findById(existingInvoice.order_id);
  if (!order) {
    const error = new Error("الطلب المرتبط بالفاتورة غير موجود");
    error.statusCode = 404;
    throw error;
  }

  const total_amount = Number(order.total_amount ?? existingInvoice.total_amount);
  const new_paid_amount = Number(data.paid_amount ?? existingInvoice.paid_amount);
  const old_paid_amount = Number(existingInvoice.paid_amount);

  if (new_paid_amount > total_amount) {
    const error = new Error("المبلغ المدفوع لا يمكن أن يتجاوز المبلغ الإجمالي");
    error.statusCode = 400;
    throw error;
  }

  const new_remaining_amount = total_amount - new_paid_amount;
  const balanceChange = new_remaining_amount - Number(existingInvoice.remaining_amount);

  const updatedInvoice = await prisma.$transaction(async (tx) => {
    // تحديث الفاتورة
    const invoice = await tx.invoice.update({
      where: { invoice_id },
      data: {
        ...data,
        paid_amount: new_paid_amount,
        remaining_amount: new_remaining_amount,
      },
    });

    // تحديث رصيد العميل
    if (balanceChange !== 0) {
      await tx.customer.update({
        where: { customer_id: invoice.customer_id },
        data: { balance: { increment: balanceChange } },
      });
    }

    return invoice;
  });

  logger.info("Invoice updated", { invoice_id });
  return updatedInvoice;
};
/**
 * حذف فاتورة
 */
export const deleteInvoice = async (invoice_id) => {
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

    // حذف الفاتورة
    await tx.invoice.delete({
      where: { invoice_id },
    });
  });

  logger.info("Invoice deleted", { invoice_id });
  return { message: "تم حذف الفاتورة بنجاح" };
};

/**
 * إضافة دفعة للفاتورة
 */
export const addPayment = async (invoice_id, payment_amount) => {
  const invoice = await getInvoiceById(invoice_id);
  if (!invoice) throw new Error("الفاتورة غير موجودة");

  const paymentAmount = Number(payment_amount);
  if (paymentAmount <= 0) throw new Error("مبلغ الدفعة يجب أن يكون أكبر من صفر");

  const currentPaid = Number(invoice.paid_amount);
  const totalAmount = Number(invoice.total_amount);
  const newPaidAmount = currentPaid + paymentAmount;

  if (newPaidAmount > totalAmount) throw new Error("مبلغ الدفعة يتجاوز المبلغ المتبقي");

  const newRemainingAmount = totalAmount - newPaidAmount;

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

  return updatedInvoice;
};

