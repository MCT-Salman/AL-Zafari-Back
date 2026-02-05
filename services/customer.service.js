// services/customer.service.js
import { CustomerModel } from "../models/index.js";
import logger from "../utils/logger.js";
import { getCountryFromPhone } from "../utils/phoneCountry.js";

/**
 * جلب جميع العملاء مع pagination
 */
export const getAllCustomers = async (filters = {}) => {
  const where = {};

  // Filter by customer_type
  if (filters.customer_type) {
    where.customer_type = filters.customer_type;
  }

  // Filter by city
  if (filters.city) {
    where.city = {
      contains: filters.city,
    };
  }

  // Filter by is_active
  if (filters.is_active !== undefined) {
    where.is_active = filters.is_active === 'true';
  }

  // Search by name or phone
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { phone: { contains: filters.search } },
    ];
  }

  const [customers, total] = await Promise.all([
    CustomerModel.findAll({ where }),
    CustomerModel.count(where),
  ]);

  return {
    customers,
    total,
  };
};

/**
 * جلب عميل حسب المعرف
 */
export const getCustomerById = async (customer_id) => {
  const customer = await CustomerModel.findById(customer_id);

  if (!customer) {
    const error = new Error("العميل غير موجود");
    error.statusCode = 404;
    throw error;
  }

  return customer;
};

/**
 * إنشاء عميل جديد
 */
export const createCustomer = async (data) => {
  // Check if phone already exists
  const existingCustomer = await CustomerModel.findByPhone(data.phone);
  if (existingCustomer) {
    const error = new Error("رقم الهاتف مسجل بالفعل");
    error.statusCode = 400;
    throw error;
  }

  // Get country info from phone
  const phoneInfo = getCountryFromPhone(data.phone);
  if (!phoneInfo.success) {
    const error = new Error("رقم الهاتف غير صالح");
    error.statusCode = 400;
    throw error;
  }

  // Prepare customer data
  const customerData = {
    ...data,
    country: phoneInfo.country,
    countryCode: phoneInfo.countryCode,
  };

  const customer = await CustomerModel.create(customerData);

  logger.info("Customer created", { customer_id: customer.customer_id });

  return customer;
};

/**
 * تحديث عميل
 */
export const updateCustomer = async (customer_id, data) => {
  // Check if exists
  await getCustomerById(customer_id);

  // If updating phone, check if it's unique
  if (data.phone) {
    const customerWithSamePhone = await CustomerModel.findByPhone(data.phone);
    if (customerWithSamePhone && customerWithSamePhone.customer_id !== customer_id) {
      const error = new Error("رقم الهاتف مسجل بالفعل");
      error.statusCode = 400;
      throw error;
    }

    // Get country info from phone
    const phoneInfo = getCountryFromPhone(data.phone);
    if (!phoneInfo.success) {
      const error = new Error("رقم الهاتف غير صالح");
      error.statusCode = 400;
      throw error;
    }

    data.country = phoneInfo.country;
    data.countryCode = phoneInfo.countryCode;
  }

  const updatedCustomer = await CustomerModel.updateById(customer_id, data);

  logger.info("Customer updated", { customer_id });

  return updatedCustomer;
};

/**
 * حذف عميل
 */
export const deleteCustomer = async (customer_id) => {
  // Check if exists
  const customer = await getCustomerById(customer_id);

  // Check if customer has orders
  if (customer.orders && customer.orders.length > 0) {
    const error = new Error("لا يمكن حذف العميل لأنه يحتوي على طلبات");
    error.statusCode = 400;
    throw error;
  }

  await CustomerModel.deleteById(customer_id);

  logger.info("Customer deleted", { customer_id });

  return { message: "تم حذف العميل بنجاح" };
};

