import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getAdvisorBookings,
} from "../controllers/serviceAdvisorController.js";

const router = express.Router();

router.use(authenticate);

// 🔐 Only Service Advisor
router.get("/bookings", getAdvisorBookings);

export default router;
