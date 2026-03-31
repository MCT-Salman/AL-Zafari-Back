// utils/notificationHelper.js
import {
  sendNotificationToUser,
  sendNotificationByRole,
} from "../services/notification.service.js";

let socketIO = null;

/**
 * تعيين Socket.IO instance
 */
export const setSocketIO = (io) => {
  socketIO = io;
};

/**
 * الحصول على Socket.IO instance
 */
export const getSocketIO = () => {
  return socketIO;
};

/**
 * إرسال إشعار طلب جديد
 */
export const notifyNewOrder = async (order, createdBy) => {
  try {
    // إشعار للمدراء ومدراء المخازن
    await sendNotificationByRole(
      ["cashier", "sales", "Warehouse_Keeper", "Warehouse_Products"],
      {
        title: "طلب جديد",
        body: `تم إنشاء طلب جديد رقم ${order.order_id}`,
        type: "ORDER_NEW",
        data: {
          orderId: order.order_id,
          orderNumber: order.order_id,
          createdBy,
        },
        link: `/orders/${order.order_id}`,
      },
      socketIO
    );
  } catch (error) {
    console.error("Error sending new order notification:", error);
  }
};

/**
 * إرسال إشعار تحديث طلب
 */
export const notifyOrderUpdate = async (order, updatedBy) => {
  try {
    // إشعار للمدراء ومدراء المخازن
    await sendNotificationByRole(
      ["cashier", "sales", "Warehouse_Keeper", "Warehouse_Products"],
      {
        title: "تحديث طلب",
        body: `تم تحديث الطلب رقم ${order.order_id}`,
        type: "ORDER_UPDATE",
        data: {
          orderId: order.order_id,
          orderNumber: order.order_id,
          updatedBy,
        },
        link: `/orders/${order.order_id}`,
      },
      socketIO
    );
  } catch (error) {
    console.error("Error sending order update notification:", error);
  }
};

/**
 * إرسال إشعار حذف طلب
 */
export const notifyOrderDelete = async (orderNumber, deletedBy) => {
  try {
    await sendNotificationByRole(
      ["cashier", "sales"],
      {
        title: "حذف طلب",
        body: `تم حذف الطلب رقم ${orderNumber}`,
        type: "ORDER_DELETE",
        data: {
          orderNumber,
          deletedBy,
        },
      },
      socketIO
    );
  } catch (error) {
    console.error("Error sending order delete notification:", error);
  }
};

/**
 * إرسال إشعار فاتورة جديدة
 */
export const notifyNewInvoice = async (invoice, createdBy) => {
  try {
    // إشعار للعميل
    if (invoice.customer_id) {
      await sendNotificationToUser(
        invoice.customer_id,
        {
          title: "فاتورة جديدة",
          body: `تم إنشاء فاتورة جديدة رقم ${invoice.invoice_id}`,
          type: "INVOICE_NEW",
          data: {
            invoiceId: invoice.invoice_id,
            invoiceNumber: invoice.invoice_id,
          },
          link: `/invoices/${invoice.invoice_id}`,
        },
        socketIO
      );
    }

    // إشعار للمدراء
    await sendNotificationByRole(
      ["cashier", "sales", "accountant"],
      {
        title: "فاتورة جديدة",
        body: `تم إنشاء فاتورة جديدة رقم ${invoice.invoice_id}`,
        type: "INVOICE_NEW",
        data: {
          invoiceId: invoice.invoice_id,
          invoiceNumber: invoice.invoice_id,
          createdBy,
        },
        link: `/invoices/${invoice.invoice_id}`,
      },
      socketIO
    );
  } catch (error) {
    console.error("Error sending new invoice notification:", error);
  }
};

/**
 * إرسال إشعار دفعة فاتورة
 */
export const notifyInvoicePayment = async (invoice, paymentAmount, paidBy) => {
  try {
    await sendNotificationByRole(
      ["cashier", "sales", "accountant"],
      {
        title: "دفعة فاتورة",
        body: `تم دفع ${paymentAmount} دينار للفاتورة رقم ${invoice.invoice_id}`,
        type: "INVOICE_PAYMENT",
        data: {
          invoiceId: invoice.invoice_id,
          invoiceNumber: invoice.invoice_id,
          paymentAmount,
          paidBy,
        },
        link: `/invoices/${invoice.invoice_id}`,
      },
      socketIO
    );
  } catch (error) {
    console.error("Error sending invoice payment notification:", error);
  }
};

