// services/dashboard.service.js
import prisma from "../prisma/client.js";
import logger from "../utils/logger.js";

/**
 * حساب نطاق التاريخ بناءً على الفترة
 */
const getDateRange = (period) => {
  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case "day":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(now.getMonth() - 1);
  }

  return { startDate, endDate: now };
};

/**
 * إحصائيات عامة (نظرة عامة)
 */
export const getOverviewStats = async (period = "month") => {
  try {
    const { startDate, endDate } = getDateRange(period);

    // حساب بداية اليوم الحالي
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // إحصائيات متوازية
    const [
      // إجمالي المبيعات لليوم
      todayRevenue,

      // عدد الفواتير (اليوم)
      todayInvoices,

      // عدد الطلبات حسب الحالة
      pendingOrders,
      preparingOrders,
      completedOrders,

      // طلبات الإنتاج الموجودة حالياً
      pendingProductionOrders,
      preparingProductionOrders,
      completedProductionOrders,
    ] = await Promise.all([
      // إجمالي المبيعات لليوم
      prisma.invoice.aggregate({
        where: {
          issued_at: {
            gte: todayStart,
            lte: todayEnd
          }
        },
        _sum: { total_amount: true },
      }),

      // عدد الفواتير لليوم
      prisma.invoice.count({
        where: {
          issued_at: {
            gte: todayStart,
            lte: todayEnd
          }
        },
      }),

      // الطلبات قيد الانتظار
      prisma.order.count({
        where: {
          status: "pending",
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // الطلبات قيد التجهيز
      prisma.order.count({
        where: {
          status: "preparing",
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // الطلبات المكتملة
      prisma.order.count({
        where: {
          status: "completed",
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // طلبات الإنتاج الموجودة حالياً (pending )
      prisma.productionOrder.count({
        where: {
          status: "pending",
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      prisma.productionOrder.count({
        where: {
          status: "preparing",
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      prisma.productionOrder.count({
        where: {
          status: "completed",
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]);

    return {
      period,
      dateRange: { startDate, endDate },

      // إجمالي المبيعات لليوم
      todaySales: todayRevenue._sum.total_amount || 0,

      // عدد الفواتير
      todayInvoicesCount: todayInvoices,

      // حالات الطلبات
      orders: {
        pending: pendingOrders,
        preparing: preparingOrders,
        completed: completedOrders,
        total: pendingOrders + preparingOrders + completedOrders,
      },

      // طلبات الإنتاج الحالية
      ProductionOrders: {
        pending: pendingProductionOrders,
        preparing: preparingProductionOrders,
        completed: completedProductionOrders,
        total: pendingProductionOrders + preparingProductionOrders + completedProductionOrders,
      }
    };
  } catch (error) {
    logger.error("خطأ في getOverviewStats:", error);
    throw error;
  }
};

/**
 * إحصائيات المبيعات (Sales Dashboard) - يومي فقط
 */
export const getSalesStats = async () => {
  try {
    // تحديد بداية ونهاية اليوم الحالي
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // جلب جميع الإحصائيات بشكل متوازي
    const [
      // إجمالي المبيعات لليوم
      todayRevenue,

      // عدد الفواتير لليوم
      todayInvoicesCount,

      // طلبات المبيعات حسب الحالة (لليوم)
      salesOrdersPending,
      salesOrdersPreparing,
      salesOrdersCompleted,

      // طلبات الإنتاج حسب الحالة (لليوم)
      productionOrdersPending,
      productionOrdersPreparing,
      productionOrdersCompleted,
    ] = await Promise.all([
      // إجمالي المبيعات لليوم
      prisma.invoice.aggregate({
        where: {
          issued_at: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        _sum: { total_amount: true },
      }),

      // عدد الفواتير لليوم
      prisma.invoice.count({
        where: {
          issued_at: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),

      // طلبات المبيعات قيد الانتظار
      prisma.salesOrder.count({
        where: {
          status: "pending",
          created_at: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),

      // طلبات المبيعات قيد التجهيز
      prisma.salesOrder.count({
        where: {
          status: "preparing",
          created_at: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),

      // طلبات المبيعات المكتملة
      prisma.salesOrder.count({
        where: {
          status: "completed",
          created_at: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),

      // طلبات الإنتاج قيد الانتظار
      prisma.productionOrder.count({
        where: {
          status: "pending",
          created_at: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),

      // طلبات الإنتاج قيد التجهيز
      prisma.productionOrder.count({
        where: {
          status: "preparing",
          created_at: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),

      // طلبات الإنتاج المكتملة
      prisma.productionOrder.count({
        where: {
          status: "completed",
          created_at: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
    ]);

    return {
      period: "today",
      date: todayStart.toISOString(),

      // إجمالي المبيعات
      totalSales: todayRevenue._sum.total_amount || 0,

      // عدد الفواتير
      invoicesCount: todayInvoicesCount,

      // طلبات المبيعات
      salesOrders: {
        pending: salesOrdersPending,
        preparing: salesOrdersPreparing,
        completed: salesOrdersCompleted,
        total: salesOrdersPending + salesOrdersPreparing + salesOrdersCompleted,
      },

      // طلبات الإنتاج
      productionOrders: {
        pending: productionOrdersPending,
        preparing: productionOrdersPreparing,
        completed: productionOrdersCompleted,
        total: productionOrdersPending + productionOrdersPreparing + productionOrdersCompleted,
      },
    };
  } catch (error) {
    logger.error("خطأ في getSalesStats:", error);
    throw error;
  }
};

/**
 * إحصائيات الطلبات حسب اللون
 */
export const getOrderStatsByColor = async (period = "month") => {
  try {
    const { startDate, endDate } = getDateRange(period);

    // جلب جميع عناصر الطلبات في الفترة المحددة
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      include: {
        color: {
          select: {
            color_id: true,
            color_name: true,
          },
        },
        order: {
          select: {
            status: true,
            created_at: true,
          },
        },
      },
    });

    // تجميع البيانات حسب اللون
    const colorStats = {};
    let totalQuantity = 0;
    let totalAmount = 0;

    orderItems.forEach(item => {
      const colorId = item.color_id;
      const colorName = item.color?.color_name || 'غير محدد';

      if (!colorStats[colorId]) {
        colorStats[colorId] = {
          colorId: colorId,
          colorName: colorName,
          totalQuantity: 0,
          totalAmount: 0,
          ordersCount: 0,
          orderIds: new Set(),
          byStatus: {
            pending: { count: 0, quantity: 0, amount: 0 },
            preparing: { count: 0, quantity: 0, amount: 0 },
            completed: { count: 0, quantity: 0, amount: 0 },
            cancelled: { count: 0, quantity: 0, amount: 0 },
          },
        };
      }

      // إضافة الكمية والمبلغ
      const quantity = item.quantity || 0;
      const subtotal = parseFloat(item.subtotal || 0);

      colorStats[colorId].totalQuantity += quantity;
      colorStats[colorId].totalAmount += subtotal;
      colorStats[colorId].orderIds.add(item.order_id);

      // التجميع حسب الحالة
      const status = item.order.status;
      if (colorStats[colorId].byStatus[status]) {
        colorStats[colorId].byStatus[status].quantity += quantity;
        colorStats[colorId].byStatus[status].amount += subtotal;
      }

      totalQuantity += quantity;
      totalAmount += subtotal;
    });

    // تحويل إلى مصفوفة وإضافة عدد الطلبات
    const colorStatsArray = Object.values(colorStats).map(stat => ({
      colorId: stat.colorId,
      colorName: stat.colorName,
      totalQuantity: stat.totalQuantity,
      totalAmount: stat.totalAmount,
      ordersCount: stat.orderIds.size,
      byStatus: {
        pending: {
          ...stat.byStatus.pending,
          count: stat.byStatus.pending.quantity > 0 ? 1 : 0,
        },
        preparing: {
          ...stat.byStatus.preparing,
          count: stat.byStatus.preparing.quantity > 0 ? 1 : 0,
        },
        completed: {
          ...stat.byStatus.completed,
          count: stat.byStatus.completed.quantity > 0 ? 1 : 0,
        },
        cancelled: {
          ...stat.byStatus.cancelled,
          count: stat.byStatus.cancelled.quantity > 0 ? 1 : 0,
        },
      },
    }));

    // ترتيب حسب الكمية (الأكثر طلباً)
    colorStatsArray.sort((a, b) => b.totalQuantity - a.totalQuantity);

    return {
      period,
      dateRange: { startDate, endDate },
      summary: {
        totalColors: colorStatsArray.length,
        totalQuantity: totalQuantity,
        totalAmount: totalAmount,
        totalOrders: orderItems.length > 0 ? new Set(orderItems.map(i => i.order_id)).size : 0,
      },
      byColor: colorStatsArray,
      // أفضل 5 ألوان
      topColors: colorStatsArray.slice(0, 5),
    };
  } catch (error) {
    logger.error("خطأ في getOrderStatsByColor:", error);
    throw error;
  }
};

/**
 * إحصائيات العمليات حسب المستخدم
 */
export const getOperationsStatsByUser = async (period = "month") => {
  try {
    const { startDate, endDate } = getDateRange(period);

    // 1. إحصائيات WarehouseMovement حسب المستخدم
    const warehouseStats = await prisma.warehouseMovement.groupBy({
      by: ['user_id'],
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        movement_id: true,
      },
      _sum: {
        quantity: true,
      },
    });

    // جلب تفاصيل المستخدمين للـ WarehouseMovement
    const warehouseUserIds = warehouseStats.map(s => s.user_id);
    const warehouseUsers = await prisma.users.findMany({
      where: {
        id: {
          in: warehouseUserIds,
        },
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        role: true,
      },
    });

    // 2. إحصائيات Slite حسب المستخدم
    const sliteStats = await prisma.slite.groupBy({
      by: ['user_id'],
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        slite_id: true,
      },
    });

    // جلب تفاصيل المستخدمين للـ Slite
    const sliteUserIds = sliteStats.map(s => s.user_id);
    const sliteUsers = await prisma.users.findMany({
      where: {
        id: {
          in: sliteUserIds,
        },
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        role: true,
      },
    });

    // 3. إحصائيات ProductionProcess حسب المستخدم والنوع
    const productionProcessStats = await prisma.productionProcess.groupBy({
      by: ['user_id', 'type'],
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        process_id: true,
      },
      _sum: {
        waste: true,
      },
    });

    // جلب تفاصيل المستخدمين للـ ProductionProcess
    const processUserIds = [...new Set(productionProcessStats.map(s => s.user_id))];
    const processUsers = await prisma.users.findMany({
      where: {
        id: {
          in: processUserIds,
        },
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        role: true,
      },
    });

    // دمج البيانات
    const warehouseStatsByUser = warehouseStats.map(stat => {
      const user = warehouseUsers.find(u => u.id === stat.user_id);
      return {
        userId: stat.user_id,
        username: user?.username || 'غير معروف',
        fullName: user?.full_name || user?.username || 'غير معروف',
        role: user?.role || 'غير معروف',
        operationsCount: stat._count.movement_id,
        totalQuantity: stat._sum.quantity || 0,
      };
    });

    const sliteStatsByUser = sliteStats.map(stat => {
      const user = sliteUsers.find(u => u.id === stat.user_id);
      return {
        userId: stat.user_id,
        username: user?.username || 'غير معروف',
        fullName: user?.full_name || user?.username || 'غير معروف',
        role: user?.role || 'غير معروف',
        operationsCount: stat._count.slite_id,
      };
    });

    // تجميع إحصائيات ProductionProcess حسب المستخدم
    const productionProcessByUser = {};
    productionProcessStats.forEach(stat => {
      const user = processUsers.find(u => u.id === stat.user_id);
      const userId = stat.user_id;

      if (!productionProcessByUser[userId]) {
        productionProcessByUser[userId] = {
          userId: userId,
          username: user?.username || 'غير معروف',
          fullName: user?.full_name || user?.username || 'غير معروف',
          role: user?.role || 'غير معروف',
          byType: {},
          totalOperations: 0,
          totalWaste: 0,
        };
      }

      const type = stat.type;
      const typeLabel = type === 'cutting' ? 'القص' : type === 'gluing' ? 'التغرية' : type;

      productionProcessByUser[userId].byType[type] = {
        type: type,
        typeLabel: typeLabel,
        operationsCount: stat._count.process_id,
        totalWaste: stat._sum.waste || 0,
      };

      productionProcessByUser[userId].totalOperations += stat._count.process_id;
      productionProcessByUser[userId].totalWaste += stat._sum.waste || 0;
    });

    const productionProcessStatsByUser = Object.values(productionProcessByUser);

    return {
      period,
      dateRange: { startDate, endDate },

      // إحصائيات WarehouseMovement حسب المستخدم
      warehouseMovements: {
        total: warehouseStats.reduce((sum, s) => sum + s._count.movement_id, 0),
        byUser: warehouseStatsByUser.sort((a, b) => b.operationsCount - a.operationsCount),
      },

      // إحصائيات Slite حسب المستخدم
      slites: {
        total: sliteStats.reduce((sum, s) => sum + s._count.slite_id, 0),
        byUser: sliteStatsByUser.sort((a, b) => b.operationsCount - a.operationsCount),
      },

      // إحصائيات ProductionProcess حسب المستخدم والنوع
      productionProcesses: {
        total: productionProcessStats.reduce((sum, s) => sum + s._count.process_id, 0),
        byUser: productionProcessStatsByUser.sort((a, b) => b.totalOperations - a.totalOperations),
      },
    };
  } catch (error) {
    logger.error("خطأ في getOperationsStatsByUser:", error);
    throw error;
  }
};

/**
 * العمليات الموجودة - مخرجات الإنتاج
 */
export const getProductionOutputs = async (period = "month") => {
  try {
    const { startDate, endDate } = getDateRange(period);

    const cuttingProcesses = await prisma.productionProcess.count({
      where: {
        type: "cutting",
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      }

    });

    const gluingProcesses = await prisma.productionProcess.count({
      where: {
        type: "gluing",
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      }

    });

    const warehouseMovements = await prisma.warehouseMovement.count({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      }
    });

    const sliteprocesses = await prisma.slite.count({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      }
    });

    // تصنيف العمليات حسب النوع
    const outputs = {
      // عمليات أمين المستودع
      warehouseOutputs: warehouseMovements,

      // عمليات التشريح (slitting)
      slittingOutputs: sliteprocesses,

      // عمليات القص (cutting)
      cuttingOutputs: cuttingProcesses,

      // عمليات التغرية (gluing)
      gluingOutputs: gluingProcesses,
    };

    return {
      period,
      dateRange: { startDate, endDate },
      outputs
    }
  } catch (error) {
    logger.error("خطأ في getProductionOutputs:", error);
    throw error;
  }
};



