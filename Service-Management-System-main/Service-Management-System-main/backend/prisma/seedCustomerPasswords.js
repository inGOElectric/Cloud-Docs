// Script to set all existing customers' passwordHash to bcrypt hash of 'customer@123'
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('customer@123', 10);
  const customers = await prisma.customer.findMany();
  for (const customer of customers) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: { passwordHash: hash },
    });
    console.log(`Updated customer ${customer.id} (${customer.mobileNumber})`);
  }
  console.log('All customers updated with default password.');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
