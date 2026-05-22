import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function run() {

  await prisma.workLog.updateMany({
    where: {
      technicianName: "Technician"
    },
    data: {
      technicianName: "Ragu"   // choose correct technician
    }
  });

  console.log("Technician names updated");

}

run();