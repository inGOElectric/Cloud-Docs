import * as reportingService from '../services/reportingService.js';
import { vehiclesServicedThisMonth } from '../services/reportingService.js';
import { pendingJobCards } from '../services/reportingService.js';
import { warrantyCases } from '../services/reportingService.js';
import { partsUsage } from '../services/reportingService.js';


// Get total customers
export const getTotalCustomers = async (req, res) => {
  try {
    const result = await reportingService.getTotalCustomers();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total vehicles
export const getTotalVehicles = async (req, res) => {
  try {
    const result = await reportingService.getTotalVehicles();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get open service jobs
export const getOpenServiceJobs = async (req, res) => {
  try {
    const result = await reportingService.getOpenServiceJobs();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get revenue summary
export const getRevenueSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await reportingService.getRevenueSummary(startDate, endDate);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dashboard summary (all reports combined)
export const getDashboardSummary = async (req, res) => {
  try {
    const result = await reportingService.getDashboardSummary();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVehiclesServicedThisMonth = async (req, res) => {
  const count = await vehiclesServicedThisMonth();
  res.json({ vehiclesThisMonth: count });
};
export const getPendingJobCards = async (req, res) => {
  const data = await pendingJobCards();
  res.json(data);
};
export const getWarrantyCases = async (req, res) => {
  const data = await warrantyCases();
  res.json(data);
};
export const getPartsUsage = async (req, res) => {
  const data = await partsUsage();
  res.json(data);
};
