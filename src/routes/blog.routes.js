import { Router } from "express";

import {
  BlogController,
} from "../controllers/blog.controller.js";

import {
  protect,
  requireAdmin,
} from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  createBlogSchema,
  updateBlogSchema,
} from "../validators/blog.validator.js";

import {
  uploadBlogImages,
} from "../middlewares/upload.middleware.js";

const router = Router();

/* ================= PUBLIC ================= */

router.get(
  "/blogs",
  BlogController.getPublicBlogs
);

router.get(
  "/blogs/featured",
  BlogController.getFeaturedBlogs
);

router.get(
  "/blogs/categories",
  BlogController.getCategories
);

router.get(
  "/blogs/tags",
  BlogController.getTags
);

router.get(
  "/blogs/:slug",
  BlogController.getPublicBlogBySlug
);

/* ================= ADMIN ================= */

router.get(
  "/admin/blogs",
  protect,
  requireAdmin,
  BlogController.getAdminBlogs
);

router.get(
  "/admin/blogs/:id",
  protect,
  requireAdmin,
  BlogController.getAdminBlogById
);

router.post(
  "/admin/blogs",
  protect,
  requireAdmin,
  uploadBlogImages,
  validate(createBlogSchema),
  BlogController.createBlog
);

router.patch(
  "/admin/blogs/:id",
  protect,
  requireAdmin,
  uploadBlogImages,
  validate(updateBlogSchema),
  BlogController.updateBlog
);

router.delete(
  "/admin/blogs/:id",
  protect,
  requireAdmin,
  BlogController.deleteBlog
);

router.patch(
  "/admin/blogs/:id/publish",
  protect,
  requireAdmin,
  BlogController.togglePublish
);

router.patch(
  "/admin/blogs/:id/featured",
  protect,
  requireAdmin,
  BlogController.toggleFeatured
);

export default router;