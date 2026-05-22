import { PrismaClient } from "@prisma/client";
import { sendWhatsAppMessage } from "../utils/sendWhatsApp.js";

const prisma = new PrismaClient();

/* =====================================================
   CREATE SERVICE BOOKING
===================================================== */
export const createServiceBooking = async (req, res) => {
  try {
    let customerId;
    let vehicle; // ✅ FIX: global scope

   /* =====================================================
   1. DASHBOARD FLOW (AUTH)
===================================================== */
if (req.user && req.user.id) {
  console.log("🔐 DASHBOARD FLOW");

  customerId = req.user.id; // ✅ assign (NOT const)

  // ✅ ALWAYS GET VEHICLE
  vehicle = await prisma.vehicle.findFirst({
    where: { customerId },
  });

  if (!vehicle) {
    return res.status(400).json({
      error: "No vehicle found for this customer",
    });
  }
}
    /* =====================================================
       2. WEBSITE BOT (NO PHONE)
    ===================================================== */
    else if (!req.body.mobileNumber && req.body.vehicleNumber) {
      console.log("🌐 WEBSITE BOT FLOW");

      vehicle = await prisma.vehicle.findFirst({
        where: {
          OR: [
            { vinNumber: req.body.vehicleNumber },
            { registrationNumber: req.body.vehicleNumber },
          ],
        },
      });

      if (!vehicle) {
        console.log("❌ VEHICLE NOT FOUND:", req.body.vehicleNumber);
        return res.status(400).json({
          error: "Vehicle not found",
        });
      }

      customerId = vehicle.customerId;
    }

    /* =====================================================
   3. WHATSAPP FLOW 
===================================================== */
else if (req.body.mobileNumber) {
  console.log("📱 WHATSAPP FLOW");

  // You can still keep phone for logging if needed
  const phone = req.body.mobileNumber;
  console.log("USER PHONE:", phone);

  /* ===============================
     🚗 STEP 1: FIND VEHICLE
  =============================== */
  const vehicleInput = String(req.body.vehicleNumber || "").trim();

  if (!vehicleInput) {
    return res.status(400).json({
      error: "Vehicle number is required",
    });
  }

  vehicle = await prisma.vehicle.findFirst({
    where: {
      OR: [
        { vinNumber: vehicleInput },
        { registrationNumber: vehicleInput },
      ],
    },
  });

  if (!vehicle) {
    console.log("❌ VEHICLE NOT FOUND:", vehicleInput);

    return res.status(400).json({
      error: "Vehicle not found. Please use registered vehicle.",
    });
  }

  /* ===============================
     👤 STEP 2: GET CUSTOMER FROM VEHICLE
  =============================== */
  customerId = vehicle.customerId;

  if (!customerId) {
    return res.status(400).json({
      error: "Customer not linked to this vehicle.",
    });
  }

  console.log("✅ VEHICLE FOUND:", vehicle.vinNumber);
  console.log("✅ CUSTOMER ID:", customerId);
}

    /* =====================================================
       VALIDATION
    ===================================================== */
    const { vehiclePart, serviceType, preferredDate, timeSlot, notes } =
      req.body;

    // ✅ DATE PARSE (SAFE)
    const parsedDate = new Date(preferredDate);

    if (isNaN(parsedDate.getTime())) {
      console.log("❌ INVALID DATE:", preferredDate);
      return res.status(400).json({
        error: "Invalid date format",
      });
    }

    if (!vehiclePart || !serviceType || !preferredDate || !timeSlot) {
      return res.status(400).json({
        error: "All required fields must be provided",
      });
    }

if (!vehicle && !req.user) {
  return res.status(400).json({
    error: "Vehicle missing for booking",
  });
}

    /* =====================================================
       SLOT BLOCKING
    ===================================================== */
    const existing = await prisma.serviceBooking.findFirst({
      where: {
        preferredDate: parsedDate,
        timeSlot: timeSlot,
      },
    });

    if (existing) {
      return res.status(400).json({
        error: "This time slot is already booked",
      });
    }

    /* =====================================================
       CREATE BOOKING
    ===================================================== */
    console.log("📦 FINAL BODY:", {
      customerId,
      vehiclePart,
      serviceType,
      parsedDate,
      timeSlot,
    });

    const booking = await prisma.serviceBooking.create({
      data: {
        customerId,
        vehiclePart,
        serviceType,
        preferredDate: parsedDate, // ✅ FIXED
        timeSlot,
        notes: notes || "",
      },
    });

    /* =====================================================
   CREATE JOB CARD
===================================================== */

// ✅ ADD THIS SAFETY CHECK
if (!vehicle || !vehicle.id) {
  console.log("❌ NO VEHICLE FOR JOBCARD:", vehicle);

  return res.status(400).json({
    error: "Vehicle missing for job card creation",
  });
}

const jobCard = await prisma.jobCard.create({
  data: {
    jobCardNumber: `JC-${Date.now()}`,

    customer: {
      connect: { id: booking.customerId },
    },

    vehicle: {
      connect: { id: vehicle.id },
    },

    serviceType: booking.serviceType,
    serviceInDatetime: booking.preferredDate,
    status: "OPEN",
    remarks: booking.notes || "",
  },
});
    /* =====================================================
       WHATSAPP NOTIFICATION
    ===================================================== */
    const customerDetails = await prisma.customer.findUnique({
      where: { id: booking.customerId },
    });

    if (customerDetails?.mobileNumber) {
      await sendWhatsAppMessage(
        `+91${customerDetails.mobileNumber}`,
        `✅ Booking Confirmed!

🧾 Job Card: ${jobCard.jobCardNumber}
🔧 Service: ${booking.serviceType}
📅 Date: ${booking.preferredDate.toDateString()}
⏰ Time: ${booking.timeSlot}

👉 Reply "hi" to manage your booking`
      );
    }

    /* =====================================================
       LINK JOB CARD
    ===================================================== */
    await prisma.serviceBooking.update({
      where: { id: booking.id },
      data: { jobCardId: jobCard.id },
    });

    return res.status(201).json({
      message: "Booking confirmed",
      bookingId: booking.id,
      jobCardId: jobCard.id,
    });

  } catch (error) {
    console.error("🔥 FULL ERROR:", error);

    return res.status(500).json({
      error: error.message || "Failed to create service booking",
    });
  }
};
/* =====================================================
   CUSTOMER BOOKINGS
===================================================== */
export const getMyServiceBookings = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const bookings = await prisma.serviceBooking.findMany({
      where: { customerId: req.user.id },
      include: {
        jobCard: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(bookings);
  } catch (error) {
    console.error("Fetch my bookings error:", error);
    return res.status(500).json({
      error: "Failed to fetch bookings",
    });
  }
};

/* =====================================================
   ADMIN: ALL BOOKINGS
===================================================== */
export const getAllServiceBookings = async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      include: {
        customer: true,
        claimedByProfile: true,
        jobCard: {
  include: {
    workLogs: true
  }
}
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(bookings);
  } catch (error) {
    console.error("Fetch all bookings error:", error);
    return res.status(500).json({
      error: "Failed to fetch service bookings",
    });
  }
};

/* =====================================================
   BOOKING DETAIL
===================================================== */
export const getCustomerBookingDetail = async (req, res) => {
  try {
    const { bookingId } = req.params;
const booking = await prisma.serviceBooking.findUnique({
  where: { id: Number(bookingId) },
  include: {
    jobCard: {
      include: {
        workLogs: true,
        media: true,      
      },
    },
     media: true,
  },
});

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    return res.json(booking);
  } catch (error) {
    console.error("Booking detail error:", error);
    return res.status(500).json({
      message: "Failed to fetch booking detail",
    });
  }
};