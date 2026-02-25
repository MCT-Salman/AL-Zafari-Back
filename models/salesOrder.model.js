// models/SalesOrder.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء أمر إنتاج جديد
 */
export const create = async (data) => {
  return prisma.SalesOrder.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      salesOrderItems: {
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
 * البحث عن أمر إنتاج حسب المعرف
 */
export const findById = async (sales_order_id) => {
  return prisma.SalesOrder.findUnique({
    where: { sales_order_id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      salesOrderItems: {
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

export const findByIdWithItems = async (Sales_order_id) => {
  return prisma.SalesOrder.findUnique({
    where: { Sales_order_id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      salesOrderItems: {
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
 * جلب جميع أوامر الإنتاج مع pagination
 */
export const findAll = async ({ where = {} }) => {
  return prisma.SalesOrder.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      salesOrderItems: {
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
    orderBy: { created_at: "desc" },
  });
};

/**
 * عد جميع أوامر الإنتاج
 */
export const count = async (where = {}) => {
  return prisma.SalesOrder.count({ where });
};

/**
 * تحديث أمر إنتاج حسب المعرف
 */
export const updateById = async (Sales_order_id, data) => {
  return prisma.SalesOrder.update({
    where: { Sales_order_id },
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      salesOrderItems: {
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
 * حذف أمر إنتاج نهائيًا
 */
export const deleteById = async (Sales_order_id) => {
  return prisma.SalesOrder.delete({
    where: { Sales_order_id },
  });
};
