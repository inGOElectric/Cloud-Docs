import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

/* ===============================
   GET ALL VEHICLES (FOR DROPDOWN)
=============================== */
router.get("/", async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return res.json(vehicles);
  } catch (err) {
    console.error("Fetch vehicles error:", err);
    return res.status(500).json({
      message: "Failed to fetch vehicles",
    });
  }
});


/* ===============================
   GET VEHICLE BY VIN / REG NUMBER
   (PUBLIC - USED BY WHATSAPP)
=============================== */
router.get("/:vehicleNumber", async (req, res) => {
  try {
    const clean = String(req.params.vehicleNumber || "").trim();

    if (!clean) {
      return res.status(400).json({
        message: "Vehicle number is required",
      });
    }

    console.log("🔍 VEHICLE LOOKUP INPUT:", clean);

    // Handle numeric VIN like 7 → 007
    let padded = clean;
    if (!isNaN(clean)) {
      padded = clean.padStart(3, "0");
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { vinNumber: clean },
          { vinNumber: padded },
          { registrationNumber: clean },
        ],
      },
    });

    if (!vehicle) {
      console.log("❌ VEHICLE NOT FOUND:", clean);

      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    console.log("✅ VEHICLE FOUND:", vehicle.vinNumber);

    return res.json(vehicle);

  } catch (err) {
    console.error("Vehicle lookup error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;