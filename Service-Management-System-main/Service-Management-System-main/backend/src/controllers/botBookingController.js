import { PrismaClient } from "@prisma/client";
import { createBookingAndJobCard } from "../utils/bookingHelper.js";

const prisma = new PrismaClient();

export const createBotBooking = async (req, res) => {
  try {
    console.log("🌐 WEBSITE BOT FLOW");

    const {
      vehicleNumber,
      vehiclePart,
      serviceType,
      preferredDate,
      timeSlot,
      notes,
    } = req.body;

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { vinNumber: vehicleNumber },
          { registrationNumber: vehicleNumber },
        ],
      },
    });

    if (!vehicle) {
      return res.status(400).json({
        error: "Vehicle not found",
      });
    }

    const { booking, jobCard } = await createBookingAndJobCard({
      customerId: vehicle.customerId,
      vehicle,
      vehiclePart,
      serviceType,
      preferredDate,
      timeSlot,
      notes: notes || "Website Bot",
    });

    return res.status(201).json({
      message: "Booking confirmed",
      bookingId: booking.id,
      jobCardId: jobCard.id,
    });

  } catch (error) {
    console.error("Bot booking error:", error);
    return res.status(400).json({
      error: error.message,
    });
  }
};