import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { protect, requireAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateProfileContentSchema } from '../validators/profile.validator.js';

const router = Router();

// Public route
router.get('/profile', ProfileController.getPublicProfile);

// Admin routes
router.get('/admin/profile-content', protect, requireAdmin, ProfileController.getAdminProfileContent);
router.patch('/admin/profile-content', protect, requireAdmin, validate(updateProfileContentSchema), ProfileController.updateProfileContent);

export default router;