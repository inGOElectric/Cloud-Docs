import * as serviceJobService from '../services/serviceJobService.js';
import { getImagePath, deleteImageFile } from '../config/multer.js';

// Get all service jobs
export const getAllServiceJobs = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const result = await serviceJobService.getAllServiceJobs(limit, offset);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get service job by ID
export const getServiceJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceJob = await serviceJobService.getServiceJobById(id);
    if (!serviceJob) return res.status(404).json({ error: 'Service job not found' });
    res.status(200).json(serviceJob);
  } catch (error) {
    if (error.message === 'Service job not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get service jobs by vehicle ID (using Prisma relation)
export const getServiceJobsByVehicleId = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const serviceJobs = await serviceJobService.getServiceJobsByVehicleId(vehicleId);
    if (serviceJobs === null) return res.status(404).json({ error: 'Vehicle not found' });
    res.status(200).json(serviceJobs);
  } catch (error) {
    if (error.message === 'Vehicle not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Create new service job (linked to vehicle)
export const createServiceJob = async (req, res) => {
  try {
    const serviceJob = await serviceJobService.createServiceJob(req.body);
    res.status(201).json(serviceJob);
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') return res.status(400).json({ error: error.message });
    if (error.code === 'P2025') return res.status(404).json({ error: error.message });
    if (error.code === 'P2002') return res.status(409).json({ error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// Update service job
export const updateServiceJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedServiceJob = await serviceJobService.updateServiceJob(id, req.body);
    if (!updatedServiceJob) return res.status(404).json({ error: 'Service job not found' });
    res.status(200).json(updatedServiceJob);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: error.message });
    if (error.code === 'P2002') return res.status(409).json({ error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// Delete service job
export const deleteServiceJob = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await serviceJobService.deleteServiceJob(id);
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025' || error.message === 'Service job not found') return res.status(404).json({ error: 'Service job not found' });
    res.status(500).json({ error: error.message });
  }
};

// Add image to service job
export const addImageToServiceJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Get file path relative to project root
    const filePath = getImagePath(req.file.filename);
    
    const serviceImage = await serviceJobService.addImageToServiceJob(id, filePath);
    res.status(201).json(serviceImage);
  } catch (error) {
    // Delete uploaded file if there's an error
    if (req.file) {
      deleteImageFile(req.file.filename);
    }
    
    if (error.message === 'File path is required') {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'Service job not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete image from service job
export const deleteImageFromServiceJob = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const result = await serviceJobService.deleteImageFromServiceJob(id, imageId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Service job not found' || error.message === 'Image not found for this service job') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