/**
 * إرسال إشعار عميل جديد
 */
export const notifyNewCustomer = async (customer, createdBy) => {
  try {
    await sendNotificationByRole(
      ["admin"],
      {
        title: "عميل جديد",
        body: `تم إضافة عميل جديد: ${customer.customer_name}`,
        type: "CUSTOMER_NEW",
        data: {
          customerId: customer.customer_id,
          customerName: customer.customer_name,
          createdBy,
        },
        link: `/customers/${customer.customer_id}`,
      },
      socketIO
    );
  } catch (error) {
    console.error("Error sending new customer notification:", error);
  }
};

/**
 * إرسال إشعار عملية إنتاج جديدة
 */
export const notifyNewProduction = async (production, createdBy) => {
  try {
    await sendNotificationByRole(
      ["production_manager"],
      {
        title: "عملية إنتاج جديدة",
        body: `تم إنشاء عملية إنتاج جديدة رقم ${production.process_id}`,
        type: "PRODUCTION_NEW",
        data: {
          processId: production.process_id,
          createdBy,
        },
        link: `/production/${production.process_id}`,
      },
      socketIO
    );
  } catch (error) {
    console.error("Error sending new production notification:", error);
  }
};

/**
 * إرسال إشعار حركة مخزن
 */
export const notifyWarehouseMovement = async (movement, createdBy) => {
  try {
    await sendNotificationByRole(
      ["Warehouse_Keeper"],
      {
        title: "حركة مخزن",
        body: `تم تسجيل حركة مخزن جديدة`,
        type: "WAREHOUSE_MOVEMENT",
        data: {
          movementId: movement.movement_id,
          movementType: movement.movement_type,
          createdBy,
        },
        link: `/warehouse/movements/${movement.movement_id}`,
      },
      socketIO
    );
  } catch (error) {
    console.error("Error sending warehouse movement notification:", error);
  }
};

/**
 * إرسال إشعار عملية تشريح جديدة
 */
export const notifyNewSlite = async (slite, createdBy) => {
  try {
    await sendNotificationByRole(
      ["Dissection_Technician"],
      {
        title: "عملية تشريح جديدة",
        body: `تم إنشاء عملية تشريح جديدة`,
        type: "SLITE_NEW",
        data: {
          sliteId: slite.slite_id,
          createdBy,
        },
        link: `/slite/${slite.slite_id}`,
      },
      socketIO
    );
  } catch (error) {
    console.error("Error sending new slite notification:", error);
  }
};

/**
 * إرسال إشعار طلب مبيعات جديد (لمسؤول الإنتاج)
 */
export const notifySalesOrder = async (salesOrder, createdBy) => {
  try {
    await sendNotificationByRole(
      ["production_manager"],
      {
        title: "طلب مبيعات جديد",
        body: `تم إنشاء طلب مبيعات جديد رقم ${salesOrder.sales_order_id}`,
        type: "SALES_ORDER_NEW",
        data: {
          salesOrderId: salesOrder.sales_order_id,
          createdBy,
          itemsCount: salesOrder.items?.length || 0,
        },
        link: `/sales-orders/${salesOrder.sales_order_id}`,
      },
      socketIO
    );
  } catch (error) {
    console.error("Error sending sales order notification:", error);
  }
};

/**
 * إرسال إشعار عند تحديث حالة طلب مبيعات (للمبيعات)
 */
export const notifySalesOrderStatusUpdate = async (salesOrder, oldStatus, newStatus, updatedBy) => {
  try {
    // تحديد رسالة الحالة
    const statusNames = {
      pending: "قيد الانتظار",
      processing: "قيد المعالجة",
      completed: "مكتمل",
      canceled: "ملغي",
    };

    const oldStatusName = statusNames[oldStatus] || oldStatus;
    const newStatusName = statusNames[newStatus] || newStatus;

    // إرسال إشعار لفريق المبيعات
    await sendNotificationByRole(
      ["sales"],
      {
        title: "تحديث حالة طلب مبيعات",
        body: `تم تحديث حالة طلب المبيعات رقم ${salesOrder.sales_order_id} من "${oldStatusName}" إلى "${newStatusName}"`,
        type: "SALES_ORDER_STATUS_UPDATE",
        data: {
          salesOrderId: salesOrder.sales_order_id,
          oldStatus,
          newStatus,
          updatedBy,
        },
        link: `/sales-orders/${salesOrder.sales_order_id}`,
      },
      socketIO
    );
  } catch (error) {
    console.error("Error sending sales order status update notification:", error);
  }
};

