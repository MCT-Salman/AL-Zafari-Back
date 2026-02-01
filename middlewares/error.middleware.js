// مركزية معالجة الأخطاء
// استخدم next(err) في الكونترولرز لتمرير الأخطاء هنا

import { ERROR_SERVER } from "../validators/messagesResponse.js";
import { ERROR_SERVER_STATUS_CODE } from "../validators/statusCode.js";
import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  // إذا كان الرد قد بدأ، مرر للمعالج الافتراضي
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || err.status || ERROR_SERVER_STATUS_CODE;
  const code = err.code || undefined;

  // دعم رسائل rate limit التي أضفنا لها retryAfterSeconds سابقاً
  const payload = {
    success: false,
    message: err.message || ERROR_SERVER,
    data:{}
  };
  if (code) payload.code = code;
  if (typeof err.retryAfterSeconds === 'number') {
    payload.retryAfterSeconds = err.retryAfterSeconds;
  }
  if (typeof err.waitMessage === 'string') {
    payload.waitMessage = err.waitMessage;
  }

  // التفاصيل في التطوير فقط
  if (process.env.NODE_ENV === 'development' && err.stack) {
    payload.details = err.stack;
  }

  // تسجيل الخطأ عبر Winston
  try {
    logger.error(err.message || 'Unhandled error', {
      status,
      code,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userId: req.user?.id,
      params: req.params,
      query: req.query,
      body: req.body,
      stack: err.stack
    });
  } catch (_) {}

  res.status(status).json(payload);
};
