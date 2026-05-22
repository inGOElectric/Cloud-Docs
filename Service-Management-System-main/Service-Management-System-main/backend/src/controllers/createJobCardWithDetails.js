import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const createJobCardWithDetails = async (req, res) => {
  try {
    const {
      // NEW MODE fields
      customerName,
      customerPhone,
      vin,
      vehicleModel,

      // EXISTING MODE fields
      customerId,
      vehicleId,

      // COMMON
      serviceType,
      serviceInDatetime,
      remarks,
    } = req.body;

    if (!serviceType) {
      return res.status(400).json({ error: "Service type is required" });
    }

    let finalCustomerId = customerId;
    let finalVehicleId = vehicleId;

    /* ===============================
       NEW CUSTOMER FLOW
    =============================== */
    if (!finalCustomerId) {
      if (!customerName || !customerPhone) {
        return res.status(400).json({
          error: "Customer name and phone are required",
        });
      }

      let customer = await prisma.customer.findUnique({
        where: { mobileNumber: customerPhone },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerName,
            mobileNumber: customerPhone,
          },
        });
      }

      finalCustomerId = customer.id;
    }

    /* ===============================
       NEW VEHICLE FLOW
    =============================== */
    if (!finalVehicleId) {
      if (!vin || !vehicleModel) {
        return res.status(400).json({
          error: "VIN and vehicle model are required",
        });
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          vinNumber: vin,
          model: vehicleModel,
          customerId: finalCustomerId,
        },
      });

      finalVehicleId = vehicle.id;
    }

    /* ===============================
       CREATE JOB CARD
    =============================== */

    // ✅ REQUIRED FIX — generate job card number
    const jobCardNumber = `JC-${Date.now()}`;

    const jobCard = await prisma.jobCard.create({
      data: {
        jobCardNumber, // ✅ FIXED
        customerId: finalCustomerId,
        vehicleId: finalVehicleId,
        serviceType,
        status: "OPEN",
        serviceInDatetime: serviceInDatetime
          ? new Date(serviceInDatetime)
          : null,
        remarks: remarks || null,
      },
    });

    return res.status(201).json(jobCard);
  } catch (error) {
    console.error("createJobCardWithDetails failed:", error);
    return res.status(500).json({
      error: "Failed to create job card",
    });
  }
};
