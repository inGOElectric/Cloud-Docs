import express from "express";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getAdvisorBookings,
  getAdvisorBookingHistory,
} from "../controllers/advisorServiceBookingController.js";

const router = express.Router();

/* ================================
   AUTH + ROLE (READ ONLY)
================================ */
router.use(authenticate, authorizeRoles("SERVICE_ADVISOR"));

/* ================================
   VIEW ALL BOOKINGS
================================ */
router.get("/service-bookings", getAdvisorBookings);

/* ================================
   BOOKING HISTORY
================================ */
router.get("/service-bookings/history", getAdvisorBookingHistory);

export default router;