// controllers/SalesOrder.controller.js
import {
  getAllSalesOrders as getAllSalesOrdersService,
  getSalesOrderById as getSalesOrderByIdService,
  createSalesOrder as createSalesOrderService,
  updateSalesOrder as updateSalesOrderService,
  deleteSalesOrder as deleteSalesOrderService,
  getSalesOrderItemById as getSalesOrderItemByIdService,
  createSalesOrderItem as createSalesOrderItemService,
  updateSalesOrderItemStatus as updateSalesOrderItemStatusService,
  updateSalesOrderItem as updateSalesOrderItemService,
  deleteSalesOrderItem as deleteSalesOrderItemService,
} from "../services/salesOrder.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع أوامر الإنتاج
 * GET /Sales-order
 */
export const getAllSalesOrders = async (req, res, next) => {
  try {
    const filters = req.query;
    const userId = req.user.id;

    const result = await getAllSalesOrdersService(filters, userId);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب طلبات الإنتاج بنجاح",
      data: result,
    });
  } catch (error) {
    logger.error("Get all Sales orders controller error", {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      query: req.query,
    });
    return next(error);
  }
};

/**
 * جلب طلب إنتاج حسب المعرف
 * GET /Sales-order/:id
 */
export const getSalesOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const SalesOrder = await getSalesOrderByIdService(parseInt(id), userRole);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب طلب الإنتاج بنجاح",
      data: SalesOrder,
    });
  } catch (error) {
    logger.error("Get Sales order by id controller error", {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      params: req.params,
    });
    return next(error);
  }
};

/**
 * إنشاء طلب إنتاج جديد
 * POST /Sales-order
 */
export const createSalesOrder = async (req, res, next) => {
  try {
    const data = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const SalesOrder = await createSalesOrderService(data, userId, userRole , req);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء طلب الإنتاج بنجاح",
      data: SalesOrder,
    });
  } catch (error) {
    logger.error("Create Sales order controller error", {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      body: req.body,
    });
    return next(error);
  }
};

/**
 * تحديث طلب إنتاج
 * PUT /Sales-order/:id
 */
export const updateSalesOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const SalesOrder = await updateSalesOrderService(
      parseInt(id),
      data,
      userId,
      userRole,
      req
    );

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث طلب الإنتاج بنجاح",
      data: SalesOrder,
    });
  } catch (error) {
    logger.error("Update Sales order controller error", {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      params: req.params,
      body: req.body,
    });
    return next(error);
  }
};

/**
 * حذف طلب إنتاج
 * DELETE /Sales-order/:id
 */
export const deleteSalesOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const result = await deleteSalesOrderService(parseInt(id), userRole , req);

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error("Delete Sales order controller error", {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      params: req.params,
    });
    return next(error);
  }
};

/**
 * جلب عنصر طلب إنتاج حسب المعرف
 * GET /Sales-order/item/:id
 */
export const getSalesOrderItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await getSalesOrderItemByIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب عنصر طلب الإنتاج بنجاح",
      data: item,
    });
  } catch (error) {
    logger.error("Get Sales order item by id controller error", {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      params: req.params,
    });
    return next(error);
  }
};
/**
 * إنشاء عنصر طلب إنتاج
 * POST /Sales-order/item
 */
export const createSalesOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const item = await createSalesOrderItemService(parseInt(id), data , req);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء عنصر طلب الإنتاج بنجاح",
      data: item,
    });
  } catch (error) {
    logger.error("Create Sales order item controller error", {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      params: req.params,
      body: req.body,
    });
    return next(error);
  }
};

export const updateSalesOrderItemStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const item = await updateSalesOrderItemStatusService(parseInt(id), status);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث حالة عنصر طلب الإنتاج بنجاح",
      data: item,
    });
  } catch (error) {
    logger.error("Update Sales order item status controller error", {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      params: req.params,
      body: req.body,
    });
    return next(error);
  }
};

/**
 * تحديث عنصر طلب إنتاج
 * PUT /Sales-order/item/:id
 */
export const updateSalesOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const item = await updateSalesOrderItemService(parseInt(id), data , req);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث عنصر طلب الإنتاج بنجاح",
      data: item,
    });
  } catch (error) {
    logger.error("Update Sales order item controller error", {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      params: req.params,
      body: req.body,
    });
    return next(error);
  }
};

/**
 * حذف عنصر طلب إنتاج
 * DELETE /Sales-order/item/:id
 */
export const deleteSalesOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await deleteSalesOrderItemService(parseInt(id) , req);

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error("Delete Sales order item controller error", {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      params: req.params,
    });
    return next(error);
  }
};

