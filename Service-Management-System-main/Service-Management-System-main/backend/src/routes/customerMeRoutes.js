import express from "express";
import { getMyJobCards } from "../controllers/customerMeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/job-cards", authMiddleware, getMyJobCards);

export default router;
