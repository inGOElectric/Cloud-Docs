import express from "express";
import multer from "multer";
import {
  uploadJobCardMedia,
  getJobCardMedia,
  getJobCardMediaById,
} from "../controllers/jobCardMediaController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/tmp" });

router.post(
  "/job-cards/:jobCardId/media",
  upload.single("file"),
  uploadJobCardMedia
);

router.get(
  "/job-cards/:jobCardId/media",
  getJobCardMedia
);

router.get(
  "/job-cards/:jobCardId/media/:mediaId",
  getJobCardMediaById
);

export default router;
