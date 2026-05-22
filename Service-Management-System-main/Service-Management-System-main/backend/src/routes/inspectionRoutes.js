import express from "express";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { vehicleInspectionSchema } from "../validators/vehicleInspection.schema.js";

import {
  addInspection,
  getInspection,
} from "../controllers/inspectionController.js";

const router = express.Router();

/**
 * GET /api/job-cards/:id/inspection
 */
router.get(
  "/job-cards/:id/inspection",
  authenticate,
  getInspection
);

/**
 * POST /api/job-cards/:id/inspection
 */
router.post(
  "/job-cards/:id/inspection",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(vehicleInspectionSchema),
  addInspection
);

export default router;
