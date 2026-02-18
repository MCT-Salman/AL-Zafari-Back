// controllers/productionOrder.controller.js
import {
  getAllProductionOrders as getAllProductionOrdersService,
  getProductionOrderById as getProductionOrderByIdService,
  createProductionOrder as createProductionOrderService,
  updateProductionOrder as updateProductionOrderService,
  deleteProductionOrder as deleteProductionOrderService,
  getProductionOrderItemById as getProductionOrderItemByIdService,
  createProductionOrderItem as createProductionOrderItemService,
  updateProductionOrderItemStatus as updateProductionOrderItemStatusService,
  updateProductionOrderItem as updateProductionOrderItemService,
  deleteProductionOrderItem as deleteProductionOrderItemService,
  getProductionOrderItemsByType as getProductionOrderItemsByTypeService,
} from "../services/productionOrder.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع أوامر الإنتاج
 * GET /production-order
 */
export const getAllProductionOrders = async (req, res, next) => {
  try {
    const filters = req.query;
    const userRole = req.user.role;
    const userId = req.user.id;

    const result = await getAllProductionOrdersService(filters, userRole, userId);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب أوامر الإنتاج بنجاح",
      data: result,
    });
  } catch (error) {
    logger.error("Get all production orders controller error", {
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
 * GET /production-order/:id
 */
export const getProductionOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const productionOrder = await getProductionOrderByIdService(parseInt(id), userRole);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب طلب الإنتاج بنجاح",
      data: productionOrder,
    });
  } catch (error) {
    logger.error("Get production order by id controller error", {
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
 * POST /production-order
 */
export const createProductionOrder = async (req, res, next) => {
  try {
    const data = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const productionOrder = await createProductionOrderService(data, userId, userRole);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء طلب الإنتاج بنجاح",
      data: productionOrder,
    });
  } catch (error) {
    logger.error("Create production order controller error", {
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
 * PUT /production-order/:id
 */
export const updateProductionOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const productionOrder = await updateProductionOrderService(
      parseInt(id),
      data,
      userId,
      userRole
    );

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث طلب الإنتاج بنجاح",
      data: productionOrder,
    });
  } catch (error) {
    logger.error("Update production order controller error", {
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
 * DELETE /production-order/:id
 */
export const deleteProductionOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const result = await deleteProductionOrderService(parseInt(id), userRole);

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error("Delete production order controller error", {
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
 * GET /production-order/item/:id
 */
export const getProductionOrderItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const item = await getProductionOrderItemByIdService(parseInt(id), userRole);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب عنصر طلب الإنتاج بنجاح",
      data: item,
    });
  } catch (error) {
    logger.error("Get production order item by id controller error", {
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
 * POST /production-order/item
 */
export const createProductionOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userRole = req.user.role;

    const item = await createProductionOrderItemService(parseInt(id), data, userRole);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء عنصر طلب الإنتاج بنجاح",
      data: item,
    });
  } catch (error) {
    logger.error("Create production order item controller error", {
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

export const updateProductionOrderItemStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user.role;

    const item = await updateProductionOrderItemStatusService(parseInt(id), status, userRole);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث حالة عنصر طلب الإنتاج بنجاح",
      data: item,
    });
  } catch (error) {
    logger.error("Update production order item status controller error", {
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
 * PUT /production-order/item/:id
 */
export const updateProductionOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userRole = req.user.role;

    const item = await updateProductionOrderItemService(parseInt(id), data, userRole);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث عنصر طلب الإنتاج بنجاح",
      data: item,
    });
  } catch (error) {
    logger.error("Update production order item controller error", {
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
 * DELETE /production-order/item/:id
 */
export const deleteProductionOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const result = await deleteProductionOrderItemService(parseInt(id), userRole);

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error("Delete production order item controller error", {
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
 * جلب عناصر طلب إنتاج حسب نوع الإنتاج
 * GET /production-order/:id/items
 */
export const getProductionOrderItemsByType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const items = await getProductionOrderItemsByTypeService(parseInt(id), userRole);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب عناصر طلب الإنتاج بنجاح",
      data: items,
    });
  } catch (error) {
    logger.error("Get production order items by type controller error", {
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
