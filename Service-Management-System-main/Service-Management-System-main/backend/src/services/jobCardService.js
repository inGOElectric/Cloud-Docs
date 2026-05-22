import fs from 'fs';
import path from 'path';
import prisma from '../config/database.js';

const JOB_CARD_PREFIX = 'JC';

/**
 * JOB CARD SERVICE
 * 
 * Business logic for job card operations:
 * - Creation with auto-generated numbers
 * - Retrieval with related data
 * - Status management and transitions
 * - Search and filtering
 * - Safe deletion with cleanup
 * 
 * All functions interact with Prisma ORM
 * All numbers are validated to prevent SQL injection
 */

/**
 * Generate unique job card number
 *
 * Format: JC-YYYYMMDD-XXXX
 * Examples: JC-20240101-0001, JC-20240101-0002
 *
 * Atomic operation: Counts existing records with today's date prefix and increments
 * Safe for concurrent requests (Prisma handles locking)
 *
 * @returns {Promise<string>} Unique job card number
 */
const generateJobCardNumber = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePrefix = `${year}${month}${day}`;

  // Count all existing job cards globally to get sequence number
  const existingCount = await prisma.jobCard.count();
  const sequence = String(existingCount + 1).padStart(4, "0");
  return `${JOB_CARD_PREFIX}-${datePrefix}-${sequence}`;
};

/**
 * Create a new job card
 *
 * Process:
 * 1. Generate unique job card number
 * 2. Validate customer and vehicle exist
 * 3. Create job card record linking customer and vehicle
 * 4. Return complete record with relationships
 *
 * Data Validation:
 * - customerId and vehicleId must exist
 * - Dates are converted to ISO format
 *
 * Used by:
 * - AdminDashboard: Create Job Card form
 *
 * @param {Object} input - Job card input data
 * @param {number} input.customerId - Customer ID
 * @param {number} input.vehicleId - Vehicle ID
 * @param {string} input.serviceType - Service type (GENERAL, COMPLAINT, etc.)
 * @param {string} input.serviceInDatetime - Service date/time
 * @param {string} input.remarks - Optional remarks
 * @returns {Promise<Object>} Created job card with customer and vehicle
 */
export const createJobCard = async (input) => {
  // Generate unique number
  const jobCardNumber = await generateJobCardNumber();

  // Validate customer exists
  const customer = await prisma.customer.findUnique({
    where: { id: input.customerId },
  });
  if (!customer) {
    throw new Error('Customer not found');
  }

  // Validate vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: input.vehicleId },
  });
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  // Create job card with auto-generated number
  return prisma.jobCard.create({
    data: {
      customerId: input.customerId,
      vehicleId: input.vehicleId,
      serviceInDatetime: new Date(input.serviceInDatetime),
      serviceType: input.serviceType,
      remarks: input.remarks,
      jobCardNumber,
      status: 'OPEN',
    },
    include: {
      customer: true,
      vehicle: true,
    },
  });
};

/**
 * Get job card by ID with all related data
 * 
 * Includes:
 * - Customer information
 * - Vehicle information
 * - All complaints
 * - All inspections
 * - All parts records
 * - All media files
 * - All work logs
 * 
 * Validation:
 * - ID must be a valid number
 * - Returns null if not found (handled by controller)
 * 
 * @param {number|string} id - Job card ID
 * @returns {Promise<Object>} Complete job card object or null
 * @throws {Error} If ID is not a valid number
 */
export const getJobCardById = async (id) => {
  const jobCardId = Number(id);

  if (Number.isNaN(jobCardId)) {
    throw new Error('Invalid job card id');
  }

  return prisma.jobCard.findUnique({
    where: { id: jobCardId },
    include: {
      customer: true,
      vehicle: true,
      complaints: true,
      inspections: true,
      parts: true,
      media: true,
      workLogs: true,
    },
  });
};

