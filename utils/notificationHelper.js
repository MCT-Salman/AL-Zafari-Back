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
      ["cashier", "sales"],
      {
        title: "طلب جديد",
        body: `تم إنشاء طلب جديد رقم ${order.order_number}`,
        type: "ORDER_NEW",
        data: {
          orderId: order.order_id,
          orderNumber: order.order_number,
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
      ["cashier", "sales"],
      {
        title: "تحديث طلب",
        body: `تم تحديث الطلب رقم ${order.order_number}`,
        type: "ORDER_UPDATE",
        data: {
          orderId: order.order_id,
          orderNumber: order.order_number,
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
          body: `تم إنشاء فاتورة جديدة رقم ${invoice.invoice_number}`,
          type: "INVOICE_NEW",
          data: {
            invoiceId: invoice.invoice_id,
            invoiceNumber: invoice.invoice_number,
          },
          link: `/invoices/${invoice.invoice_id}`,
        },
        socketIO
      );
    }

    // إشعار للمدراء
    await sendNotificationByRole(
      ["cashier", "sales" , "accountant"],
      {
        title: "فاتورة جديدة",
        body: `تم إنشاء فاتورة جديدة رقم ${invoice.invoice_number}`,
        type: "INVOICE_NEW",
        data: {
          invoiceId: invoice.invoice_id,
          invoiceNumber: invoice.invoice_number,
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
        body: `تم دفع ${paymentAmount} دينار للفاتورة رقم ${invoice.invoice_number}`,
        type: "INVOICE_PAYMENT",
        data: {
          invoiceId: invoice.invoice_id,
          invoiceNumber: invoice.invoice_number,
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
      [ "production_manager"],
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
          ["Warehouse_Keeper" , "Warehouse_Products"],
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


export const notifyProductionOrderCompleted = async (productionOrder, items, completedBy) => {
  try {
    await sendNotificationByRole(
      ["production_manager"],
      {
        title: "طلب إنتاج مكتمل",
        body: `تم إكمال طلب الإنتاج رقم ${productionOrder.production_order_id}`,
        type: "GENERAL",
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
