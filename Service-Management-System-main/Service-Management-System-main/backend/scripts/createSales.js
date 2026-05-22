import pkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function createSales() {
  const email = "sales@test.com";
  const password = "password123";
  const name = "Sales User One";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "SALES",
      active: true,
    },
    create: {
      name,
      email,
      passwordHash,
      role: "SALES",
      active: true,
    },
  });

  console.log("✅ Sales user ready:");
  console.log({ email, password, role: user.role });
}

createSales()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
