import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/**
 * GET notification status
 */
export const getAdminNotificationStatus = async (req, res) => {
  try {
    const unreadBookings = await prisma.serviceBooking.count({
      where: { viewedByAdminAt: null },
    });

    const unreadComplaints = await prisma.serviceComplaint.count({
      where: { viewedByAdminAt: null },
    });

    res.json({
      bookings: unreadBookings > 0,
      complaints: unreadComplaints > 0,
    });
  } catch (err) {
    console.error("Admin notification status error:", err);
    res.status(500).json({ message: "Failed to fetch notification status" });
  }
};

/**
 * Mark bookings viewed
 */
export const markBookingsAsViewed = async (req, res) => {
  try {
    await prisma.serviceBooking.updateMany({
      where: { viewedByAdminAt: null },
      data: { viewedByAdminAt: new Date() },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark bookings viewed" });
  }
};

/**
 * Mark complaints viewed
 */
export const markComplaintsAsViewed = async (req, res) => {
  try {
    await prisma.serviceComplaint.updateMany({
      where: { viewedByAdminAt: null },
      data: { viewedByAdminAt: new Date() },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark complaints viewed" });
  }
};
