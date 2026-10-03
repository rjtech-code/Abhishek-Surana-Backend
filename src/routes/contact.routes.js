import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { ContactController } from '../controllers/contact.controller.js';
import { protect, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Spam se bachne ke liye: ek IP se 1 ghante mein max 5 messages
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many messages sent. Please try again after some time.',
  },
});

/* ================= PUBLIC ================= */

router.post('/contact', contactLimiter, ContactController.createMessage);

/* ================= ADMIN ================= */

router.get(
  '/admin/messages',
  protect,
  requireAdmin,
  ContactController.getAdminMessages
);

// NOTE: ye `/:id` wale routes se pehle hona chahiye
router.get(
  '/admin/messages/unread-count',
  protect,
  requireAdmin,
  ContactController.getUnreadCount
);

router.patch(
  '/admin/messages/:id/read',
  protect,
  requireAdmin,
  ContactController.setRead
);

router.delete(
  '/admin/messages/:id',
  protect,
  requireAdmin,
  ContactController.deleteMessage
);

export default router;