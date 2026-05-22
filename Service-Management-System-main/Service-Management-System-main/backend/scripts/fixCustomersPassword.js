import bcrypt from "bcryptjs";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function fixPasswords() {
  const customers = await prisma.customer.findMany({
    where: {
      passwordHash: null,
    },
  });

  if (customers.length === 0) {
    console.log("✅ No customers need password fix");
    return;
  }

  for (const customer of customers) {
    // Default password = customer@123
    const hashedPassword = await bcrypt.hash("customer@123", 10);

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        passwordHash: hashedPassword,
      },
    });

    console.log(`✅ Password fixed for ${customer.mobileNumber}`);
  }

  console.log("🎉 Customer password repair completed");
}

fixPasswords()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
