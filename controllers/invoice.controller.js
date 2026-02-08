// controllers/invoice.controller.js
import * as InvoiceService from "../services/invoice.service.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع الفواتير
 */
export const getAllInvoices = async (req, res, next) => {
  try {
    console.log("req.query", req.query);
    const result = await InvoiceService.getAllInvoices(req.query);
    res.status(200).json({
      success: true,
      message: "تم جلب الفواتير بنجاح",
      data: result.invoices,
      total: result.total,
    });
  } catch (error) {
    logger.error("Error in getAllInvoices controller", { error: error.message });
    next(error);
  }
};

/**
 * جلب فاتورة حسب المعرف
 */
export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await InvoiceService.getInvoiceById(Number(req.params.id));
    res.status(200).json({
      success: true,
      message: "تم جلب الفاتورة بنجاح",
      data: invoice,
    });
  } catch (error) {
    logger.error("Error in getInvoiceById controller", { error: error.message });
    next(error);
  }
};

/**
 * إنشاء فاتورة جديدة
 */
export const createInvoice = async (req, res, next) => {
  try {
    const invoice = await InvoiceService.createInvoice(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "تم إنشاء الفاتورة بنجاح",
      data: invoice,
    });
  } catch (error) {
    logger.error("Error in createInvoice controller", { error: error.message });
    next(error);
  }
};

/**
 * تحديث فاتورة
 */
export const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await InvoiceService.updateInvoice(
      Number(req.params.id),
      req.body
    );
    res.status(200).json({
      success: true,
      message: "تم تحديث الفاتورة بنجاح",
      data: invoice,
    });
  } catch (error) {
    logger.error("Error in updateInvoice controller", { error: error.message });
    next(error);
  }
};

/**
 * حذف فاتورة
 */
export const deleteInvoice = async (req, res, next) => {
  try {
    const result = await InvoiceService.deleteInvoice(Number(req.params.id));
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Error in deleteInvoice controller", { error: error.message });
    next(error);
  }
};

/**
 * إضافة دفعة للفاتورة
 */
export const addPayment = async (req, res, next) => {
  try {
    const invoice = await InvoiceService.addPayment(
      Number(req.params.id),
      req.body.payment_amount
    );
    res.status(200).json({
      success: true,
      message: "تم إضافة الدفعة بنجاح",
      data: invoice,
    });
  } catch (error) {
    logger.error("Error in addPayment controller", { error: error.message });
    next(error);
  }
};

