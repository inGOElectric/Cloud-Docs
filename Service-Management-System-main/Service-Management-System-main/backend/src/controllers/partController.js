import prisma from "../../prisma/client.js";

export const saveParts = async (req, res) => {
  const { id } = req.params;
  const parts = req.body;

  if (!Array.isArray(parts) || parts.length === 0) {
    return res.status(400).json({ error: "Parts required" });
  }

  for (const part of parts) {
    if (!part.partName || !part.action || part.warrantyApplicable === undefined) {
      return res.status(400).json({ error: "Invalid part data" });
    }
  }

  await prisma.partsReplacement.createMany({
    data: parts.map((p) => ({
      jobCardId: Number(id),
      partName: p.partName,
      partNumber: p.partNumber || null,
      action: p.action,
      warrantyApplicable: p.warrantyApplicable,
    })),
  });

  res.status(201).json({ message: "Parts added" });
};

export const getParts = async (req, res) => {
  const { id } = req.params;

  const parts = await prisma.partsReplacement.findMany({
    where: { jobCardId: Number(id) },
    orderBy: { createdAt: "asc" },
  });

  res.json(parts);
};
