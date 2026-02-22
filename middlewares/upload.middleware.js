import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Helper: Ensure directory exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Factory: create storage for a given folder
const createStorage = (folderName) => {
  const uploadPath = path.join(process.cwd(), 'uploads', 'images', folderName);
  ensureDirExists(uploadPath);

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // إصلاح ترميز الاسم
      const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

      const uniqueSuffix =
        Date.now() + '-' + Math.round(Math.random() * 1e9);

      cb(null, uniqueSuffix + path.extname(originalName));
    }
  });
};


// File filter for images
const fileImageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Middlewares for different folders
export const uploadImage = multer({
  storage: createStorage('colors'),
  fileFilter: fileImageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB for images
});


