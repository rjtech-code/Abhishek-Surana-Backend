import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller.js';
import { protect, requireAdmin } from '../middlewares/auth.middleware.js';
import { commentLimiter } from '../middlewares/rateLimiter.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createCommentSchema, updateCommentStatusSchema } from '../validators/comment.validator.js';

const router = Router();

// Public routes
router.get('/blogs/:blogId/comments', CommentController.getPublicComments);
router.post('/blogs/:blogId/comments', commentLimiter, validate(createCommentSchema), CommentController.addComment);

// Admin routes
router.get('/admin/comments', protect, requireAdmin, CommentController.getAdminComments);
router.patch('/admin/comments/:id/status', protect, requireAdmin, validate(updateCommentStatusSchema), CommentController.updateStatus);
router.delete('/admin/comments/:id', protect, requireAdmin, CommentController.deleteComment);

export default router;