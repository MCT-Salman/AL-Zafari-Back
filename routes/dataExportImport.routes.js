// routes/dataExportImport.routes.js
import { Router } from "express";
import {
  exportMultiple,
  exportAndDownload,
  importDirect,
  importFromUpload,
  getAvailableTables,
} from "../controllers/dataExportImport.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { uploadJsonFile } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(requireAuth);
router.use(requireRole(["admin"]))

// =============== التصدير ===============
router.get("/available-tables", getAvailableTables);

// تصدير وتحميل مباشر
router.post("/export/download-multiple", exportAndDownload);
router.post("/export/multiple", exportMultiple); 

// =============== الاستيراد ===============
router.post("/import/direct", importDirect); 
router.post("/import/upload", uploadJsonFile.single("file"), importFromUpload); 

export default router;

