import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function resetAdmin() {
  try {
    console.log('=== Reset Admin User (Only One Admin) ===\n');

    // Check existing admins
    const existingAdmins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    if (existingAdmins.length > 0) {
      console.log('Existing admins found:');
      existingAdmins.forEach((admin) => {
        console.log(`  - ID: ${admin.id}, Username: ${admin.username}, Created: ${admin.createdAt}`);
      });
      console.log('\n⚠️  All existing admins will be deleted!\n');
      
      const confirm = await question('Are you sure you want to delete all admins and create a new one? (yes/no): ');
      if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
        console.log('\n❌ Operation cancelled.');
        rl.close();
        await prisma.$disconnect();
        process.exit(0);
      }

      // Delete all existing admins
      const deleteResult = await prisma.admin.deleteMany({});
      console.log(`\n✅ Deleted ${deleteResult.count} admin(s).\n`);
    }

    const username = await question('Enter new admin username: ');
    if (!username || username.trim() === '') {
      console.error('Username is required!');
      rl.close();
      process.exit(1);
    }

    const password = await question('Enter new admin password: ');
    if (!password || password.trim() === '') {
      console.error('Password is required!');
      rl.close();
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await prisma.admin.create({
      data: {
        username: username.trim(),
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('\nAdmin Details:');
    console.log(`  ID: ${admin.id}`);
    console.log(`  Username: ${admin.username}`);
    console.log(`  Created At: ${admin.createdAt}`);
    console.log('\nYou can now login using:');
    console.log(`  POST /api/admin/login`);
    console.log(`  Body: { "username": "${admin.username}", "password": "your-password" }`);

  } catch (error) {
    console.error('\n❌ Error resetting admin:');
    console.error(`   ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

resetAdmin();

