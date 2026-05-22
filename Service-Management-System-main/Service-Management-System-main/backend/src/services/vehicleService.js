import prisma from '../config/database.js';

// Find or create vehicle by VIN
export const findOrCreateVehicleByVIN = async (data, customerId) => {
  if (!data.vinNumber) {
    throw new Error('vinNumber is required');
  }

  try {
    const existing = await prisma.vehicle.findUnique({
      where: { vinNumber: data.vinNumber },
      include: { customer: true, jobCards: true },
    });

    if (existing) {
      // Prevent linking same VIN to a different customer
      if (existing.customerId !== Number(customerId)) {
        throw new Error('This VIN is already assigned to another customer');
      }
      return existing;
    }

    return await prisma.vehicle.create({
      data: {
        ...data,
        customerId: Number(customerId),
      },
      include: { customer: true, jobCards: true },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return prisma.vehicle.findUnique({
        where: { vinNumber: data.vinNumber },
        include: { customer: true, jobCards: true },
      });
    }
    throw error;
  }
};

// Get all vehicles with pagination
export const getAllVehicles = async (limit = 50, offset = 0) => {
  const vehicles = await prisma.vehicle.findMany({
    take: parseInt(limit),
    skip: parseInt(offset),
    include: { customer: true, jobCards: true },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.vehicle.count();

  return {
    data: vehicles,
    total,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

// Get vehicle by ID
export const getVehicleById = async (id) => {
  return prisma.vehicle.findUnique({
    where: { id: Number(id) },
    include: { customer: true, jobCards: true },
  });
};

// Get vehicles by customer ID
export const getVehiclesByCustomerId = async (customerId) => {
  const customer = await prisma.customer.findUnique({
    where: { id: Number(customerId) },
  });

  if (!customer) return null;

  return prisma.vehicle.findMany({
    where: { customerId: Number(customerId) },
    include: { customer: true, jobCards: true },
    orderBy: { createdAt: 'desc' },
  });
};

// Create new vehicle (uniqueness enforced)
export const createVehicle = async (data) => {
  const { customerId } = data;
  return findOrCreateVehicleByVIN(data, customerId);
};

// Update vehicle (protect VIN uniqueness)
export const updateVehicle = async (id, data) => {
  const existing = await prisma.vehicle.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) return null;

  if (data.vinNumber) {
    const vinOwner = await prisma.vehicle.findUnique({
      where: { vinNumber: data.vinNumber },
    });

    if (vinOwner && vinOwner.id !== Number(id)) {
      throw new Error('Another vehicle already uses this VIN');
    }
  }

  if (data.customerId) {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(data.customerId) },
    });
    if (!customer) throw new Error('Customer not found');
  }

  return prisma.vehicle.update({
    where: { id: Number(id) },
    data: {
      ...(data.vinNumber !== undefined && { vinNumber: data.vinNumber }),
      ...(data.model !== undefined && { model: data.model }),
      ...(data.registrationNumber !== undefined && {
        registrationNumber: data.registrationNumber,
      }),
      ...(data.batchDetails !== undefined && { batchDetails: data.batchDetails }),
      ...(data.batteryNumber !== undefined && { batteryNumber: data.batteryNumber }),
      ...(data.chargerNumber !== undefined && { chargerNumber: data.chargerNumber }),
      ...(data.motorNumber !== undefined && { motorNumber: data.motorNumber }),
      ...(data.warrantyStatus !== undefined && {
        warrantyStatus: data.warrantyStatus,
      }),
      ...(data.customerId !== undefined && {
        customerId: Number(data.customerId),
      }),
    },
    include: { customer: true, jobCards: true },
  });
};

// Delete vehicle
export const deleteVehicle = async (id) => {
  await prisma.vehicle.delete({ where: { id: Number(id) } });
  return true;
};
// ✅ NEW: Get vehicle by VIN / Registration
export const getVehicleByNumber = async (vehicleNumber) => {
  const input = String(vehicleNumber).trim();

  return prisma.vehicle.findFirst({
    where: {
      OR: [
        { vinNumber: input },
        { registrationNumber: input },
      ],
    },
    include: { customer: true, jobCards: true },
  });
};