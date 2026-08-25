import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', protect, AuthController.getMe);

export default router;