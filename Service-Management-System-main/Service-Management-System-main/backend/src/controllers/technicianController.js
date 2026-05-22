import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";

/* =========================================================
   GET ALL TECHNICIANS
========================================================= */
export const getTechnicians = async (req, res) => {
  try {
    const technicians = await prisma.technicianProfile.findMany({
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { createdAt: "asc" }
    });

    res.json(technicians);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch technicians" });
  }
};


/* =========================================================
   GET AVAILABLE BOOKINGS (ONLY NEW)
========================================================= */
export const getAvailableBookings = async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      where: {
        status: "NEW",
        claimedByProfileId: null
      },
      include: { customer: true },
      orderBy: { createdAt: "desc" }
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};


/* =========================================================
   GET CLAIMED BOOKINGS (ALL NON-NEW FOR TECH)
========================================================= */
export const getClaimedJobs = async (req, res) => {
  try {
    const { technicianId } = req.params;

    const jobs = await prisma.serviceBooking.findMany({
      where: {
        claimedByProfileId: Number(technicianId),
        status: {
          in: ["CLAIMED", "IN_PROGRESS", "COMPLETED"]
        }
      },
      include: {
        customer: true,
        jobCard: {
          include: {
            workLogs: true,
            media: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch claimed jobs" });
  }
};


/* =========================================================
   CLAIM BOOKING
   NEW → CLAIMED
========================================================= */
export const claimBooking = async (req, res) => {
  try {
    const { id, technicianId } = req.params;

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: Number(id) }
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "NEW")
      return res.status(400).json({ message: "Already claimed" });

    const updated = await prisma.serviceBooking.update({
      where: { id: Number(id) },
      data: {
        claimedByProfileId: Number(technicianId),
        status: "CLAIMED"
      }
    });

    res.json(updated);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to claim booking" });
  }
};


/* =========================================================
   GET BOOKING DETAIL
========================================================= */
export const getBookingDetail = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: Number(bookingId) },
      include: {
        customer: true,
        media: true,
        jobCard: {
          include: {
            workLogs: {
              orderBy: { createdAt: "asc" }
            },
            media: true
          }
        }
      }
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    res.json(booking);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch booking detail" });
  }
};


/* =========================================================
   START WORK
   CLAIMED → IN_PROGRESS
========================================================= */
export const startWork = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { taskName, description } = req.body;

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: Number(bookingId) },
      include: { jobCard: true }
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "CLAIMED")
      return res.status(400).json({ message: "Cannot start work" });

    // ✅ SAFE: only create log if taskName exists
    if (taskName) {
      await prisma.workLog.create({
        data: {
          jobCardId: booking.jobCardId,
          taskName,
          description: description || null,
          technicianName: req.user?.name || "Technician",
          status: "IN_PROGRESS",
          startedAt: new Date()
        }
      });
    }

    // ✅ Update JobCard
    await prisma.jobCard.update({
      where: { id: booking.jobCardId },
      data: { status: "IN_PROGRESS" }
    });

    // ✅ Update Booking
    await prisma.serviceBooking.update({
      where: { id: Number(bookingId) },
      data: { status: "IN_PROGRESS" }
    });

    res.json({ message: "Work started" });

  } catch (error) {
    console.error("START WORK ERROR:", error);
    res.status(500).json({ message: "Failed to start work" });
  }
};

/* =========================================================
   COMPLETE WORK
   IN_PROGRESS → COMPLETED
========================================================= */
export const completeWork = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: Number(bookingId) },
      include: { jobCard: true }
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "IN_PROGRESS")
      return res.status(400).json({ message: "Cannot complete work" });

    // Find active work log
    const activeWork = await prisma.workLog.findFirst({
      where: {
        jobCardId: booking.jobCardId,
        status: "IN_PROGRESS"
      }
    });

    if (activeWork) {
      await prisma.workLog.update({
        where: { id: activeWork.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date()
        }
      });
    }

    // Close job card
    await prisma.jobCard.update({
      where: { id: booking.jobCardId },
      data: { status: "CLOSED" }
    });

    // Update booking
    await prisma.serviceBooking.update({
      where: { id: Number(bookingId) },
      data: { status: "COMPLETED" }
    });

    res.json({ message: "Work completed" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to complete work" });
  }
};
/* =========================================================
   UPLOAD SERVICE BOOKING MEDIA
   Allowed: IN_PROGRESS or COMPLETED
========================================================= */
export const uploadServiceMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: Number(id) }
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (
      booking.status !== "IN_PROGRESS" &&
      booking.status !== "COMPLETED"
    )
      return res.status(400).json({
        message: "Upload not allowed in this status"
      });

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const fileType = req.file.mimetype.startsWith("video")
      ? "video"
      : "image";

    await prisma.serviceBookingMedia.create({
      data: {
        serviceBookingId: Number(id),
        fileUrl: `/${req.file.path.replace(/\\/g, "/")}`,
        fileType,
        uploadedBy: 1 // ⚠ TEMP — we will fix auth check next
      }
    });

    res.json({ message: "Media uploaded successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload media" });
  }
};
/* =========================================================
   DELETE SERVICE MEDIA
========================================================= */
export const deleteServiceMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const media = await prisma.serviceBookingMedia.findUnique({
      where: { id: Number(mediaId) }
    });

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // delete file from disk
    try {
      fs.unlinkSync(media.filePath);
    } catch (err) {
      console.warn("File already missing:", err.message);
    }

    await prisma.serviceBookingMedia.delete({
      where: { id: Number(mediaId) }
    });

    res.json({ message: "Media deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete media" });
  }
};
