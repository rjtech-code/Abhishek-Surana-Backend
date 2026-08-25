import { Router } from 'express';
import { HomepageController } from '../controllers/homepage.controller.js';
import { protect, requireAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateHomepageSchema } from '../validators/homepage.validator.js';

const router = Router();

// Public route
router.get('/homepage', HomepageController.getPublicHomepage);

// Admin routes
router.get('/admin/homepage', protect, requireAdmin, HomepageController.getAdminHomepage);
router.patch('/admin/homepage', protect, requireAdmin, validate(updateHomepageSchema), HomepageController.updateHomepage);

export default router;