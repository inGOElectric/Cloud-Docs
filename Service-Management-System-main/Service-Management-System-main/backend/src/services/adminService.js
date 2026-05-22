import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

// Login admin
export const loginAdmin = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
    },
  };
};

// Create admin (for initial setup)
export const createAdmin = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    throw new Error('Admin with this username already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      createdAt: true,
    },
  });

  return admin;
};

// ===============================
// 📊 DASHBOARD STATS SERVICE
// ===============================
export const getDashboardStats = async () => {
  // ===== BASIC COUNTS =====
  const customers = await prisma.customer.count();
  const users = await prisma.user.count();
  const vehicles = await prisma.vehicle.count();
  const serviceBookings = await prisma.serviceBooking.count();
  const jobCards = await prisma.jobCard.count();

  const activeJobCards = await prisma.jobCard.count({
    where: { status: "OPEN" },
  });

  const complaints = await prisma.complaint.count();
  const testRides = await prisma.testRide.count();
  const workLogs = await prisma.workLog.count();
  const inspections = await prisma.inspection.count();
  const partsReplaced = await prisma.partReplacement.count();
  console.log("🔥 SERVICE UPDATED WORKING");

  // ===============================
  // 🔥 FINAL 7-DAY TREND (RELIABLE)
  // ===============================

  const today = new Date();

  // Step 1: create last 7 days (labels)
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    last7Days.push({
      name: d.toLocaleDateString("en-US", { weekday: "short" }),
      bookings: 0,
    });
  }

  // Step 2: fetch bookings using SAFE timestamp filter
  const bookings = await prisma.serviceBooking.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      createdAt: true,
    },
  });

  // Step 3: group bookings by weekday
  bookings.forEach((b) => {
    const dayName = new Date(b.createdAt).toLocaleDateString("en-US", {
      weekday: "short",
    });

    const day = last7Days.find((d) => d.name === dayName);
    if (day) {
      day.bookings++;
    }
  });

  const trends = last7Days;

  return {
    customers,
    users,
    vehicles,
    serviceBookings,
    jobCards,
    activeJobCards,
    complaints,
    testRides,
    workLogs,
    inspections,
    partsReplaced,
    trends,
  };
};