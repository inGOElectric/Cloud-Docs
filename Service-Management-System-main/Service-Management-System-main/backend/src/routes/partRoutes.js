import express from "express";
import { saveParts, getParts } from "../controllers/partsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /:id/parts
router.get("/:id/parts", authenticate, getParts);

// POST /:id/parts
router.post("/:id/parts", authenticate, saveParts);

export default router;
