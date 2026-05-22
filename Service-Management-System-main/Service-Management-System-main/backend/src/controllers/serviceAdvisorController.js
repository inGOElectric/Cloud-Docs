import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

/* ================================
   SERVICE ADVISOR: VIEW BOOKINGS (WORKLOG FIXED)
================================ */
export const getAdvisorBookings = async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({

      /* ✅ OPTIONAL FILTER (use if needed) */
      // where: {
      //   status: {
      //     in: ["CLAIMED", "IN_PROGRESS", "COMPLETED"],
      //   },
      // },

      include: {
        customer: true,     // already working
        technician: true,   // ✅ FIX: needed for technician column
        jobCard: {
          include: {
            worklog: true,    // ✅ FIX: needed for task + status + timing
          },
        },
      },

      orderBy: {
        createdAt: "desc",  // latest first
      },
    });

    res.json(bookings);

  } catch (err) {
    console.error("Advisor fetch failed:", err);
    res.status(500).json({
      error: "Failed to fetch bookings",
    });
  }
};