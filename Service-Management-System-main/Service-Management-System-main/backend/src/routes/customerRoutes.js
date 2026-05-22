import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  getCustomerJobCards,
  getMyJobCards,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getMyVehicles,
  getMyProfile,
} from "../controllers/customerController.js";

import {
  createServiceComplaint,
  getMyServiceComplaints,
} from "../controllers/serviceComplaintController.js";

import { getMyServiceBookings } from "../controllers/serviceBookingController.js";

import { requireCustomer } from "../middleware/customerAuth.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   CUSTOMER SELF ROUTES
   (Logged-in customer dashboard)
========================================================= */

// Customer profile
router.get("/me", authenticate, getMyProfile);

// Customer vehicles
router.get("/me/vehicles", requireCustomer, getMyVehicles);

// Customer job cards
router.get("/me/job-cards", requireCustomer, getMyJobCards);

// Customer service bookings
router.get("/me/service-bookings", requireCustomer, getMyServiceBookings);

// Customer complaints
router.post("/me/complaints", requireCustomer, createServiceComplaint);
router.get("/me/complaints", requireCustomer, getMyServiceComplaints);

/* =========================================================
   ADMIN / STAFF ROUTES
========================================================= */

// Get all customers
router.get("/", getAllCustomers);

// Get customer by ID
router.get("/:id", getCustomerById);

// Get customer job cards
router.get("/:id/job-cards", getCustomerJobCards);

// Create new customer
router.post("/", createCustomer);

// Update customer
router.put("/:id", updateCustomer);

// Delete customer
router.delete("/:id", deleteCustomer);

export default router;