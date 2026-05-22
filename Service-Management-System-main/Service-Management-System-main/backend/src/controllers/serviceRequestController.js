import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const createServiceRequest = async (req, res) => {
  try {
    const {
      customerId,
      vehicleId,
      serviceType,
      preferredDate,
      timeSlot,
      notes,
    } = req.body;

    if (!customerId || !vehicleId || !serviceType || !preferredDate || !timeSlot) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const request = await prisma.serviceRequest.create({
      data: {
        customerId,
        vehicleId,
        serviceType,
        preferredDate: new Date(preferredDate),
        timeSlot,
        notes,
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error("Service request failed:", error);
    res.status(500).json({ error: "Failed to create service request" });
  }
};
