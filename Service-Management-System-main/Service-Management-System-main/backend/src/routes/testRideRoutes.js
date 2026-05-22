import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";

import {
  createTestRide,
  getAllTestRides,
  getUnviewedTestRideCount,
  markTestRidesAsViewed,
  updateTestRideStatus,
  getTestRideSlotsRange,
  submitTestRideFeedback,
} from "../controllers/testRideController.js";

const router = express.Router();

/* ================= PUBLIC ================= */

// ✅ ADD THIS LINE (FIX)
router.get("/", getTestRideSlotsRange);

router.get("/slots-range", getTestRideSlotsRange);
router.post("/", createTestRide);
router.post("/feedback", submitTestRideFeedback);

/* ================= PROTECTED ================= */

router.use(authenticate);

router.get("/admin/all", getAllTestRides); // 👈 optional safe change
router.get("/unviewed-count", getUnviewedTestRideCount);
router.put("/mark-viewed", markTestRidesAsViewed);
router.put("/:id/status", updateTestRideStatus);

export default router;