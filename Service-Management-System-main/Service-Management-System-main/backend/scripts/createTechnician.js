import pkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function createTechnician() {
  const email = "technician@test.com";
  const password = "password123";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: "Technician One",
      email,
      passwordHash,
      role: "TECHNICIAN",
      active: true,
    },
  });

  console.log("✅ Staff user created:");
  console.log({
    email: user.email,
    role: user.role,
    password: password,
  });
}

createTechnician()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
