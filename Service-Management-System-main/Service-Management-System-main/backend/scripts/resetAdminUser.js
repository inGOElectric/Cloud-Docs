import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function reset() {
  const email = 'admin@service.com';
  const newPassword = 'local@123';

  try {
    console.log(`Looking up user with email: ${email}`);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashed },
    });

    console.log(`Password for ${email} has been reset to '${newPassword}'`);
  } catch (err) {
    console.error('Error resetting admin password:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

reset();
