import express from "express";
import {
  getAllVehicles,
  getVehicleById,
  getVehiclesByCustomerId,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";

const router = express.Router();

// IMPORTANT:
// - DO NOT prefix with "/vehicles"
// - DO NOT add authenticate here (already global)

router.get("/", getAllVehicles);
router.get("/customer/:customerId", getVehiclesByCustomerId);
router.get("/:id", getVehicleById);
router.post("/", createVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
