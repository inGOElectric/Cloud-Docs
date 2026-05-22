import express from "express";
import { getAdminDashboardStats } from "../controllers/adminStatsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", authenticate, getAdminDashboardStats);

export default router;
