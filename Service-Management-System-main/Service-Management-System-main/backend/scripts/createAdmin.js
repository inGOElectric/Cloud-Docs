import pkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function createAdmin() {
  const email = "admin@example.com";
  const password = "admin123";

  // 🔍 Check if admin already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("❌ Admin already exists");
    return;
  }

  // 🔐 Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // ✅ CREATE ADMIN USER (NORMAL ADMIN)
  await prisma.user.create({
    data: {
      name: "Admin",
      email,
      passwordHash,
      role: "ADMIN",
      active: true,
    },
  });

  console.log("✅ ADMIN CREATED SUCCESSFULLY");
  console.log("Email:", email);
  console.log("Password:", password);
}

createAdmin()
  .catch((error) => {
    console.error("❌ Failed to create admin:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
