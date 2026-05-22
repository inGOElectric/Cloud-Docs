import * as vehicleService from '../services/vehicleService.js';

// Get all vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const result = await vehicleService.getAllVehicles(limit, offset);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.getVehicleById(id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.status(200).json(vehicle);
  } catch (error) {
    if (error.message === 'Vehicle not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get vehicles by customer ID (using Prisma relation)
export const getVehiclesByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const vehicles = await vehicleService.getVehiclesByCustomerId(customerId);
    if (vehicles === null) return res.status(404).json({ error: 'Customer not found' });
    res.status(200).json(vehicles);
  } catch (error) {
    if (error.message === 'Customer not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Create new vehicle (linked to customer)
export const createVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') return res.status(400).json({ error: error.message });
    if (error.code === 'P2025') return res.status(404).json({ error: error.message });
    if (error.code === 'P2002') return res.status(409).json({ error: 'Unique constraint failed' });
    res.status(500).json({ error: error.message });
  }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVehicle = await vehicleService.updateVehicle(id, req.body);
    if (!updatedVehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.status(200).json(updatedVehicle);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: error.message });
    if (error.code === 'P2002') return res.status(409).json({ error: 'Unique constraint failed' });
    res.status(500).json({ error: error.message });
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await vehicleService.deleteVehicle(id);
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025' || error.message === 'Vehicle not found') return res.status(404).json({ error: 'Vehicle not found' });
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: Get vehicle by VIN / Registration
export const getVehicleByNumber = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;

    const vehicle = await vehicleService.getVehicleByNumber(vehicleNumber);

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.status(200).json(vehicle);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};