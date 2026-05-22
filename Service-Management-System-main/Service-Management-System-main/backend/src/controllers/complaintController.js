import prisma from "../../prisma/client.js";

export const getAllComplaintsAdmin = async (req, res) => {
  try {
    const complaints = await prisma.serviceComplaint.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        jobCard: {
          include: {
            customer: true,
            vehicle: true,
          },
        },
      },
    });

    res.json(complaints);
  } catch (error) {
    console.error("ADMIN FETCH COMPLAINTS ERROR ❌", error);
    res.status(500).json({
      error: "Failed to fetch complaints",
    });
  }
};


export const createComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, category, workType } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const complaint = await prisma.serviceComplaint.create({
      data: {
        jobCardId: Number(id),
        description,
        category,
        workType,
      },
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error("Add complaint failed:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getComplaints = async (req, res) => {
  const { id } = req.params;

  const complaints = await prisma.serviceComplaint.findMany({
    where: { jobCardId: Number(id) },
    orderBy: { createdAt: "asc" },
  });

  res.json(complaints);
};
