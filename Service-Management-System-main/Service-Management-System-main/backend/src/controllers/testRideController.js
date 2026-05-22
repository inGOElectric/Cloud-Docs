import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/* =====================================================
   CREATE TEST RIDE
   🔒 ONE SLOT PER LOCATION PER HOUR
===================================================== */
export const createTestRide = async (req, res) => {
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

    // ✅ Required validation
    if (!bikeName || !location || !date || !timeSlot || !fullName || !phone || !email) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    // ✅ Normalize inputs
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();

    // ✅ Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // ==============================
    // ✅ PHONE VALIDATION (STRICT)
    // ==============================

    // STEP 1: Remove everything except digits
    const digits = phone.replace(/\D/g, "");

    // STEP 2: Must be 12 digits total (91 + 10 digits starting 6-9)
    if (!/^91[6-9]\d{9}$/.test(digits)) {
      return res.status(400).json({
        message: "Phone number must be in format +91 98765-43210",
      });
    }

    // STEP 3: Convert to exact display format
    const formattedPhone = `+91 ${digits.slice(2,7)}-${digits.slice(7)}`;

    // ==============================

    const bookingDate = new Date(date);

    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 🔒 Check slot lock
    const existingRide = await prisma.testRide.findFirst({
  where: {
    timeSlot,
    status: "CONFIRMED",
    date: {
      gte: startOfDay,
      lte: endOfDay,
    },
  },
});

if (existingRide) {
  return res.status(400).json({
    message:
      "❌ This time slot is already booked. Please choose another time.",
  });
}

    const newRide = await prisma.testRide.create({
      data: {
        bikeName,
        location,
        date: bookingDate,
        timeSlot,
        fullName: trimmedName,
        phone: formattedPhone, 
        email: normalizedEmail,
        address,
        status: "CONFIRMED",
        isViewed: false,
      },
    });

    return res.status(201).json(newRide);

  } catch (error) {
    console.error("Create Test Ride Error:", error);
    return res.status(500).json({
      message: "Failed to create test ride",
    });
  }
};

/* =====================================================
   SUBMIT FEEDBACK (PHONE OR EMAIL)
   ✅ Prevent duplicate feedback
===================================================== */

export const submitTestRideFeedback = async (req, res) => {
  try {
    const { contact, feedback, rating } = req.body;

    if (!contact || !feedback || !rating) {
      return res.status(400).json({
        message: "Contact, feedback and rating are required",
      });
    }

    if (feedback.trim().length < 3) {
      return res.status(400).json({
        message: "Feedback must be at least 3 characters",
      });
    }

    // ✅ Validate rating
    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const trimmedContact = contact.trim().toLowerCase();
    const normalizedPhone = contact.replace(/\D/g, "");

    const isEmail = trimmedContact.includes("@");

    let ride;

    if (isEmail) {
      ride = await prisma.testRide.findFirst({
        where: {
          email: {
            equals: trimmedContact,
            mode: "insensitive",
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      ride = await prisma.testRide.findFirst({
        where: {
          phone: {
            endsWith: normalizedPhone,
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!ride) {
      return res.status(404).json({
        message: "No test ride found for this contact",
      });
    }

    // 🔒 Prevent duplicate feedback
    if (ride.feedback) {
      return res.status(400).json({
        message: "Feedback already submitted for this test ride",
      });
    }

    const updatedRide = await prisma.testRide.update({
      where: { id: ride.id },
      data: {
        feedback: feedback.trim(),
        rating: numericRating,
      },
    });

    return res.json(updatedRide);

  } catch (error) {
    console.error("Submit Feedback Error:", error);
    return res.status(500).json({
      message: "Failed to submit feedback",
    });
  }
};

/* =====================================================
   GET ALL TEST RIDES (ADMIN)
===================================================== */

export const getAllTestRides = async (req, res) => {
  try {
    const rides = await prisma.testRide.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json(rides);
  } catch (error) {
    console.error("Fetch Test Rides Error:", error);
    return res.status(500).json({
      message: "Failed to fetch test rides",
    });
  }
};

/* =====================================================
   GET UNVIEWED COUNT (ADMIN)
===================================================== */

export const getUnviewedTestRideCount = async (req, res) => {
  try {
    const count = await prisma.testRide.count({
      where: { isViewed: false },
    });

    return res.json({ count });
  } catch (error) {
    console.error("Count Error:", error);
    return res.status(500).json({
      message: "Failed to fetch count",
    });
  }
};

/* =====================================================
   MARK ALL AS VIEWED (ADMIN)
===================================================== */

export const markTestRidesAsViewed = async (req, res) => {
  try {
    await prisma.testRide.updateMany({
      where: { isViewed: false },
      data: { isViewed: true },
    });

    return res.json({ message: "Marked as viewed" });
  } catch (error) {
    console.error("Mark Viewed Error:", error);
    return res.status(500).json({
      message: "Failed to mark viewed",
    });
  }
};

/* =====================================================
   UPDATE STATUS (ADMIN)
===================================================== */

export const updateTestRideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedRide = await prisma.testRide.update({
      where: { id: Number(id) },
      data: { status },
    });

    return res.json(updatedRide);
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};

/* =====================================================
   PUBLIC: GET TEST RIDE SLOTS RANGE
===================================================== */

const isBlockedSaturday = (date) => {
  if (date.getDay() !== 6) return false;
  const weekNumber = Math.ceil(date.getDate() / 7);
  return weekNumber === 2 || weekNumber === 4;
};

export const getTestRideSlotsRange = async (req, res) => {
  try {
    const slots = ["11:00 AM", "12:00 PM", "1:00 PM"];

    const bookings = await prisma.testRide.findMany({
  where: {
    status: "CONFIRMED",
  },
  select: {
    date: true,
    timeSlot: true,
  },
});

    const bookedMap = {};

    bookings.forEach((b) => {
      const formattedDate = new Date(b.date).toISOString().split("T")[0];
      const key = `${formattedDate}-${b.timeSlot.trim()}`;
      bookedMap[key] = true;
    });

    const result = [];

    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 2); // 🔥 2 months range

    let current = new Date(today);

    while (current <= endDate) {
      const day = current.getDay(); // 0 = Sunday, 6 = Saturday

      // ❌ Skip Sundays
      if (day === 0) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      // ❌ Skip 2nd & 4th Saturday
      if (day === 6) {
        const date = current.getDate();
        const weekOfMonth = Math.ceil(date / 7);

        if (weekOfMonth === 2 || weekOfMonth === 4) {
          current.setDate(current.getDate() + 1);
          continue;
        }
      }

      const formattedDate = current.toISOString().split("T")[0];

      const daySlots = slots.map((slot) => ({
        time: slot,
        isBooked: !!bookedMap[`${formattedDate}-${slot}`],
      }));

      result.push({
        date: formattedDate,
        slots: daySlots,
      });

      current.setDate(current.getDate() + 1);
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching slots" });
  }
};