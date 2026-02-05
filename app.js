
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import helmet from 'helmet';
import { xssSanitizer } from './validators/xss.middleware.js';
import logger from './utils/logger.js';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import csrf from 'csurf'; // معطل حال - يمكن تفعيله للـ web forms



import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import constantTypeRoutes from './routes/constantType.routes.js';
import constantValueRoutes from './routes/constantValue.routes.js';
import materialRoutes from './routes/material.routes.js';
import colorRoutes from './routes/color.routes.js';
import priceColorRoutes from './routes/priceColor.routes.js';
import rulerRoutes from './routes/ruler.routes.js';
import batchRoutes from './routes/batch.routes.js';
import customerRoutes from './routes/customer.routes.js';
import orderRoutes from './routes/order.routes.js';
import settingRoutes from './routes/setting.routes.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5050;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));


app.set('trust proxy', 1);
/*
const allowedOrigins = [
  'https://app.automation.com',
  'https://147.79.118.55:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.3.11:3000'
];

// Middleware CORS آمن
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  // Preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});*/
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(xssSanitizer);
// app.use(csrfProtection); // إذا كنت تريد استخدامه
app.use(compression());
app.use(morgan('dev'));

// CSRF Protection - معطل للـ API، يمكن تفعيله للـ web forms فقط
const csrfProtection = csrf({ 
  cookie: true,
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
});

// تطبيق CSRF فقط على المسارات التي تحتاجه (مثل forms)
// أو استثناء API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/auth') ||
      req.path.startsWith('/user') ||
      req.path.startsWith('/constant-type') ||
      req.path.startsWith('/constant-value') ||
      req.path.startsWith('/material') ||
      req.path.startsWith('/color') ||
      req.path.startsWith('/price-color') ||
      req.path.startsWith('/ruler') ||
      req.path.startsWith('/batch') ||
      req.path.startsWith('/customer') ||
      req.path.startsWith('/order') ||
      req.path.startsWith('/setting')) {
    return next();
  }
  csrfProtection(req, res, next);
});

app.use(express.static(path.join(__dirname, 'public')));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب لكل IP
  message: 'تم تجاوز الحد المسموح من الطلبات'
});

app.use('/api/', apiLimiter);

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/constant-type', constantTypeRoutes);
app.use('/constant-value', constantValueRoutes);
app.use('/material', materialRoutes);
app.use('/color', colorRoutes);
app.use('/price-color', priceColorRoutes);
app.use('/ruler', rulerRoutes);
app.use('/batch', batchRoutes);
app.use('/customer', customerRoutes);
app.use('/order', orderRoutes);
app.use('/setting', settingRoutes);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to automation Backend API',
    version: '1.0.0'
  });
});

// 404 Handler - يجب أن يكون قبل error handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'المسار غير موجود',
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((error, req, res, _next) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.error('Unhandled error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userId: req.user?.id
    });
  }

  if (error.name === 'ValidationError') return res.status(400).json({ success: false, error: 'بيانات غير صالحة', details: error.message });
  if (error.name === 'JsonWebTokenError') return res.status(401).json({ success: false, error: 'رمز المصادقة غير صالح' });
  if (error.name === 'TokenExpiredError') return res.status(401).json({ success: false, error: 'انتهت صلاحية رمز المصادقة', code: 'TOKEN_EXPIRED' });

  // Prisma errors
  if (error.code === 'P2002') return res.status(409).json({ success: false, error: 'البيانات موجودة مسبق' });
  if (error.code === 'P2025') return res.status(404).json({ success: false, error: 'البيانات غير موجودة' });

  // Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ success: false, error: 'حجم الملف كبير' });
  if (error.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ success: false, error: 'نوع الملف غير مدعوم' });

  res.status(500).json({ success: false, error: 'خطأ في الخادم', ...(process.env.NODE_ENV === 'development' && { details: error.message }) });
});

app.listen(port, () => {
  console.log('Server is running on port 3000');
});
