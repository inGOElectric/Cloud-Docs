import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const passwordHash = await bcrypt.hash("customer@123", 10);

  const customer = await prisma.customer.create({
    data: {
      name: "Test Customer",
      mobileNumber: "9999999999", // 👈 use this to login
      passwordHash,
    },
  });

  console.log("✅ Customer created:");
  console.log("📱 Mobile:", customer.mobileNumber);
  console.log("🔑 Password: customer@123");

  process.exit();
}

run();
