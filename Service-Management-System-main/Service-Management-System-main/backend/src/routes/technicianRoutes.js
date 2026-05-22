import express from "express";
import prisma from "../config/prisma.js";

import {
  getTechnicians,
  getAvailableBookings,
  getClaimedJobs,
  claimBooking,
  getBookingDetail,
  startWork,
  completeWork,
  uploadServiceMedia,
  deleteServiceMedia
} from "../controllers/technicianController.js";

import { serviceBookingUpload } from "../middleware/serviceBookingUpload.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   🔐 PROTECT ALL ROUTES (TECHNICIAN ONLY)
========================================================= */
router.use(authenticate, authorizeRoles("TECHNICIAN"));

/* =========================================================
   TECHNICIAN LIST
========================================================= */
router.get("/", getTechnicians);

/* =========================================================
   AVAILABLE BOOKINGS (PENDING ONLY)
========================================================= */
router.get("/available", getAvailableBookings);

/* =========================================================
   CLAIMED BOOKINGS
========================================================= */
router.get("/:technicianId/claimed", getClaimedJobs);

/* =========================================================
   TECHNICIAN WORK HISTORY
========================================================= */
router.get("/:technicianId/jobs", async (req, res) => {
  try {
    const technicianId = parseInt(req.params.technicianId);

    const jobs = await prisma.serviceBooking.findMany({
      where: {
        claimedByProfileId: technicianId,
        status: "COMPLETED"
      },
      include: {
        customer: true,
        jobCard: {
          include: {
            vehicle: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const formattedJobs = jobs.map(job => ({
      id: job.id,
      jobCardNumber: job.jobCard?.jobCardNumber || `SB-${job.id}`,
      customer: job.customer?.name || "-",
      vehicle: job.jobCard?.vehicle?.model || job.vehiclePart || "-",
      work: job.serviceType || "-",
      date: job.preferredDate || job.createdAt
    }));

    res.json(formattedJobs);

  } catch (error) {
    console.error("Technician jobs error:", error);
    res.status(500).json({ message: "Failed to load technician jobs" });
  }
});

/* =========================================================
   CLAIM BOOKING
   PENDING → CLAIMED
========================================================= */
router.put("/claim/:id/:technicianId", claimBooking);

/* =========================================================
   BOOKING DETAIL
========================================================= */
router.get("/booking/:bookingId", getBookingDetail);

/* =========================================================
   START WORK
   CLAIMED → IN_PROGRESS
========================================================= */
router.put("/start/:bookingId", startWork);

/* =========================================================
   COMPLETE WORK
   IN_PROGRESS → COMPLETED
========================================================= */
router.put("/complete/:bookingId", completeWork);

/* =========================================================
   UPLOAD SERVICE BOOKING MEDIA
========================================================= */
router.post(
  "/service-bookings/:id/media",
  serviceBookingUpload.single("file"),
  uploadServiceMedia
);

/* =========================================================
   DELETE MEDIA
========================================================= */
router.delete(
  "/service-media/:mediaId",
  deleteServiceMedia
);

export default router;