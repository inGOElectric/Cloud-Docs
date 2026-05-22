import prisma from "../../prisma/client.js";

export const addComplaint = async (jobCardId, description, category) => {
  return prisma.serviceComplaint.create({
    data: {
      jobCardId: Number(jobCardId),
      description,
      category,
    },
  });
};
