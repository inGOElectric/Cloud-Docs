import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAdminDashboardStats = async (req, res) => {
  try {
    // ===============================
    // 📊 BASIC COUNTS
    // ===============================
    const [
      customers,
      users,
      vehicles,
      jobCards,
      serviceBookings,
      complaints,
      testRides,
      workLogs,
      inspections,
      partsReplaced,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.user.count(),
      prisma.vehicle.count(),
      prisma.jobCard.count(),
      prisma.serviceBooking.count(),
      prisma.serviceComplaint.count(),
      prisma.testRide.count(),
      prisma.workLog.count(),
      prisma.vehicleInspection.count(),
      prisma.partsReplacement.count(),
    ]);

    const activeJobCards = await prisma.jobCard.count({
      where: {
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
    });

    // ===============================
    // 🧠 BUSINESS DAY RULES
    // ===============================

    const isSunday = (d) => d.getDay() === 0;

    const isSaturday = (d) => d.getDay() === 6;

    const getWeekOfMonth = (d) => {
      const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
      return Math.ceil((d.getDate() + firstDay) / 7);
    };

    const isBlockedSaturday = (d) => {
  if (d.getDay() !== 6) return false;

  const date = d.getDate();

  // 2nd Saturday → 8–14
  // 4th Saturday → 22–28
  return (
    (date >= 8 && date <= 14) ||
    (date >= 22 && date <= 28)
  );
};
    const isWorkingDay = (d) => {
      return !isSunday(d) && !isBlockedSaturday(d);
    };

    // ===============================
    // 📅 CURRENT WEEK (MON → SAT ONLY)
    // ===============================

    const today = new Date();

    const day = today.getDay(); // 0=Sun
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const workingDays = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      if (!isWorkingDay(d)) continue;

      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

      workingDays.push({
        date: key,
        name: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        service: 0,
        testRide: 0,
      });
    }

    // ===============================
    // 📅 RANGE FOR QUERY
    // ===============================

    const startDate = new Date(workingDays[0].date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(
      workingDays[workingDays.length - 1].date
    );
    endDate.setHours(23, 59, 59, 999);

    // ===============================
    // 📥 FETCH DATA (CORRECT FIELDS)
    // ===============================

    const [serviceData, testRideData] = await Promise.all([
      prisma.serviceBooking.findMany({
        where: {
          preferredDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: { preferredDate: true },
      }),

      prisma.testRide.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: { date: true },
      }),
    ]);

    // ===============================
    // 🔑 SAFE DATE KEY FUNCTION
    // ===============================

    const toKey = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    };

    // ===============================
    // 🔁 MAP SERVICE BOOKINGS
    // ===============================

    serviceData.forEach((b) => {
      const key = toKey(b.preferredDate);

      const day = workingDays.find((d) => d.date === key);

      if (day) {
        day.service += 1;
      }
    });

    // ===============================
    // 🔁 MAP TEST RIDES
    // ===============================

    testRideData.forEach((b) => {
      const key = toKey(b.date);

      const day = workingDays.find((d) => d.date === key);

      if (day) {
        day.testRide += 1;
      }
    });

    // ===============================
    // 🎯 FINAL RESPONSE
    // ===============================

    const trends = workingDays.map(({ name, service, testRide }) => ({
      name,
      service,
      testRide,
    }));

    // ===============================
// 📅 TODAY RANGE (LOCAL SAFE)
// ===============================
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

// ===============================
// 📥 TODAY BOOKINGS
// ===============================
const [todayService, todayTestRide] = await Promise.all([
  prisma.serviceBooking.findMany({
    where: {
      preferredDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    select: {
      id: true,
      vehiclePart: true,
      timeSlot: true,
      status: true,
    },
  }),

  prisma.testRide.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    select: {
      id: true,
      bikeName: true,
      timeSlot: true,
      fullName: true,
    },
  }),
]);

// ===============================
// 👨‍🔧 TECHNICIAN PERFORMANCE (MONTHLY)
// ===============================

// 1. Get start of current month (LOCAL SAFE)
const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
startOfMonth.setHours(0, 0, 0, 0);

// 2. Get technicians + their completed jobs THIS MONTH
const technicians = await prisma.technicianProfile.findMany({
  where: { active: true },
  select: {
    id: true,
    name: true,
    serviceBookings: {
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: startOfMonth,
        },
      },
    },
  },
});

// 3. Total completed this month
const totalCompleted = technicians.reduce(
  (sum, tech) => sum + tech.serviceBookings.length,
  0
);

// 4. Build performance data
const technicianPerformance = technicians.map((tech) => {
  const completed = tech.serviceBookings.length;

  const percentage =
    totalCompleted === 0
      ? 0
      : Math.round((completed / totalCompleted) * 100);

  return {
    id: tech.id,
    name: tech.name,
    completed,
    percentage,
    status:
      percentage >= 30
        ? "HIGH"
        : percentage >= 15
        ? "NORMAL"
        : "LOW",
  };
});
    // ===============================
    // 🚀 RESPONSE
    // ===============================

    res.json({
      customers,
      users,
      vehicles,
      jobCards,
      activeJobCards,
      serviceBookings,
      complaints,
      testRides,
      workLogs,
      inspections,
      partsReplaced,
      trends,
      todayService,
      todayTestRide,
      technicianPerformance,
    });

  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      error: "Failed to load dashboard stats",
    });
  }
};