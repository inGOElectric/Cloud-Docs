import client from "./client";

/**
 * Job Cards API Client
 * 
 * Handles all job card operations:
 * - Create job cards (admin and customer)
 * - Retrieve job card details
 * - Search and filter job cards
 * 
 * Used by:
 * - AdminDashboard: search, create, filter
 * - CustomerDashboard: search, create
 * - JobCardDetail: retrieve specific card
 */

/**
 * Create a new job card
 * 
 * POST /job-cards
 * Requires: JWT token
 * Allowed roles: ADMIN, CUSTOMER
 * 
 * @param {Object} payload - Job card data
 * @returns {Promise} Created job card with generated ID and number
 */
export const createJobCard = (payload) => {
  return client.post("/job-cards", payload);
};

/**
 * Get job card details by ID
 * 
 * GET /job-cards/:id
 * Requires: JWT token
 * 
 * @param {number} id - Job card ID
 * @returns {Promise} Job card with all related data (customer, vehicle, inspections, etc.)
 */
export const getJobCard = (id) => {
  return client.get(`/job-cards/${id}`);
};

/**
 * Search and filter job cards
 * 
 * GET /job-cards/search?q={query}
 * Supported search fields:
 * - Job card number (e.g., "JC-000001")
 * - Customer name
 * - Vehicle model
 * 
 * No role restriction for read-only search
 * 
 * @param {string} q - Search query term
 * @returns {Promise} List of matching job cards with customer and vehicle data
 */
export const searchJobCards = (q = "") => {
  return client.get("/job-cards/search", { params: { q } });
};
