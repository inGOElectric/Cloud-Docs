import express from "express";
import {
  getAdminNotificationStatus,
  markBookingsAsViewed,
  markComplaintsAsViewed
} from "../controllers/adminNotificationController.js";

const router = express.Router();

// 🔐 authenticate is already applied globally in index.js

// ===============================
// ✅ NEW CORRECT ROUTES (ADDED)
// ===============================

// ✔ This fixes your frontend call
router.get("/status", getAdminNotificationStatus);

router.patch("/bookings/viewed", markBookingsAsViewed);

router.patch("/complaints/viewed", markComplaintsAsViewed);

// ===============================
// ⚠️ OLD ROUTES (KEPT — as you requested)
// ===============================

router.get(
  "/admin/notifications/status",
  getAdminNotificationStatus
);

router.patch(
  "/admin/notifications/bookings/viewed",
  markBookingsAsViewed
);

router.patch(
  "/admin/notifications/complaints/viewed",
  markComplaintsAsViewed
);

export default router;