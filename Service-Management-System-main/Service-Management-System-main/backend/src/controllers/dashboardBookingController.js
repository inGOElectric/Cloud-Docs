import { PrismaClient } from "@prisma/client";
import { createBookingAndJobCard } from "../utils/bookingHelper.js";

const prisma = new PrismaClient();

export const createDashboardBooking = async (req, res) => {
  try {
    console.log("🔐 DASHBOARD FLOW");

    const userId = req.user.id;

    const {
      vehiclePart,
      serviceType,
      preferredDate,
      timeSlot,
      notes,
      vehicleNumber,
    } = req.body;

    let vehicle;

    // If vehicleNumber given
    if (vehicleNumber) {
      vehicle = await prisma.vehicle.findFirst({
        where: {
          OR: [
            { vinNumber: vehicleNumber },
            { registrationNumber: vehicleNumber },
          ],
        },
      });
    }

    // If not → auto pick user's vehicle
    if (!vehicle) {
      vehicle = await prisma.vehicle.findFirst({
        where: { customerId: userId },
      });
    }

    if (!vehicle) {
      return res.status(400).json({
        error: "No vehicle found for this customer",
      });
    }

    const { booking, jobCard } = await createBookingAndJobCard({
      customerId: userId,
      vehicle,
      vehiclePart,
      serviceType,
      preferredDate,
      timeSlot,
      notes,
    });

    return res.status(201).json({
      message: "Booking confirmed",
      bookingId: booking.id,
      jobCardId: jobCard.id,
    });

  } catch (error) {
    console.error("Dashboard booking error:", error);
    return res.status(400).json({
      error: error.message,
    });
  }
};