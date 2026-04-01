// controllers/dataExportImport.controller.js
import {
  exportTable,
  exportMultipleTables,
  saveExportToFile,
  importMultipleTables,
} from "../services/dataExportImport.service.js";
import logger from "../utils/logger.js";
import path from "path";

/**
 * تصدير جدول واحد
 * GET /api/data-export/:tableName
 */
export const exportSingleTable = async (req, res) => {
  try {
    const { tableName } = req.params;
    const { limit, offset, filters, saveToFile } = req.query;

    const options = {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : 0,
      filters: filters ? JSON.parse(filters) : {},
    };

    const result = await exportTable(tableName, options);

    // حفظ في ملف إذا طُلب ذلك
    if (saveToFile === "true") {
      const fileInfo = await saveExportToFile(
        { tables: { [tableName]: result } },
        `${tableName}_${new Date().toISOString().split("T")[0]}.json`
      );

      return res.status(200).json({
        success: true,
        message: `تم تصدير جدول ${tableName} وحفظه في ملف`,
        data: result,
        file: fileInfo,
      });
    }

    res.status(200).json({
      success: true,
      message: `تم تصدير جدول ${tableName} بنجاح`,
      data: result,
    });
  } catch (error) {
    logger.error("خطأ في تصدير الجدول:", error);
    res.status(500).json({
      success: false,
      message: error.message || "حدث خطأ أثناء تصدير الجدول",
    });
  }
};

/**
 * تصدير عدة جداول
 * POST /api/data-export/multiple
 * Body: { tables: ["users", "products"], download: true, filename: "backup.json" }
 */
export const exportMultiple = async (req, res) => {
  try {
    const { tables, download, filename } = req.body;

    if (!tables || !Array.isArray(tables) || tables.length === 0) {
      return res.status(400).json({
        success: false,
        message: "يجب تحديد قائمة الجداول للتصدير",
      });
    }

    const result = await exportMultipleTables(tables);

    // إذا طُلب التحميل المباشر
    if (download === true || download === "true") {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0];
      const finalFilename = filename || `export_${timestamp}.json`;

      // إرسال الملف مباشرة للتحميل
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="${finalFilename}"`);
      res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

      return res.status(200).send(JSON.stringify(result, null, 2));
    }

    // إرسال البيانات كـ JSON عادي
    res.status(200).json({
      success: true,
      message: `تم تصدير ${tables.length} جدول بنجاح`,
      data: result,
    });
  } catch (error) {
    logger.error("خطأ في تصدير الجداول:", error);
    res.status(500).json({
      success: false,
      message: error.message || "حدث خطأ أثناء تصدير الجداول",
    });
  }
};

/**
 * تصدير وتحميل مباشر (GET)
 * GET /api/data-export/download-multiple?tables=users,customers&filename=backup.json
 */
export const exportAndDownload = async (req, res) => {
  try {
    const { tables, filename } = req.body;

    if (!tables) {
      return res.status(400).json({
        success: false,
        message: "يجب تحديد قائمة الجداول للتصدير",
      });
    }

    // تحويل النص إلى مصفوفة
    const tableArray = typeof tables === 'string' ? tables.split(',').map(t => t.trim()) : tables;

    if (!Array.isArray(tableArray) || tableArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "يجب تحديد قائمة الجداول للتصدير",
      });
    }

    const result = await exportMultipleTables(tableArray);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0];
    const finalFilename = filename || `export_${timestamp}.json`;

    // إرسال الملف مباشرة للتحميل
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${finalFilename}"`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    res.status(200).send(JSON.stringify(result, null, 2));
  } catch (error) {
    logger.error("خطأ في تصدير وتحميل الجداول:", error);
    res.status(500).json({
      success: false,
      message: error.message || "حدث خطأ أثناء تصدير الجداول",
    });
  }
};

/**
 * استيراد بيانات من JSON مباشرة
 * POST /api/data-import/direct
 * Body: { data: {...}, options: {} }
 */
export const importDirect = async (req, res) => {
  try {
    const { data, options } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "يجب إرسال البيانات",
      });
    }

    const result = await importMultipleTables(data, options || {});

    res.status(200).json({
      success: true,
      message: "تم استيراد البيانات بنجاح",
      data: result,
    });
  } catch (error) {
    logger.error("خطأ في استيراد البيانات:", error);
    res.status(500).json({
      success: false,
      message: error.message || "حدث خطأ أثناء استيراد البيانات",
    });
  }
};

/**
 * استيراد بيانات من ملف JSON مرفوع من الجهاز
 * POST /api/data-import/upload
 * Body: multipart/form-data with file field and options JSON
 */
