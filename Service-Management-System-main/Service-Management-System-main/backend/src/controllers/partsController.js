import prisma from "../../prisma/client.js";

export const saveParts = async (req, res) => {
  try {
    const jobCardId = Number(req.params.id);
    const parts = req.body;

    if (!Array.isArray(parts) || parts.length === 0) {
      return res.status(400).json({ error: "Parts list required" });
    }

    for (const p of parts) {
      if (!p.partName || !p.action) {
        return res.status(400).json({ error: "Invalid part entry" });
      }
    }

    const created = await prisma.partsReplacement.createMany({
      data: parts.map((p) => ({
        jobCardId,
        partName: p.partName,
        partNumber: p.partNumber || null,
        action: p.action,
        warrantyApplicable: Boolean(p.warrantyApplicable),
      })),
    });

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getParts = async (req, res) => {
  try {
    const jobCardId = Number(req.params.id);

    const parts = await prisma.partsReplacement.findMany({
      where: { jobCardId },
      orderBy: { createdAt: "asc" },
    });

    res.json(parts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
