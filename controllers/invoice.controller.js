// controllers/invoice.controller.js
import * as InvoiceService from "../services/invoice.service.js";
import logger from "../utils/logger.js";

export const getPriceMaterial = async (req, res, next) => {
  try {
    const data = req.body;
    const price = await InvoiceService.getPriceMaterial(data);
    res.status(200).json({
      success: true,
      message: "تم جلب سعر المتر بنجاح",
      data: price,
    });
  } catch (error) {
    logger.error("Error in getPriceMaterial controller", { error: error.message });
    next(error);
  }
};

/**
 * جلب جميع الفواتير
 */
export const getAllInvoices = async (req, res, next) => {
  try {
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
 * جلب فواتير حسب العميل
*/
export const getInvoicesByCustomerId = async (req, res, next) => {
  try {
    const invoices = await InvoiceService.getInvoicesByCustomerId(Number(req.params.id));
    res.status(200).json({
      success: true,
      message: "تم جلب الفواتير بنجاح",
      data: invoices,
    });
  } catch (error) {
    logger.error("Error in getInvoicesByCustomerId controller", { error: error.message });
    next(error);
  }
};

/**
 * إنشاء فاتورة جديدة
 */
export const createInvoice = async (req, res, next) => {
  try {
    const invoice = await InvoiceService.createInvoice(req.body, req.user.id, req);
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
      req.body,
      req
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
    const result = await InvoiceService.deleteInvoice(Number(req.params.id), req);
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
      , req
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

