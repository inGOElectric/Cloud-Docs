import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  // ===============================
  // 1️⃣ ADMIN USER (SAFE UPSERT)
  // ===============================
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      passwordHash,
      role: "ADMIN",
      active: true
    }
  });

  console.log("✅ Admin ready (admin@example.com / admin123)");

  // ===============================
  // 2️⃣ TECHNICIAN PROFILES
  // (NO LOGIN, NO PASSWORD)
  // ===============================
  const technicians = [
    "Ramajayam",
    "Rahul",
    "Balu",
    "Ragu",
    "Imran Pasha"
  ];

  for (const name of technicians) {
    await prisma.technicianProfile.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  console.log("✅ Technician profiles created");
  console.log("🌱 Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
