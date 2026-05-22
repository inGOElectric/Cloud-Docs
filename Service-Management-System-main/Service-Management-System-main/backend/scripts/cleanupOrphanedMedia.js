import fs from 'fs';
import path from 'path';
import prisma from '../src/config/database.js';

const uploadRoot = path.join(process.cwd(), 'uploads', 'job-cards');

const mediaRecords = await prisma.jobCardMedia.findMany();
const validPaths = new Set(
  mediaRecords.map((m) => m.filePath.replace(/\\/g, '/'))
);

if (!fs.existsSync(uploadRoot)) {
  console.log('No uploads directory found.');
  process.exit(0);
}

for (const jobCardDir of fs.readdirSync(uploadRoot)) {
  const dirPath = path.join(uploadRoot, jobCardDir);

  if (!fs.lstatSync(dirPath).isDirectory()) continue;

  for (const file of fs.readdirSync(dirPath)) {
    const relativePath = path
      .join('uploads', 'job-cards', jobCardDir, file)
      .replace(/\\/g, '/');

    if (!validPaths.has(relativePath)) {
      fs.unlinkSync(path.join(process.cwd(), relativePath));
      console.log('Deleted orphan:', relativePath);
    }
  }
}

console.log('Cleanup complete.');
process.exit(0);
