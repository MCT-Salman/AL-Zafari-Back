// services/dataExportImport.service.js
import { error } from "console";
import prisma from "../prisma/client.js";
import logger from "../utils/logger.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مجلد التصدير
const EXPORTS_DIR = path.join(__dirname, "..", "exports");

/**
 * التأكد من وجود مجلد التصدير
 */
const ensureExportsDir = async () => {
  try {
    await fs.access(EXPORTS_DIR);
  } catch {
    await fs.mkdir(EXPORTS_DIR, { recursive: true });
  }
};

/**
 * الجداول المتاحة للتصدير مع العلاقات
 */
const EXPORTABLE_TABLES = {
  users: {
    model: "users",
    include: {},
    excludeFields: ["currentSessionId"],
  },
  customers: {
    model: "customer",
    include: {},
    excludeFields: ["fcmToken"],
  },
  materials: {
    model: "material",
    include: {
      constant_values: true,
      batches: true,
    },
    excludeFields: [],
  },
  rulers: {
    model: "ruler",
    include: {
      colors: {
        include: {
          prices: true,
        },
      },
    },
    excludeFields: [],
  },
  colors: {
    model: "color",
    include: {
      prices: true,
    },
    excludeFields: [],
  },
  priceColors: {
    model: "priceColor",
    include: {},
    excludeFields: [],
  },
  constantValues: {
    model: "constantValue",
    include: {},
    excludeFields: [],
  },
  batches: {
    model: "batch",
    include: {},
    excludeFields: [],
  },
  orders: {
    model: "order",
    include: {
      items: true,
      customer: true,
    },
    excludeFields: [],
  },
  orderItems: {
    model: "orderItem",
    include: {
      color: true,
      batch: true,
    },
    excludeFields: [],
  },
  invoices: {
    model: "invoice",
    include: {
      invoiceItems: true,
      customer: true,
    },
    excludeFields: [],
  },
  invoiceItems: {
    model: "invoiceItem",
    include: {
      color: true,
      batch: true,
    },
    excludeFields: [],
  },
  salesOrders: {
    model: "salesOrder",
    include: {
      salesOrderItems: true,
    },
    excludeFields: [],
  },
  salesOrderItems: {
    model: "salesOrderItem",
    include: {
      color: true,
      batch: true,
    },
    excludeFields: [],
  },
  productionOrders: {
    model: "productionOrder",
    include: {
      items: true,
    },
    excludeFields: [],
  },
  productionOrderItems: {
    model: "productionOrderItem",
    include: {
      color: true,
      batch: true,
    },
    excludeFields: [],
  },
  productionProcesses: {
    model: "productionProcess",
    include: {
      user: true,
      color: true,
      batch: true,
    },
    excludeFields: [],
  },
  slites: {
    model: "slite",
    include: {
      increases: true,
    },
    excludeFields: [],
  },
  increases: {
    model: "increase",
    include: {},
    excludeFields: [],
  },
  warehouseMovements: {
    model: "warehouseMovement",
    include: {
      color: true,
      batch: true,
      user: true,
    },
    excludeFields: [],
  },
  notifications: {
    model: "notification",
    include: {},
    excludeFields: [],
  },
  settings: {
    model: "setting",
    include: {},
    excludeFields: [],
  },
  discounts: {
    model: "discount",
    include: {
      material: true,
    },
    excludeFields: [],
  },
  exchangeRateLogs: {
    model: "exchangeRateLog",
    include: {},
    excludeFields: [],
  },
  passwordResets: {
    model: "passwordReset",
    include: {},
    excludeFields: ["otp"],
  },
};

/**
 * تصدير جدول واحد إلى JSON
 */
