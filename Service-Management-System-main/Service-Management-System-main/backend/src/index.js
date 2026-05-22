import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { config } from "./config/env.js";

// ===============================
// ROUTES
// ===============================
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import jobCardRoutes from "./routes/jobCardRoutes.js";
import inspectionRoutes from "./routes/inspectionRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import partRoutes from "./routes/partRoutes.js";
import reportingRoutes from "./routes/reportingRoutes.js";
import workLogRoutes from "./routes/workLogRoutes.js";

import customerAuthRoutes from "./routes/customerAuthRoutes.js";
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";
import serviceBookingRoutes from "./routes/serviceBookingRoutes.js";
import adminComplaintRoutes from "./routes/adminComplaintRoutes.js";
import adminNotificationRoutes from "./routes/adminNotificationRoutes.js";
import advisorServiceBookingRoutes from "./routes/advisorServiceBookingRoutes.js";
import serviceAdvisorRoutes from "./routes/serviceAdvisorRoutes.js";
import testRideRoutes from "./routes/testRideRoutes.js";
import adminStatsRoutes from "./routes/adminStatsRoutes.js";
import technicianRoutes from "./routes/technicianRoutes.js";
import chatRoute from "./routes/chat.js";
import publicServiceBookingRoutes from "./routes/publicServiceBookingRoutes.js";
import publicTestRideRoutes from "./routes/public/testRide.js";
import vehicleRoutes from "./routes/vehicle.routes.js";

// ✅ ADDED (WHATSAPP)
import whatsappRoutes from "./routes/whatsapp.js";

// ===============================
// MIDDLEWARE
// ===============================
import { prismaMiddleware } from "./middleware/prismaMiddleware.js";
import { authenticate } from "./middleware/authMiddleware.js";
// ===============================
// ES MODULE HELPERS
// ===============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// APP INIT
// ===============================
const app = express();

app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// ===============================
// PRISMA CONTEXT
// ===============================
app.use(prismaMiddleware);

// ===============================
// STATIC FILES
// ===============================
app.use("/uploads", express.static("uploads"));

/// ===============================
// PUBLIC ROUTES (NO AUTH)
// ===============================
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/api/auth/customer", customerAuthRoutes);

// ✅ USE THIS (NEW PUBLIC ROUTE)
app.use("/api/public/service-bookings", publicServiceBookingRoutes);
app.use("/api/public/test-rides", publicTestRideRoutes);

// Test Ride + Chat
app.use("/api/test-rides", testRideRoutes);
app.use("/api/chat", chatRoute);

// public Vehicles
app.use("/api/public/vehicles", vehicleRoutes);

// ✅ WHATSAPP (PUBLIC)
app.use("/api/whatsapp", whatsappRoutes);

// Notifications
app.use("/api/notifications", adminNotificationRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);
// ===============================
// AUTHENTICATION BOUNDARY
// ===============================
app.use(authenticate);

// ===============================
// PROTECTED ADMIN ROUTES
// ===============================
app.use("/api/admin", adminStatsRoutes);

// ===============================
// PROTECTED DOMAIN ROUTES
// ===============================

// Customers & Vehicles
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Job Cards
app.use("/api/job-cards", jobCardRoutes);
app.use("/api/job-cards", inspectionRoutes);
app.use("/api/job-cards", complaintRoutes);
app.use("/api/job-cards", partRoutes);

// Work Logs
app.use("/api/work-logs", workLogRoutes);

// Reports
app.use("/api/reports", reportingRoutes);

// Service
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/service-bookings", serviceBookingRoutes);

// ===============================
// SERVICE ADVISOR
// ===============================
app.use("/api/service-advisor", serviceAdvisorRoutes);
app.use("/api/advisor", advisorServiceBookingRoutes);

// ===============================
// TECHNICIAN
// ===============================
app.use("/api/technicians", technicianRoutes);

// ===============================
// ADMIN COMPLAINTS
// ===============================
app.use("/api/complaints", adminComplaintRoutes);
app.use("/api/admin/complaints", adminComplaintRoutes);

// ===============================
// SERVER STARTUP
// ===============================
const PORT = config.port || 4000;

app
  .listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} already in use.`);
      process.exit(1);
    } else {
      console.error("❌ Server error:", err);
      process.exit(1);
    }
  });