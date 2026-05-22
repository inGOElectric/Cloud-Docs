import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getMyJobCards = async (req, res) => {
  const customerId = req.user?.id;

  if (!customerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const jobCards = await prisma.jobCard.findMany({
      where: { customerId },
      include: {
        vehicle: {
          select: {
            model: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("WITH VEHICLE:", jobCards);

    res.json(jobCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch job cards" });
  }
};
