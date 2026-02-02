// models/user.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء مستخدم جديد
 */
export const create = async (data) => {
  return prisma.users.create({
    data,
  });
};

/**
 * البحث عن مستخدم حسب المعرف
 */
export const findById = async (id) => {
  return prisma.users.findUnique({
    where: { id },
  });
};

/**
 * البحث عن مستخدم حسب الهاتف
 */
export const findByPhone = async (phone) => {
  return prisma.users.findUnique({
    where: { phone },
  });
};

/**
 * البحث عن مستخدم حسب اسم المستخدم (Username)
 */
export const findByUsername = async (username) => {
  return prisma.users.findUnique({
    where: { username },
  });
};

/**
 * البحث عن مستخدم حسب الهاتف أو اسم المستخدم (Username)
 */
export const findByPhoneOrUsername = async (identifier) => {
  return prisma.users.findFirst({
    where: {
      OR: [
        { phone : identifier },
        { username : identifier },
      ],
    },
  });
};

/**
 * تحديث بيانات المستخدم حسب المعرف
 */
export const updateById = async (id, data) => {
  return prisma.users.update({
    where: { id },
    data,
  });
};

/**
 * تعطيل المستخدم مؤقتًا (soft delete)
 */
export const deactivate = async (id) => {
  return prisma.users.update({
    where: { id },
    data: { is_active: false },
  });
};

/**
 * حذف المستخدم نهائيًا
 */
export const deleteById = async (id) => {
  return prisma.users.delete({
    where: { id },
  });
};

/**
 * جلب جميع المستخدمين مع pagination
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.users.findMany({
    where,
    skip,
    take,
    orderBy: { created_at: 'desc' },
  });
};

/**
 * تحديث الصورة الشخصية للمستخدم
 */
export const updateAvatar = async (id, avatarUrl) => {
  return prisma.users.update({
    where: { id },
    data: { avatarUrl },
  });
};

/**
 * تفعيل/إلغاء تفعيل الحساب
 */
export const setActiveStatus = async (id, isActive) => {
  return prisma.users.update({
    where: { id },
    data: { is_active: isActive },
  });
};
