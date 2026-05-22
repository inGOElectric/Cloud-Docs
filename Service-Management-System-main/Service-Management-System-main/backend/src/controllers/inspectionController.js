import prisma from "../../prisma/client.js";

export const addInspection = async (req, res) => {
  try {
    const jobCardId = Number(req.params.id);
    const inspections = req.body; // array expected

    if (!Array.isArray(inspections) || inspections.length === 0) {
      return res.status(400).json({ error: "Inspection items required" });
    }

    for (const item of inspections) {
      if (!item.componentName || !item.condition) {
        return res.status(400).json({ error: "Invalid inspection data" });
      }
    }

    await prisma.vehicleInspection.createMany({
      data: inspections.map(i => ({
        jobCardId,
        componentName: i.componentName,
        condition: i.condition, // OK | NOT_OK | DAMAGE
      })),
    });

    res.status(201).json({ message: "Inspection saved" });
  } catch (error) {
    console.error("Inspection save failed:", error);
    res.status(500).json({ error: "Failed to save inspection" });
  }
};

export const getInspection = async (req, res) => {
  try {
    const jobCardId = Number(req.params.id);

    const inspection = await prisma.vehicleInspection.findMany({
      where: { jobCardId },
      orderBy: { createdAt: "asc" },
    });

    res.json(inspection);
  } catch (error) {
    console.error("Inspection fetch failed:", error);
    res.status(500).json({ error: "Failed to load inspection" });
  }
};
