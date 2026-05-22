import pkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function createSupplyChain() {
  const email = "supply@test.com";
  const password = "password123";
  const name = "Supply Chain User";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "SUPPLY_CHAIN",
      active: true,
    },
    create: {
      name,
      email,
      passwordHash,
      role: "SUPPLY_CHAIN",
      active: true,
    },
  });

  console.log("✅ Supply Chain user ready:");
  console.log({ email, password, role: user.role });
}

createSupplyChain()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
