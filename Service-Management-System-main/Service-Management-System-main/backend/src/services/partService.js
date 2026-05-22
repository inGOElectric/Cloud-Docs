import prisma from '../config/database.js';

export const getPartsByJobCard = async (jobCardId) => {
  return await prisma.partReplacement.findMany({
    where: {
      jobCardId: parseInt(jobCardId),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const addParts = async (jobCardId, parts) => {
  return await prisma.partReplacement.createMany({
    data: parts.map(p => ({
      jobCardId: parseInt(jobCardId),
      partName: p.partName,
      partNumber: p.partNumber || null,
      action: p.action,
      warrantyApplicable: p.warrantyApplicable,
    })),
  });
};
