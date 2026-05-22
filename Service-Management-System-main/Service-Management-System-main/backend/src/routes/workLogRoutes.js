import express from "express";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  createWorkLog,
  startWorkLog,
  completeWorkLog,
  getWorkLogsByJobCard,
} from "../controllers/workLogController.js";

const router = express.Router();

/**
 * GET /api/job-cards/:id/work-log
 * Used by ADMIN to view all logs of a job card
 */
router.get(
  "/job-cards/:id/work-log",
  authenticate,
  authorizeRoles("ADMIN"),
  getWorkLogsByJobCard
);

/**
 * POST /api/job-cards/:id/work-log
 * Used by TECHNICIAN to start work
 */
router.post(
  "/job-cards/:id/work-log",
  authenticate,
  authorizeRoles("TECHNICIAN", "ADMIN"), // ✅ FIXED
  createWorkLog
);

/**
 * PATCH /api/work-log/:id/start
 * (Optional - if you use separate start logic)
 */
router.patch(
  "/work-log/:id/start",
  authenticate,
  authorizeRoles("TECHNICIAN", "ADMIN"), // ✅ FIXED
  startWorkLog
);

/**
 * PATCH /api/work-log/:id/complete
 * Used by TECHNICIAN to complete task
 */
router.patch(
  "/work-log/:id/complete",
  authenticate,
  authorizeRoles("TECHNICIAN", "ADMIN"), // ✅ FIXED
  completeWorkLog
);

export default router;