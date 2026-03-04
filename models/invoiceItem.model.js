// models/invoiceItem.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء عنصر فاتورة جديد
 */
export const create = async (data) => {
  return prisma.invoiceItem.create({
    data,
    include: {
      invoice: true,
      orderItem: {
        include: {
          color: {
            include: {
              ruler: {
                include: {
                  material: true,
                },
              },
            },
          },
          batch: true,
        },
      },
    },
  });
};

/**
 * إنشاء عدة عناصر فاتورة
 */
export const createMany = async (data) => {
  return prisma.invoiceItem.createMany({
    data,
  });
};

/**
 * البحث عن عنصر فاتورة حسب المعرف
 */
export const findById = async (invoice_item_id) => {
  return prisma.invoiceItem.findUnique({
    where: { invoice_item_id },
    include: {
      invoice: {
        include: {
          customer: true,
          order: true,
        },
      },
      orderItem: {
        include: {
          color: {
            include: {
              ruler: {
                include: {
                  material: true,
                },
              },
            },
          },
          batch: true,
        },
      },
    },
  });
};

/**
 * جلب جميع عناصر الفاتورة
 */
export const findAll = async ({ where = {} }) => {
  return prisma.invoiceItem.findMany({
    where,
    include: {
      invoice: true,
      orderItem: {
        include: {
          color: {
            include: {
              ruler: {
                include: {
                  material: true,
                },
              },
            },
          },
          batch: true,
        },
      },
    },
  });
};

/**
 * عد جميع عناصر الفاتورة
 */
export const count = async (where = {}) => {
  return prisma.invoiceItem.count({ where });
};

/**
 * تحديث عنصر فاتورة حسب المعرف
 */
export const updateById = async (invoice_item_id, data) => {
  return prisma.invoiceItem.update({
    where: { invoice_item_id },
    data,
    include: {
      invoice: true,
      orderItem: {
        include: {
          color: {
            include: {
              ruler: {
                include: {
                  material: true,
                },
              },
            },
          },
          batch: true,
        },
      },
    },
  });
};

/**
 * حذف عنصر فاتورة نهائيًا
 */
export const deleteById = async (invoice_item_id) => {
  return prisma.invoiceItem.delete({
    where: { invoice_item_id },
  });
};

/**
 * حذف جميع عناصر فاتورة معينة
 */
export const deleteByInvoiceId = async (invoice_id) => {
  return prisma.invoiceItem.deleteMany({
    where: { invoice_id },
  });
};

/**
 * البحث عن عناصر فاتورة حسب الفاتورة
 */
export const findByInvoiceId = async (invoice_id) => {
  return prisma.invoiceItem.findMany({
    where: { invoice_id },
    include: {
      orderItem: {
        include: {
          color: {
            include: {
              ruler: {
                include: {
                  material: true,
                },
              },
            },
          },
          batch: true,
        },
      },
    },
  });
};

