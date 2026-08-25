import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { protect, requireAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateProfileSchema, changePasswordSchema } from '../validators/admin.validator.js';

const router = Router();

router.use(protect, requireAdmin);

router.get('/profile', AdminController.getProfile);
router.patch('/profile', validate(updateProfileSchema), AdminController.updateProfile);
router.patch('/profile/password', validate(changePasswordSchema), AdminController.changePassword);

export default router;