import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import profileRoutes from './profile.routes.js';
import homepageRoutes from './homepage.routes.js';
import blogRoutes from './blog.routes.js';
import reactionRoutes from './reaction.routes.js';
import commentRoutes from './comment.routes.js';
import initiativeRoutes from './initiative.routes.js';
import galleryRoutes from './gallery.routes.js';
import uploadRoutes from './upload.routes.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/', profileRoutes);
router.use('/', homepageRoutes);
router.use('/', blogRoutes);
router.use('/', reactionRoutes);
router.use('/', commentRoutes);
router.use('/', initiativeRoutes);
router.use('/', galleryRoutes);
router.use('/', uploadRoutes);

export default router;