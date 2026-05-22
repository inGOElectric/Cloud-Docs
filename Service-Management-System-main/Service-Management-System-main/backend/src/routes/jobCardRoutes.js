import express from "express";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

import {
  createJobCard,
  createJobCardWithDetails,
  getJobCard,
  updateJobStatus,
  updateJobCard,
  deleteJobCard,
  getJobCardHistoryByCustomer, // ✅ history
} from "../controllers/jobCardController.js";

import {
  addInspection,
  getInspection,
} from "../controllers/inspectionController.js";

import {
  getJobCardMedia,
  uploadJobCardMedia,
  getJobCardMediaById,
} from "../controllers/jobCardMediaController.js";

import {
  getParts,
  saveParts,
} from "../controllers/partsController.js";

import {
  getComplaints,
  createComplaint,
} from "../controllers/complaintController.js";

const prisma = new PrismaClient();
const router = express.Router();

/* ================================
   PUBLIC SEARCH (NO AUTH)
================================ */
router.get("/search", async (req, res) => {
  try {
    const { q = "" } = req.query;

    const where = q.trim()
      ? {
          OR: [
            { jobCardNumber: { contains: q, mode: "insensitive" } },
            { customer: { name: { contains: q, mode: "insensitive" } } },
            { vehicle: { model: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {};

    const jobCards = await prisma.jobCard.findMany({
      where,
      include: {
        customer: true,
        vehicle: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: jobCards });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

/* ================================
   AUTHENTICATION BOUNDARY
================================ */
router.use(authenticate);

/* ================================
   ✅ JOB CARD HISTORY (MUST BE BEFORE :id)
================================ */
router.get(
  "/history/customer/:customerId",
  getJobCardHistoryByCustomer
);

/* ================================
   JOB CARD CRUD
================================ */
router.post("/create-with-details", createJobCardWithDetails);
router.post("/", createJobCard);
router.get("/:id", getJobCard);
router.put("/:id", updateJobCard);
router.patch("/:id/status", updateJobStatus);
router.delete("/:id", deleteJobCard);

/* ================================
   INSPECTION
================================ */
router.get("/:id/inspection", getInspection);
router.post("/:id/inspection", addInspection);

/* ================================
   COMPLAINTS
================================ */
router.get("/:id/complaints", getComplaints);
router.post("/:id/complaints", createComplaint);

/* ================================
   PARTS
================================ */
router.get("/:id/parts", getParts);
router.post("/:id/parts", saveParts);

/* ================================
   MEDIA
================================ */
router.get("/:jobCardId/media", getJobCardMedia);

router.post(
  "/:jobCardId/media",
  upload.single("file"),
  uploadJobCardMedia
);

router.get("/:jobCardId/media/:mediaId", getJobCardMediaById);

export default router;
