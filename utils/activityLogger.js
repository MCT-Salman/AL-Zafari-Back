import { logActivity } from "../services/activityLog.service.js";
import { getRealIP } from "./ip.js";

/**
 * Helper function لتسجيل نشاط CREATE
 */
export const logCreate = async (req, module, entityId, newData, entityRef = null) => {
  return await logActivity({
    userId: req.user?.id,
    action: "CREATE",
    module,
    entityId,
    entityRef,
    newData,
    ip: getRealIP(req),
    userAgent: req.headers['user-agent'],
  });
};

/**
 * Helper function لتسجيل نشاط UPDATE
 */
export const logUpdate = async (req, module, entityId, oldData, newData, entityRef = null) => {
  return await logActivity({
    userId: req.user?.id,
    action: "UPDATE",
    module,
    entityId,
    entityRef,
    oldData,
    newData,
    ip: getRealIP(req),
    userAgent: req.headers['user-agent'],
  });
};

/**
 * Helper function لتسجيل نشاط DELETE
 */
export const logDelete = async (req, module, entityId, oldData, entityRef = null) => {
  return await logActivity({
    userId: req.user?.id,
    action: "DELETE",
    module,
    entityId,
    entityRef,
    oldData,
    ip: getRealIP(req),
    userAgent: req.headers['user-agent'],
  });
};

/**
 * Helper function لتسجيل نشاط VIEW
 */
export const logView = async (req, module, entityId = null, entityRef = null) => {
  return await logActivity({
    userId: req.user?.id,
    action: "VIEW",
    module,
    entityId,
    entityRef,
    ip: getRealIP(req),
    userAgent: req.headers['user-agent'],
  });
};

/**
 * Helper function لتسجيل نشاط SEARCH
 */
export const logSearch = async (req, module, searchQuery) => {
  return await logActivity({
    userId: req.user?.id,
    action: "SEARCH",
    module,
    searchQuery,
    ip: getRealIP(req),
    userAgent: req.headers['user-agent'],
  });
};

/**
 * Helper function لتسجيل نشاط LOGIN
 */
export const logLogin = async (req, userId) => {
  return await logActivity({
    userId,
    action: "LOGIN",
    module: "auth",
    ip: getRealIP(req),
    userAgent: req.headers['user-agent'],
  });
};

/**
 * Helper function لتسجيل نشاط LOGOUT
 */
export const logLogout = async (req, userId) => {
  return await logActivity({
    userId,
    action: "LOGOUT",
    module: "auth",
    ip: getRealIP(req),
    userAgent: req.headers['user-agent'],
  });
};

/**
 * Helper function لتسجيل نشاط EXPORT
 */
export const logExport = async (req, module, entityRef = null) => {
  return await logActivity({
    userId: req.user?.id,
    action: "EXPORT",
    module,
    entityRef,
    ip: getRealIP(req),
    userAgent: req.headers['user-agent'],
  });
};

/**
 * Helper function عامة لتسجيل أي نشاط
 */
export const logCustomActivity = async (req, action, module, data = {}) => {
  return await logActivity({
    userId: req.user?.id || data.userId,
    action,
    module,
    entityId: data.entityId,
    entityRef: data.entityRef,
    searchQuery: data.searchQuery,
    oldData: data.oldData,
    newData: data.newData,
    ip: data.ip || getRealIP(req),
    userAgent: data.userAgent || req.headers['user-agent'],
  });
};

