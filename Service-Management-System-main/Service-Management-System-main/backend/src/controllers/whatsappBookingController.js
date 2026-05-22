import { PrismaClient } from "@prisma/client";
import { createBookingAndJobCard } from "../utils/bookingHelper.js";

const prisma = new PrismaClient();

export const createWhatsappBooking = async (req, res) => {
  try {
    console.log("📱 WHATSAPP FLOW");

    const {
      mobileNumber,
      vehicleNumber,
      vehiclePart,
      serviceType,
      preferredDate,
      timeSlot,
      notes,
    } = req.body;

    const customer = await prisma.customer.findFirst({
      where: {
        mobileNumber: {
          contains: mobileNumber.slice(-10),
        },
      },
    });

    if (!customer) {
      return res.status(403).json({
        error: "Customer not registered",
      });
    }

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
      customerId: customer.id,
      vehicle,
      vehiclePart,
      serviceType,
      preferredDate,
      timeSlot,
      notes: notes || "WhatsApp",
    });

    return res.status(201).json({
      message: "Booking confirmed",
      bookingId: booking.id,
      jobCardId: jobCard.id,
    });

  } catch (error) {
    console.error("WhatsApp booking error:", error);
    return res.status(400).json({
      error: error.message,
    });
  }
};