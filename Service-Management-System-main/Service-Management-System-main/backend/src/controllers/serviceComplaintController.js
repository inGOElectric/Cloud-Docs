import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * CREATE COMPLAINT (CUSTOMER)
 * POST /customers/me/complaints
 */
export const createServiceComplaint = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    const { jobCardId, category, description } = req.body;

    // Validation
    if (!jobCardId || !category || !description) {
      return res.status(400).json({
        message: "jobCardId, category and description are required",
      });
    }

    // Ensure job card belongs to customer
    const jobCard = await prisma.jobCard.findFirst({
      where: {
        id: Number(jobCardId),
        customerId,
      },
    });

    if (!jobCard) {
      return res.status(403).json({
        message: "You are not allowed to raise complaint for this job card",
      });
    }

    // CREATE COMPLAINT (MATCHES PRISMA SCHEMA EXACTLY)
    const complaint = await prisma.serviceComplaint.create({
      data: {
        jobCardId: Number(jobCardId),
        category,              // ComplaintCategory enum
        workType: "COMPLAINT", // WorkType enum (REQUIRED)
        description,
      },
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error("Create complaint failed:", error);
    res.status(500).json({
      message: "Failed to create complaint",
    });
  }
};

/**
 * GET MY COMPLAINTS (CUSTOMER)
 */
export const getMyServiceComplaints = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    const complaints = await prisma.serviceComplaint.findMany({
      where: {
        jobCard: {
          customerId,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(complaints);
  } catch (error) {
    console.error("Fetch complaints failed:", error);
    res.status(500).json({
      message: "Failed to fetch complaints",
    });
  }
};