/**
 * إرسال إشعار طلب إنتاج جديد مع إشعارات مخصصة حسب نوع العنصر
 */
export const notifyProductionOrder = async (productionOrder, items, createdBy) => {
  try {
    // إشعار عام للمدراء
    await sendNotificationByRole(
      ["production_manager"],
      {
        title: "طلب إنتاج جديد",
        body: `تم إنشاء طلب إنتاج جديد رقم ${productionOrder.production_order_id}`,
        type: "PRODUCTION_ORDER_NEW",
        data: {
          productionOrderId: productionOrder.production_order_id,
          createdBy,
          itemsCount: items?.length || 0,
        },
        link: `/production-orders/${productionOrder.production_order_id}`,
      },
      socketIO
    );

    // إشعارات مخصصة حسب نوع العنصر
    if (items && items.length > 0) {
      const typeGroups = {
        slitting: [],
        cutting: [],
        gluing: [],
        warehouse: [],
        orderproduction: [],
      };

      // تجميع العناصر حسب النوع
      items.forEach((item) => {
        if (item.type && typeGroups[item.type]) {
          typeGroups[item.type].push(item);
        }
      });

      // إرسال إشعار لعمال التشريح
      if (typeGroups.slitting.length > 0) {
        await sendNotificationByRole(
          ["Dissection_Technician"],
          {
            title: "مهمة تشريح جديدة",
            body: `لديك ${typeGroups.slitting.length} عنصر تشريح في طلب الإنتاج رقم ${productionOrder.production_order_id}`,
            type: "PRODUCTION_ORDER_SLITTING",
            data: {
              productionOrderId: productionOrder.production_order_id,
              itemsCount: typeGroups.slitting.length,
              items: typeGroups.slitting,
            },
            link: `/production-orders/${productionOrder.production_order_id}`,
          },
          socketIO
        );
      }

      // إرسال إشعار لعمال القص
      if (typeGroups.cutting.length > 0) {
        await sendNotificationByRole(
          ["Cutting_Technician"],
          {
            title: "مهمة قص جديدة",
            body: `لديك ${typeGroups.cutting.length} عنصر قص في طلب الإنتاج رقم ${productionOrder.production_order_id}`,
            type: "PRODUCTION_ORDER_CUTTING",
            data: {
              productionOrderId: productionOrder.production_order_id,
              itemsCount: typeGroups.cutting.length,
              items: typeGroups.cutting,
            },
            link: `/production-orders/${productionOrder.production_order_id}`,
          },
          socketIO
        );
      }

      // إرسال إشعار لعمال اللصق
      if (typeGroups.gluing.length > 0) {
        await sendNotificationByRole(
          ["Gluing_Technician"],
          {
            title: "مهمة لصق جديدة",
            body: `لديك ${typeGroups.gluing.length} عنصر لصق في طلب الإنتاج رقم ${productionOrder.production_order_id}`,
            type: "PRODUCTION_ORDER_GLUING",
            data: {
              productionOrderId: productionOrder.production_order_id,
              itemsCount: typeGroups.gluing.length,
              items: typeGroups.gluing,
            },
            link: `/production-orders/${productionOrder.production_order_id}`,
          },
          socketIO
        );
      }

      // إرسال إشعار لمسؤول المخزن
      if (typeGroups.warehouse.length > 0) {
        await sendNotificationByRole(
          ["Warehouse_Keeper", "Warehouse_Products"],
          {
            title: "طلب مخزن جديد",
            body: `لديك ${typeGroups.warehouse.length} عنصر مخزن في طلب الإنتاج رقم ${productionOrder.production_order_id}`,
            type: "PRODUCTION_ORDER_WAREHOUSE",
            data: {
              productionOrderId: productionOrder.production_order_id,
              itemsCount: typeGroups.warehouse.length,
              items: typeGroups.warehouse,
            },
            link: `/production-orders/${productionOrder.production_order_id}`,
          },
          socketIO
        );
      }

      // إرسال إشعار لعمليات الإنتاج
      if (typeGroups.orderproduction.length > 0) {
        await sendNotificationByRole(
          ["production_manager"],
          {
            title: "طلب إنتاج جديد",
            body: `لديك ${typeGroups.orderproduction.length} عنصر إنتاج في طلب الإنتاج رقم ${productionOrder.production_order_id}`,
            type: "PRODUCTION_ORDER_PRODUCTION",
            data: {
              productionOrderId: productionOrder.production_order_id,
              itemsCount: typeGroups.orderproduction.length,
              items: typeGroups.orderproduction,
            },
            link: `/production-orders/${productionOrder.production_order_id}`,
          },
          socketIO
        );
      }
    }
  } catch (error) {
    console.error("Error sending production order notification:", error);
  }
};


