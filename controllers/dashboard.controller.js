// controllers/dashboard.controller.js
import {
  getOverviewStats,
  getProductionOutputs,
  getOperationsStatsByUser,
  getOrderStatsByColor,
  getSalesStats,
} from "../services/dashboard.service.js";
import logger from "../utils/logger.js";

/**
 * إحصائيات شاملة للمدير
 * GET /api/dashboard/stats
 */
export const getManagerStats = async (req, res) => {
  try {
    const { period = "month" } = req.query; // day, week, month, year

    // جلب جميع الإحصائيات بشكل متوازي
    const [overview, productionOutputs, operationsStats, ordersByColor] = await Promise.all([
      getOverviewStats(period),
      getProductionOutputs(period),
      getOperationsStatsByUser(period),
      getOrderStatsByColor(period),
    ]);

    res.status(200).json({
      success: true,
      message: "تم جلب إحصائيات المدير بنجاح",
      data: {
        period,
        // إجمالي المبيعات لليوم
        todaySales: overview.todaySales,

        // عدد الفواتير
        todayInvoicesCount: overview.todayInvoicesCount,

        // عدد الطلبات حسب الحالة
        orders: overview.orders,

        // طلبات الإنتاج الموجودة حالياً
        productionOrder: overview.ProductionOrders,

        // العمليات الموجودة - مخرجات الإنتاج
        productionOutputs,

        // إحصائيات العمليات حسب المستخدم
        operationsStats,

        // إحصائيات الطلبات حسب اللون
        ordersByColor,
      },
    });
  } catch (error) {
    logger.error("خطأ في جلب إحصائيات المدير:", error);
    res.status(500).json({
      success: false,
      message: error.message || "حدث خطأ أثناء جلب الإحصائيات",
    });
  }
};

/**
 * إحصائيات المبيعات (Sales Dashboard)
 * GET /api/dashboard/sales-stats
 */
export const getSalesDashboardStats = async (req, res) => {
  try {
    // جلب إحصائيات المبيعات
    const stats = await getSalesStats();

    res.status(200).json({
      success: true,
      message: "تم جلب إحصائيات المبيعات بنجاح",
      data: stats,
    });
  } catch (error) {
    logger.error("خطأ في جلب إحصائيات المبيعات:", error);
    res.status(500).json({
      success: false,
      message: error.message || "حدث خطأ أثناء جلب إحصائيات المبيعات",
    });
  }
};

