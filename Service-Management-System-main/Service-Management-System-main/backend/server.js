import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import chatRoutes from "./src/routes/chat.js";
import bookingRoutes from "./src/routes/booking.js";
import whatsappRoutes from "./src/routes/whatsapp.js";

// Middleware
import authMiddleware from "./src/middleware/authMiddleware.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= PUBLIC ROUTES ================= */

// ✅ WhatsApp MUST be first and PUBLIC
app.use("/api/whatsapp", whatsappRoutes);

// ✅ Chat (optional public)
app.use("/api/chat", chatRoutes);

/* ================= PROTECTED ROUTES ================= */

// 🔐 Only protect this
app.use("/api/bookings", authMiddleware, bookingRoutes);

/* ================= SERVER ================= */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});