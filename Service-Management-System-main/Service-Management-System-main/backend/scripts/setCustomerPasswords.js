import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const hash = await bcrypt.hash("customer@123", 10);

  const result = await prisma.customer.updateMany({
    where: {
      passwordHash: null,
    },
    data: {
      passwordHash: hash,
    },
  });

  console.log(`✅ Updated ${result.count} customers`);
  process.exit();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
