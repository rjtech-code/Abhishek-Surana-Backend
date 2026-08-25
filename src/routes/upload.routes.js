import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { protect, requireAdmin } from '../middlewares/auth.middleware.js';
import { uploadSingleImage } from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/admin/uploads/image', protect, requireAdmin, uploadSingleImage, UploadController.uploadImage);

export default router;