/**
 * إرسال إشعار عند تحديث حالة عنصر طلب إنتاج
 * يرسل إشعار لمدير الإنتاج وللفنيين المختصين بنفس نوع المهمة
 */
export const notifyProductionOrderItemStatusUpdate = async (item, oldStatus, newStatus, updatedBy) => {
  try {
    // تحديد الأدوار المستهدفة حسب نوع المهمة
    const roleMapping = {
      slitting: ["Dissection_Technician"],
      cutting: ["Cutting_Technician"],
      gluing: ["Gluing_Technician"],
      warehouse: ["Warehouse_Keeper", "Warehouse_Products"],
      orderproduction: ["production_manager"],
    };

    // تحديد العنوان والنوع حسب نوع المهمة
    const taskTypeNames = {
      slitting: "تشريح",
      cutting: "قص",
      gluing: "لصق",
      warehouse: "مخزن",
      orderproduction: "إنتاج",
    };

    // تحديد رسالة الحالة
    const statusNames = {
      pending: "قيد الانتظار",
      preparing: "قيد التجهيز",
      completed: "مكتملة",
      canceled: "ملغية",
    };

    const taskTypeName = taskTypeNames[item.type] || item.type;
    const statusName = statusNames[newStatus] || newStatus;

    // إرسال إشعار لمدير الإنتاج دائماً
    await sendNotificationByRole(
      ["production_manager"],
      {
        title: `تحديث حالة مهمة ${taskTypeName}`,
        body: `تم تحديث حالة مهمة ${taskTypeName} في طلب الإنتاج رقم ${item.production_order_id} إلى: ${statusName}`,
        type: "PRODUCTION_ORDER_UPDATE",
        data: {
          productionOrderId: item.production_order_id,
          productionOrderItemId: item.production_order_item_id,
          itemType: item.type,
          oldStatus,
          newStatus,
          updatedBy,
        },
        link: `/production-orders/${item.production_order_id}`,
      },
      socketIO
    );

    // إرسال إشعار للفنيين المختصين بهذا النوع من المهام
    const targetRoles = roleMapping[item.type];
    if (targetRoles && targetRoles.length > 0) {
      await sendNotificationByRole(
        targetRoles,
        {
          title: `تحديث حالة مهمة ${taskTypeName}`,
          body: `تم تحديث حالة مهمة ${taskTypeName} الخاصة بك في طلب الإنتاج رقم ${item.production_order_id} إلى: ${statusName}`,
          type: `PRODUCTION_ORDER_UPDATE`,
          data: {
            productionOrderId: item.production_order_id,
            productionOrderItemId: item.production_order_item_id,
            itemType: item.type,
            oldStatus,
            newStatus,
            updatedBy,
          },
          link: `/production-orders/${item.production_order_id}`,
        },
        socketIO
      );
    }
  } catch (error) {
    console.error("Error sending production order item status update notification:", error);
  }
};

/**
 * إرسال إشعار عند إكمال طلب إنتاج بالكامل
 * (يُستخدم عند تحديث حالة ProductionOrder نفسه وليس العناصر)
 */
export const notifyProductionOrderCompleted = async (productionOrder, items, completedBy) => {
  try {
    await sendNotificationByRole(
      ["production_manager"],
      {
        title: "طلب إنتاج مكتمل",
        body: `تم إكمال طلب الإنتاج رقم ${productionOrder.production_order_id}`,
        type: "PRODUCTION_ORDER_COMPLETED",
        data: {
          productionOrderId: productionOrder.production_order_id,
          completedBy,
        },
        link: `/production-orders/${productionOrder.production_order_id}`,
      },
      socketIO
    );
  } catch (error) {
    console.error("Error sending production order completed notification:", error);
  }
};
