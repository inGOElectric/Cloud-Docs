import express from "express";
import { requireCustomer } from "../middleware/customerAuth.js";
import { createServiceRequest } from "../controllers/serviceRequestController.js";

const router = express.Router();

/* ===============================
   CUSTOMER SERVICE BOOKING
   POST /api/service-bookings
================================ */
router.post("/", requireCustomer, createServiceRequest);

export default router;
