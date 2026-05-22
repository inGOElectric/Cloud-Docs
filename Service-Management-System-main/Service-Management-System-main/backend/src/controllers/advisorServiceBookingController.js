import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/* ================================
   ADVISOR: VIEW ALL BOOKINGS (READ ONLY)
================================ */
export const getAdvisorBookings = async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      include: {
        customer: true,
        claimedByProfile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(bookings);
  } catch (error) {
    console.error("Advisor bookings fetch failed:", error);
    return res.status(500).json({
      error: "Failed to fetch bookings",
    });
  }
};

/* ================================
   ADVISOR: BOOKING HISTORY
================================ */
export const getAdvisorBookingHistory = async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      where: {
        status: {
          in: ["CLAIMED", "COMPLETED"],
        },
      },
      include: {
        customer: true,
        claimedByProfile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(bookings);
  } catch (error) {
    console.error("Advisor history fetch failed:", error);
    return res.status(500).json({
      error: "Failed to fetch booking history",
    });
  }
};