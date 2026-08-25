import { Router } from 'express';
import { GalleryController } from '../controllers/gallery.controller.js';
import { protect, requireAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createGallerySchema, updateGallerySchema } from '../validators/gallery.validator.js';

const router = Router();

// Public routes
router.get('/gallery', GalleryController.getPublicGallery);
router.get('/gallery/categories', GalleryController.getCategories);

// Admin routes
router.get('/admin/gallery', protect, requireAdmin, GalleryController.getAdminGallery);
router.get('/admin/gallery/:id', protect, requireAdmin, GalleryController.getAdminGalleryById);
router.post('/admin/gallery', protect, requireAdmin, validate(createGallerySchema), GalleryController.createItem);
router.patch('/admin/gallery/:id', protect, requireAdmin, validate(updateGallerySchema), GalleryController.updateItem);
router.delete('/admin/gallery/:id', protect, requireAdmin, GalleryController.deleteItem);

export default router;