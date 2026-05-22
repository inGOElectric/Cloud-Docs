import prisma from '../config/database.js';

// Add inspection checklist to a job card
export const addInspection = async (jobCardId, items) => {
  return prisma.vehicleInspection.createMany({
    data: items.map((item) => ({
      jobCardId: Number(jobCardId),
      componentName: item.componentName,
      condition: item.condition,
    })),
  });
};

// Get inspection checklist for a job card
export const getInspectionByJobCard = async (jobCardId) => {
  return prisma.vehicleInspection.findMany({
    where: { jobCardId: Number(jobCardId) },
  });
};