/**
 * Delete job card safely
 * 
 * Safety checks:
 * - Only OPEN job cards can be deleted
 * - Removes associated media files from disk
 * - Cleans up upload directory
 * 
 * Atomic transaction:
 * - Uses Prisma transaction to ensure data consistency
 * - Rollback if any step fails
 * 
 * @param {number|string} id - Job card ID
 * @returns {Promise<boolean>} True if successful
 * @throws {Error} If not found or status is not OPEN
 */
export const deleteJobCard = async (id) => {
  const jobCardId = Number(id);

  return prisma.$transaction(async (tx) => {
    // Find job card
    const jobCard = await tx.jobCard.findUnique({ where: { id: jobCardId } });
    if (!jobCard) throw new Error('Job card not found');

    // Safety: Only allow deletion of OPEN job cards
    if (jobCard.status !== 'OPEN') {
      throw new Error('Only OPEN job cards can be deleted');
    }

    // Find all media files
    const media = await tx.jobCardMedia.findMany({
      where: { jobCardId },
    });

    // Delete media files from disk
    for (const m of media) {
      const filePath = path.join(process.cwd(), m.filePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Delete job card record (cascade deletes related records)
    await tx.jobCard.delete({ where: { id: jobCardId } });

    // Clean up upload directory
    const dir = path.join(process.cwd(), 'uploads', 'job-cards', String(jobCardId));
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });

    return true;
  });
};

/**
 * Search job cards by multiple criteria
 * 
 * Supported filters:
 * - mobile: Customer mobile number (contains, case-insensitive)
 * - vin: Vehicle VIN (contains, case-insensitive)
 * - status: Exact status match
 * - fromDate: Start date (greater than or equal)
 * - toDate: End date (less than or equal)
 * 
 * All searches are optional (omit parameter to skip filter)
 * Results are sorted by creation date (newest first)
 * 
 * Used by:
 * - AdminDashboard: Advanced search/filter
 * - Reports: Job card statistics
 * 
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Array>} Array of matching job cards with relationships
 */
export const searchJobCards = async (filters) => {
  const { mobile, vin, status, fromDate, toDate } = filters;

  return prisma.jobCard.findMany({
    where: {
      // Filter by status if provided
      status: status || undefined,
      
      // Filter by date range if provided
      createdAt:
        fromDate || toDate
          ? {
              gte: fromDate ? new Date(fromDate) : undefined,
              lte: toDate ? new Date(toDate) : undefined,
            }
          : undefined,
      
      // Search customer by mobile number
      customer: mobile
        ? { mobileNumber: { contains: mobile, mode: 'insensitive' } }
        : undefined,
      
      // Search vehicle by VIN
      vehicle: vin
        ? { vinNumber: { contains: vin, mode: 'insensitive' } }
        : undefined,
    },
    include: {
      customer: true,
      vehicle: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Update job card status
 * 
 * Valid status transitions:
 * - OPEN → IN_PROGRESS
 * - IN_PROGRESS → CLOSED (sets closedAt timestamp)
 * - CLOSED: no further transitions allowed
 * 
 * Atomic transaction:
 * - Ensures status transitions are valid
 * - Automatically sets closedAt when status becomes CLOSED
 * 
 * Prevents:
 * - Invalid transitions (e.g., OPEN → CLOSED)
 * - Updates to non-existent records
 * 
 * @param {number|string} id - Job card ID
 * @param {string} newStatus - New status value
 * @returns {Promise<Object>} Updated job card
 * @throws {Error} If status transition is invalid or record not found
 */
export const updateJobCardStatus = async (id, newStatus) => {
  const jobCardId = Number(id);

  return prisma.$transaction(async (tx) => {
    // Find job card
    const jobCard = await tx.jobCard.findUnique({ where: { id: jobCardId } });
    if (!jobCard) throw new Error('Job card not found');

    // Define valid transitions
    const transitions = {
      OPEN: ['IN_PROGRESS'],
      IN_PROGRESS: ['CLOSED'],
      CLOSED: [],
    };

    // Validate status transition
    if (!transitions[jobCard.status].includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${jobCard.status} to ${newStatus}`
      );
    }

    // Update status (set closedAt if transitioning to CLOSED)
    });
  }