export const exportTable = async (tableName) => {
  try {
    const tableConfig = EXPORTABLE_TABLES[tableName];

    if (!tableConfig) {
      throw new Error(`الجدول "${tableName}" غير متاح للتصدير`);
    }

    // جلب البيانات
    const data = await prisma[tableConfig.model].findMany();

    // استبعاد الحقول الحساسة
    let processedData = data;
    if (tableConfig.excludeFields && tableConfig.excludeFields.length > 0) {
      processedData = data.map(item => {
        const cleanItem = { ...item };
        tableConfig.excludeFields.forEach(field => {
          delete cleanItem[field];
        });
        return cleanItem;
      });
    }

    // إحصائيات
    const totalCount = await prisma[tableConfig.model].count();

    logger.info(`تم تصدير ${processedData.length} سجل من جدول ${tableName}`);

    return {
      tableName,
      exportedAt: new Date().toISOString(),
      count: processedData.length,
      totalCount,
      data: processedData,
    };
  } catch (error) {
    logger.error(`خطأ في تصدير جدول ${tableName}:`, error);
    throw error;
  }
};

/**
 * تصدير عدة جداول دفعة واحدة
 */
export const exportMultipleTables = async (tableNames) => {
  try {
    const results = {};
    const errors = [];

    for (const tableName of tableNames) {
      try {
        results[tableName] = await exportTable(tableName);
      } catch (error) {
        errors.push({
          tableName,
          error: error.message,
        });
        logger.error(`فشل تصدير جدول ${tableName}:`, error);
      }
    }

    return {
      success: errors.length === 0,
      exportedAt: new Date().toISOString(),
      tables: results,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    logger.error("خطأ في تصدير الجداول:", error);
    throw error;
  }
};

/**
 * حفظ البيانات المصدرة في ملف JSON
 */
export const saveExportToFile = async (exportData, filename) => {
  try {
    await ensureExportsDir();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const finalFilename = filename || `export_${timestamp}.json`;
    const filePath = path.join(EXPORTS_DIR, finalFilename);

    await fs.writeFile(filePath, JSON.stringify(exportData, null, 2), "utf8");

    logger.info(`تم حفظ التصدير في: ${filePath}`);

    return {
      filename: finalFilename,
      path: filePath,
      size: (await fs.stat(filePath)).size,
    };
  } catch (error) {
    logger.error("خطأ في حفظ ملف التصدير:", error);
    throw error;
  }
};


/**
 * استيراد عدة جداول من ملف
 */
export const importMultipleTables = async (fileData, options = {}) => {
  try {
    const results = {};
    const errors = [];

    // التحقق من صحة البيانات
    if (!fileData.tables) {
      throw new Error("تنسيق الملف غير صحيح");
    }

    for (const [tableName, tableData] of Object.entries(fileData.tables)) {
      try {
        if (tableData.data && Array.isArray(tableData.data)) {
          results[tableName] = await importTable(
            tableName,
            tableData.data,
            options[tableName] || options.default || {}
          );
        }
      } catch (error) {
        errors.push({
          tableName,
          error: error.message,
        });
        logger.error(`فشل استيراد جدول ${tableName}:`, error);
      }
    }

    return {
      success: errors.length === 0,
      importedAt: new Date().toISOString(),
      tables: results,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    logger.error("خطأ في استيراد الجداول:", error);
    throw error;
  }
};

/**
 * الحصول على الحقل الفريد للجدول
 */
const getUniqueField = (tableName) => {
  const uniqueFields = {
    users: "id",
    customers: "customer_id",
    materials: "material_id",
    rulers: "ruler_id",
    colors: "color_id",
    priceColors: "price_color_id",
    constantValues: "constant_value_id",
    batches: "batch_id",
    orders: "order_id",
    orderItems: "order_item_id",
    invoices: "invoice_id",
    invoiceItems: "invoice_item_id",
    salesOrders: "sales_order_id",
    salesOrderItems: "sales_order_item_id",
    productionOrders: "production_order_id",
    productionOrderItems: "production_order_item_id",
    productionProcesses: "process_id",
    slites: "slite_id",
    increases: "increase",
    warehouseMovements: "movement_id",
    notifications: "id",
    sessions: "id",
    refreshTokens: "id",
    loginAttempts: "id",
    auditLogs: "id",
    activityLogs: "id",
    settings: "id",
    discounts: "id",
    exchangeRateLogs: "id",
    passwordResets: "id",
  };

  return uniqueFields[tableName];
};


