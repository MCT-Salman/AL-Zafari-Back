// controllers/customer.controller.js
import {
  getAllCustomers as getAllCustomersService,
  getCustomerById as getCustomerByIdService,
  createCustomer as createCustomerService,
  updateCustomer as updateCustomerService,
  deleteCustomer as deleteCustomerService,
} from "../services/customer.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

export const getAllCustomers = async (req, res, next) => {
  try {
    const filters = {
      customer_type: req.query.customer_type,
      city: req.query.city,
      is_active: req.query.is_active,
      search: req.query.search,
    };

    const result = await getAllCustomersService(filters);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب العملاء بنجاح",
      data: result.customers,
      total: result.total,
    });
  } catch (error) {
    logger.error("Get all customers controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerByIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب العميل بنجاح",
      data: customer,
    });
  } catch (error) {
    logger.error("Get customer by id controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    const data = req.body;
    const customer = await createCustomerService(data);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء العميل بنجاح",
      data: customer,
    });
  } catch (error) {
    logger.error("Create customer controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const customer = await updateCustomerService(parseInt(id), data);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث العميل بنجاح",
      data: customer,
    });
  } catch (error) {
    logger.error("Update customer controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteCustomerService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error("Delete customer controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

