import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const {
      bikeName,
      location,
      date,
      timeSlot,
      fullName,
      phone,
      email,
      address,
    } = req.body;

    const booking = await prisma.testRide.create({
      data: {
        bikeName,
        location,
        date: new Date(date), 
        timeSlot,
        fullName,
        phone,
        email,
        address,
      },
    });

    res.json({ success: true, booking });

  } catch (error) {
    console.error("TEST RIDE ERROR:", error);

    res.status(500).json({
      error: "Failed to create test ride",
      details: error.message, 
    });
  }
});

export default router;