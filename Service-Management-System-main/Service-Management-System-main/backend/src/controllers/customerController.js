import * as customerService from "../services/customerService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ===============================
   GET /api/customers
   (ADMIN / STAFF)
================================ */
export const getAllCustomers = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const customers = await prisma.customer.findMany({
      skip: Number(offset),
      take: Number(limit),

      select: {
        id: true,
        name: true,
        mobileNumber: true,
        email: true,
        address: true,

        _count: {
          select: {
            vehicles: true,
            jobCards: true,
            serviceBookings: true,
          },
        },
      },
    });

    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   GET /api/customers/:id
================================ */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   GET /api/customers/:id/job-cards
   (ADMIN / STAFF VIEW)
================================ */
export const getCustomerJobCards = async (req, res) => {
  try {
    const customerId = Number(req.params.id);

    const exists = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!exists) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const jobCards = await prisma.jobCard.findMany({
      where: { customerId },
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: jobCards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   GET /api/customers/me/job-cards
   (CUSTOMER DASHBOARD)
================================ */
export const getMyJobCards = async (req, res) => {
  try {
    const customerId = req.user.id;

    const jobCards = await prisma.jobCard.findMany({
      where: { customerId },
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(jobCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load job cards" });
  }
};

/* ===============================
   GET /api/customers/me/vehicles
   (CUSTOMER BOOK SERVICE)
================================ */
export const getMyVehicles = async (req, res) => {
  try {
    const customerId = req.user.id;

    const vehicles = await prisma.vehicle.findMany({
      where: { customerId },
    });

    res.json(vehicles);
  } catch (error) {
    console.error("Failed to fetch customer vehicles:", error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};

/* ===============================
   GET /api/customers/me
   (CUSTOMER PROFILE)
================================ */
export const getMyProfile = async (req, res) => {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        name: true,
        mobileNumber: true,
        email: true,
        address: true,
      },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    res.status(500).json({ error: "Failed to load profile" });
  }
};

/* ===============================
   POST /api/customers
================================ */
export const createCustomer = async (req, res) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   PUT /api/customers/:id
================================ */
export const updateCustomer = async (req, res) => {
  try {
    const updated = await customerService.updateCustomer(
      req.params.id,
      req.body
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   DELETE /api/customers/:id
================================ */
export const deleteCustomer = async (req, res) => {
  try {
    await customerService.deleteCustomer(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};