export const importFromUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "يجب رفع ملف JSON",
      });
    }

    // قراءة محتوى الملف المرفوع
    const fs = await import("fs/promises");
    const fileContent = await fs.readFile(req.file.path, "utf8");
    const data = JSON.parse(fileContent);

    // الحصول على الخيارات من body
    const options = req.body.options ? JSON.parse(req.body.options) : {};

    // استيراد البيانات
    const result = await importMultipleTables(data, options);

    // حذف الملف المؤقت بعد الاستيراد
    await fs.unlink(req.file.path);

    res.status(200).json({
      success: true,
      message: "تم استيراد البيانات من الملف المرفوع بنجاح",
      data: {
        filename: req.file.originalname,
        size: req.file.size,
        results: result,
      },
    });
  } catch (error) {
    // محاولة حذف الملف في حالة الخطأ
    if (req.file?.path) {
      try {
        const fs = await import("fs/promises");
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.error("خطأ في حذف الملف المؤقت:", unlinkError);
      }
    }

    logger.error("خطأ في استيراد البيانات من الملف المرفوع:", error);
    res.status(500).json({
      success: false,
      message: error.message || "حدث خطأ أثناء استيراد البيانات",
    });
  }
};

/**
 * الحصول على قائمة الجداول المتاحة للتصدير
 * GET /api/data-export/available-tables
 */
export const getAvailableTables = async (req, res) => {
  try {
    // جميع الجداول المتاحة في Prisma Schema
    const tables = {
      // جداول المستخدمين والأمان
      users: "المستخدمون",

      // جداول الإشعارات والسجلات
      notifications: "الإشعارات",

      // جداول العملاء
      customers: "العملاء",

      // جداول المواد والمنتجات
      materials: "المواد الخام",
      rulers: "المساطر",
      colors: "الألوان",
      priceColors: "أسعار الألوان",
      constantValues: "القيم الثابتة",
      batches: "الطبخات",

      // جداول الطلبات والفواتير
      orders: "الطلبيات",
      orderItems: "عناصر الطلبيات",
      invoices: "الفواتير",
      invoiceItems: "عناصر الفواتير",

      // جداول المبيعات
      salesOrders: "طلبات المبيعات",
      salesOrderItems: "عناصر طلبات المبيعات",

      // جداول الإنتاج
      productionOrders: "طلبات الإنتاج",
      productionOrderItems: "عناصر طلبات الإنتاج",
      productionProcesses: "عمليات الإنتاج",

      // جداول التقطيع والمخزن
      slites: "عمليات التشريح",
      increases: "الزيادات",
      warehouseMovements: "حركات المخزن",

      // جداول النظام والإعدادات
      settings: "الإعدادات",
      discounts: "الخصومات",
      exchangeRateLogs: "سجلات أسعار الصرف",
    };

    // تجميع الجداول حسب الفئة
    const categorizedTables = {
      security: {
        name: " المستخدمين",
        icon: "🔐",
        tables: ["users"],
        description: "جداول المستخدمين  ",
      },
      logs: {
        name: "السجلات والإشعارات",
        icon: "📋",
        tables: ["notifications"],
        description: "الإشعارات",
      },
      customers: {
        name: "العملاء",
        icon: "👥",
        tables: ["customers"],
        description: "بيانات العملاء",
      },
      materials: {
        name: "المواد والمنتجات",
        icon: "📦",
        tables: ["materials", "rulers", "colors", "priceColors", "constantValues", "batches"],
        description: "المواد الخام والألوان والمساطر",
      },
      orders: {
        name: "الطلبيات والفواتير",
        icon: "🛒",
        tables: ["orders", "orderItems", "invoices", "invoiceItems"],
        description: "طلبات العملاء والفواتير",
      },
      sales: {
        name: "المبيعات",
        icon: "💰",
        tables: ["salesOrders", "salesOrderItems"],
        description: "طلبات المبيعات",
      },
      production: {
        name: "الإنتاج",
        icon: "🏭",
        tables: ["productionOrders", "productionOrderItems", "productionProcesses"],
        description: "طلبات وعمليات الإنتاج",
      },
      warehouse: {
        name: "المخزن والتقطيع",
        icon: "📊",
        tables: ["slites", "increases", "warehouseMovements"],
        description: "عمليات التشريح والمخزن",
      },
      system: {
        name: "النظام والإعدادات",
        icon: "⚙️",
        tables: ["settings", "discounts", "exchangeRateLogs"],
        description: "إعدادات النظام والخصومات",
      },
    };

    res.status(200).json({
      success: true,
      message: "قائمة الجداول المتاحة للتصدير",
      data: {
        tables: Object.keys(tables),
        descriptions: tables,
        categories: categorizedTables,
        totalCount: Object.keys(tables).length,
      },
    });
  } catch (error) {
    logger.error("خطأ في جلب قائمة الجداول:", error);
    res.status(500).json({
      success: false,
      message: error.message || "حدث خطأ",
    });
  }
};



