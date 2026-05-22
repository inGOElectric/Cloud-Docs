import express from 'express';
import {
  getVehiclesServicedThisMonth,
  getPendingJobCards,
  getWarrantyCases,
  getPartsUsage,
} from '../controllers/reportingController.js';

import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Vehicles serviced this month
router.get(
  '/vehicles-this-month',
  authenticate,
  authorizeRoles('ADMIN'),
  getVehiclesServicedThisMonth
);

// Pending job cards
router.get(
  '/pending',
  authenticate,
  authorizeRoles('ADMIN'),
  getPendingJobCards
);

// Warranty cases
router.get(
  '/warranty',
  authenticate,
  authorizeRoles('ADMIN'),
  getWarrantyCases
);

// Parts usage
router.get(
  '/parts-usage',
  authenticate,
  authorizeRoles('ADMIN'),
  getPartsUsage
);

export default router;
