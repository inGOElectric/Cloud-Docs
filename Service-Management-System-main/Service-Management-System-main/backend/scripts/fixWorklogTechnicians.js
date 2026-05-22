import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function run() {

  await prisma.workLog.update({ where: { id: 2 }, data: { technicianName: "Rahul" }});
  await prisma.workLog.update({ where: { id: 3 }, data: { technicianName: "Balu" }});
  await prisma.workLog.update({ where: { id: 4 }, data: { technicianName: "Ramajayam" }});
  await prisma.workLog.update({ where: { id: 5 }, data: { technicianName: "Ragu" }});
  await prisma.workLog.update({ where: { id: 6 }, data: { technicianName: "Ramajayam" }});
  await prisma.workLog.update({ where: { id: 7 }, data: { technicianName: "Imran Pasha" }});
  await prisma.workLog.update({ where: { id: 8 }, data: { technicianName: "Balu" }});
  await prisma.workLog.update({ where: { id: 9 }, data: { technicianName: "Ragu" }});
  await prisma.workLog.update({ where: { id: 10 }, data: { technicianName: "Ramajayam" }});

  console.log("WorkLog technicians updated successfully");

}

run();