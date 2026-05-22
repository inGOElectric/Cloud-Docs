import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/* ================================
   CONSTANTS
================================ */

const ALLOWED_SERVICE_TYPES = [
  "GENERAL",
  "COMPLAINT",
  "BATTERY",
  "CHARGER",
  "PAID_SERVICE_REPAIRABLE",
  "PAID_SERVICE_WARRANTY",
  "SPARES_DISPATCH",
];

function isValidServiceType(value) {
  return ALLOWED_SERVICE_TYPES.includes(value);
}

function parseDateOrFail(value) {
  if (!value) return null;

  const d = new Date(value);
  if (isNaN(d.getTime())) return null;

  return d;
}

/* ================================
   CREATE JOBCARD
================================ */

export const createJobCard = async (req, res) => {
  try {
    const {
      customerId,
      vehicleId,
      serviceType,
      serviceInDatetime,
      odometer,
      batteryVoltage,
      remarks,
    } = req.body;

    if (!customerId || !vehicleId || !serviceType) {
      return res.status(400).json({
        error: "customerId, vehicleId and serviceType are required",
      });
    }

    if (!isValidServiceType(serviceType)) {
      return res.status(400).json({
        error: "Invalid serviceType",
      });
    }

    const parsedDate = parseDateOrFail(serviceInDatetime);

    if (!parsedDate) {
      return res.status(400).json({
        error: "Valid serviceInDatetime is required",
      });
    }

    const jobCard = await prisma.jobCard.create({
      data: {
        jobCardNumber: `JC-${Date.now()}`,
        customerId: Number(customerId),
        vehicleId: Number(vehicleId),
        serviceType,
        status: "OPEN",
        serviceInDatetime: parsedDate,
        odometer: odometer ? Number(odometer) : null,
        batteryVoltage: batteryVoltage ? Number(batteryVoltage) : null,
        remarks: remarks || null,
      },
    });

    return res.status(201).json(jobCard);
  } catch (error) {
    console.error("Create job card failed:", error);
    return res.status(500).json({
      error: "Failed to create job card",
    });
  }
};

/* ================================
   CREATE JOBCARD WITH DETAILS
================================ */

export const createJobCardWithDetails = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      vin,
      vehicleModel,
      registrationNumber,
      batteryNumber,
      motorNumber,
      chargerNumber,
      warrantyStatus,
      serviceType,
      serviceInDatetime,
      odometer,
      batteryVoltage,
      remarks,
    } = req.body;

    if (!isValidServiceType(serviceType)) {
      return res.status(400).json({
        error: "Invalid serviceType",
      });
    }

    const parsedDate = parseDateOrFail(serviceInDatetime);

    if (!parsedDate) {
      return res.status(400).json({
        error: "Valid serviceInDatetime is required",
      });
    }

    const result = await prisma.$transaction(async (tx) => {

      /* ---------- CUSTOMER ---------- */

      let customer = await tx.customer.findUnique({
        where: { mobileNumber: customerPhone },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: customerName,
            mobileNumber: customerPhone,
            email: customerEmail || null,
            address: customerAddress || null,
          },
        });
      }

      /* ---------- VEHICLE ---------- */

      /* ---------- VEHICLE ---------- */

if (!vin || !vehicleModel) {
  throw new Error("VIN and vehicle model are required");
}

let vehicle;

try {
  vehicle = await tx.vehicle.create({
    data: {
      vinNumber: vin,
      model: vehicleModel,
      customerId: customer.id,
      registrationNumber: registrationNumber || null,
      batteryNumber: batteryNumber || null,
      motorNumber: motorNumber || null,
      chargerNumber: chargerNumber || null,
      warrantyStatus: warrantyStatus || null,
    },
  });
} catch (error) {
  // 🔥 HANDLE DUPLICATE VIN PROPERLY
  if (error.code === "P2002") {
    throw new Error("Vehicle with this VIN already exists");
  }
  throw error;
}

      /* ---------- JOBCARD ---------- */

      const jobCard = await tx.jobCard.create({
        data: {
          jobCardNumber: `JC-${Date.now()}`,
          customerId: customer.id,
          vehicleId: vehicle.id,
          serviceType,
          status: "OPEN",
          serviceInDatetime: parsedDate,
          odometer: odometer ? Number(odometer) : null,
          batteryVoltage: batteryVoltage ? Number(batteryVoltage) : null,
          remarks: remarks || null,
        },
      });

      return jobCard;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("createJobCardWithDetails failed:", error);

    return res.status(500).json({
      error: error.message || "Failed to create job card",
    });
  }
};

/* ================================
   GET SINGLE JOBCARD
================================ */

export const getJobCard = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const jobCard = await prisma.jobCard.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        complaints: true,
        inspections: true,
        parts: true,
        workLogs: true,   // correct for schema (technicianName)
        media: true,
      },
    });

    if (!jobCard) {
      return res.status(404).json({
        error: "Job card not found",
      });
    }

    return res.json(jobCard);
  } catch (error) {
    console.error("Fetch job card failed:", error);

    return res.status(500).json({
      error: "Failed to fetch job card",
    });
  }
};

/* ================================
   UPDATE JOBCARD
================================ */

export const updateJobCard = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = { ...req.body };

    const jobCard = await prisma.jobCard.update({
      where: { id },
      data,
    });

    return res.json(jobCard);
  } catch (error) {
    console.error("Update job card failed:", error);

    return res.status(500).json({
      error: "Failed to update job card",
    });
  }
};

/* ================================
   UPDATE STATUS
================================ */

export const updateJobStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const jobCard = await prisma.jobCard.update({
      where: { id },
      data: { status },
    });

    return res.json(jobCard);
  } catch (error) {
    console.error("Update job status failed:", error);

    return res.status(500).json({
      error: "Failed to update job status",
    });
  }
};

/* ================================
   DELETE JOBCARD
================================ */

export const deleteJobCard = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.jobCard.delete({
      where: { id },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Delete job card failed:", error);

    return res.status(500).json({
      error: "Failed to delete job card",
    });
  }
};

/* ================================
   CUSTOMER SERVICE HISTORY
================================ */

export const getJobCardHistoryByCustomer = async (req, res) => {
  try {
    const customerId = Number(req.params.customerId);

    const jobCards = await prisma.jobCard.findMany({
      where: { customerId },
      include: {
        vehicle: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(jobCards);
  } catch (error) {
    console.error("History fetch failed:", error);

    return res.status(500).json({
      error: "Failed to fetch history",
    });
  }
};