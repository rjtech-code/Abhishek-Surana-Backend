import { Router } from "express";

import { InitiativeController } from "../controllers/initiative.controller.js";

import {
  protect,
  requireAdmin,
} from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  createInitiativeSchema,
  updateInitiativeSchema,
} from "../validators/initiative.validator.js";

import {
  uploadInitiativeImages,
} from "../middlewares/upload.middleware.js";

const router = Router();

/* ================= PUBLIC ================= */

router.get(
  "/initiatives",
  InitiativeController.getPublicInitiatives
);

router.get(
  "/initiatives/featured",
  InitiativeController.getFeaturedInitiatives
);

router.get(
  "/initiatives/categories",
  InitiativeController.getCategories
);

router.get(
  "/initiatives/:slug",
  InitiativeController.getPublicInitiativeBySlug
);

/* ================= ADMIN ================= */

router.get(
  "/admin/initiatives",
  protect,
  requireAdmin,
  InitiativeController.getAdminInitiatives
);

router.get(
  "/admin/initiatives/:id",
  protect,
  requireAdmin,
  InitiativeController.getAdminInitiativeById
);

router.post(
  "/admin/initiatives",
  protect,
  requireAdmin,
  uploadInitiativeImages,
  validate(createInitiativeSchema),
  InitiativeController.createInitiative
);

router.patch(
  "/admin/initiatives/:id",
  protect,
  requireAdmin,
  uploadInitiativeImages,
  validate(updateInitiativeSchema),
  InitiativeController.updateInitiative
);

router.delete(
  "/admin/initiatives/:id",
  protect,
  requireAdmin,
  InitiativeController.deleteInitiative
);

export default router;