import pkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function createServiceAdvisor() {
  const email = "advisor@test.com";
  const password = "password123";
  const name = "Service Advisor One";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "SERVICE_ADVISOR",
      active: true,
    },
    create: {
      name,
      email,
      passwordHash,
      role: "SERVICE_ADVISOR",
      active: true,
    },
  });

  console.log("✅ Service Advisor ready:");
  console.log({ email, password, role: user.role });
}

createServiceAdvisor()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
