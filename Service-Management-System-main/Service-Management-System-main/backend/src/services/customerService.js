import prisma from '../config/database.js';

// Find or create customer by mobile
export const findOrCreateCustomerByMobile = async (data) => {
  if (!data.mobileNumber) {
    throw new Error('mobileNumber is required');
  }

  try {
    const existing = await prisma.customer.findUnique({
      where: { mobileNumber: data.mobileNumber },
      include: { vehicles: true },
    });

    if (existing) return existing;

    return await prisma.customer.create({
      data,
      include: { vehicles: true },
    });
  } catch (error) {
    // Handle race-condition duplicate insert
    if (error.code === 'P2002') {
      return prisma.customer.findUnique({
        where: { mobileNumber: data.mobileNumber },
        include: { vehicles: true },
      });
    }
    throw error;
  }
};

// Get all customers with pagination
export const getAllCustomers = async (limit = 50, offset = 0) => {
  const customers = await prisma.customer.findMany({
    take: parseInt(limit),
    skip: parseInt(offset),
    include: { vehicles: true },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.customer.count();

  return {
    data: customers,
    total,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

// Get customer by ID
export const getCustomerById = async (id) => {
  return prisma.customer.findUnique({
    where: { id: Number(id) },
    include: { vehicles: true },
  });
};

// Create new customer (enforced uniqueness)
export const createCustomer = async (data) => {
  return findOrCreateCustomerByMobile(data);
};

// Update customer (protect mobile uniqueness)
export const updateCustomer = async (id, data) => {
  if (data.mobileNumber) {
    const existing = await prisma.customer.findUnique({
      where: { mobileNumber: data.mobileNumber },
    });

    if (existing && existing.id !== Number(id)) {
      throw new Error('Another customer already uses this mobile number');
    }
  }

  return prisma.customer.update({
    where: { id: Number(id) },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.mobileNumber && { mobileNumber: data.mobileNumber }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.gstNumber !== undefined && { gstNumber: data.gstNumber }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
    include: { vehicles: true },
  });
};

// Delete customer
export const deleteCustomer = async (id) => {
  await prisma.customer.delete({ where: { id: Number(id) } });
  return true;
};
