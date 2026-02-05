// controllers/order.controller.js
import {
  getAllOrders as getAllOrdersService,
  getOrderById as getOrderByIdService,
  createOrder as createOrderService,
  updateOrder as updateOrderService,
  deleteOrder as deleteOrderService,
} from "../services/order.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

export const getAllOrders = async (req, res, next) => {
  try {
    const filters = {
      customer_id: req.query.customer_id,
      status: req.query.status,
      sales_user_id: req.query.sales_user_id,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
    };

    const result = await getAllOrdersService(filters);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب الطلبات بنجاح",
      data: result.orders,
      total: result.total,
    });
  } catch (error) {
    logger.error("Get all orders controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب الطلب بنجاح",
      data: order,
    });
  } catch (error) {
    logger.error("Get order by id controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const data = req.body;
    const userId = req.user.id; // من middleware المصادقة
    const order = await createOrderService(data, userId);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء الطلب بنجاح",
      data: order,
    });
  } catch (error) {
    logger.error("Create order controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const order = await updateOrderService(parseInt(id), data);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث الطلب بنجاح",
      data: order,
    });
  } catch (error) {
    logger.error("Update order controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteOrderService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error("Delete order controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

