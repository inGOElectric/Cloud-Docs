import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = process.argv[2] || "admin@example.com";
    const password = process.argv[3] || "admin123";

    console.log("Creating admin user...");
    console.log(`Email: ${email}`);

    // Remove existing admin with same email (safe reset)
    await prisma.user.deleteMany({
      where: {
        email,
        role: "ADMIN",
      },
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email,
        passwordHash,
        role: "ADMIN",
        active: true,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    console.log("\n✅ Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Password:", password);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
