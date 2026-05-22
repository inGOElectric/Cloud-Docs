import express from "express";
import {
  getComplaints,
  createComplaint,
  getAllComplaintsAdmin
} from "../controllers/complaintController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADMIN ================= */

router.get(
  "/admin/all",
  authenticate,
  authorizeRoles("ADMIN"),
  getAllComplaintsAdmin // ✅ FIXED
);

/* ================= JOB CARD ================= */

router.get(
  "/:id/complaints",
  authenticate,
  getComplaints
);

router.post(
  "/:id/complaints",
  authenticate,
  authorizeRoles("ADMIN"),
  createComplaint
);

export default router;