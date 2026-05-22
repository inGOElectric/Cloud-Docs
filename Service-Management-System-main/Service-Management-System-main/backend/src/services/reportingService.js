import prisma from '../config/database.js';
// Get total customers count

export const getTotalCustomers = async () => {
  const count = await prisma.customer.count();
  return { totalCustomers: count };
};

// Get total vehicles count
export const getTotalVehicles = async () => {
  const count = await prisma.vehicle.count();
  return { totalVehicles: count };
};

// Get open service jobs (status not "completed" or "closed")
export const getOpenServiceJobs = async () => {
  const openStatuses = ['open', 'in-progress', 'pending', 'active'];
  
  const openJobs = await prisma.serviceJob.findMany({
    where: {
      status: {
        notIn: ['completed', 'closed', 'finished'],
      },
    },
    include: {
      vehicle: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      },
      images: {
        select: {
          id: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    openServiceJobs: openJobs.length,
    jobs: openJobs,
  };
};

// Get revenue summary
// Note: This assumes revenue is calculated based on completed service jobs
// If you have a price/amount field in ServiceJob, update this query accordingly
export const getRevenueSummary = async (startDate, endDate) => {
  // Get all service jobs (completed ones would typically generate revenue)
  const allJobs = await prisma.serviceJob.findMany({
    where: {
      ...(startDate && endDate
        ? {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {}),
    },
    select: {
      id: true,
      jobCardNo: true,
      serviceType: true,
      status: true,
      createdAt: true,
      vehicle: {
        select: {
          id: true,
          model: true,
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // Count by status
  const statusCounts = await prisma.serviceJob.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
    ...(startDate && endDate
      ? {
          where: {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        }
      : {}),
  });

  // Count by service type
  const serviceTypeCounts = await prisma.serviceJob.groupBy({
    by: ['serviceType'],
    _count: {
      id: true,
    },
    ...(startDate && endDate
      ? {
          where: {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        }
      : {}),
  });

  const completedJobs = allJobs.filter((job) => 
    ['completed', 'closed', 'finished'].includes(job.status.toLowerCase())
  );

  return {
    totalJobs: allJobs.length,
    completedJobs: completedJobs.length,
    pendingJobs: allJobs.length - completedJobs.length,
    statusBreakdown: statusCounts.map((item) => ({
      status: item.status,
      count: item._count.id,
    })),
    serviceTypeBreakdown: serviceTypeCounts.map((item) => ({
      serviceType: item.serviceType,
      count: item._count.id,
    })),
    // Note: Actual revenue calculation would require a price/amount field
    // For now, this provides job counts which can be used for revenue estimation
    message: 'Revenue calculation requires price/amount field in ServiceJob model',
  };
};

// Get comprehensive dashboard summary
export const getDashboardSummary = async () => {
  const [totalCustomers, totalVehicles, openJobsData, revenueSummary] = await Promise.all([
    getTotalCustomers(),
    getTotalVehicles(),
    getOpenServiceJobs(),
    getRevenueSummary(),
  ]);

  return {
    ...totalCustomers,
    ...totalVehicles,
    openServiceJobs: openJobsData.openServiceJobs,
    revenue: revenueSummary,
  };
};
export const vehiclesServicedThisMonth = async () => {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  return prisma.jobCard.count({
    where: { createdAt: { gte: start } },
  });
};
export const pendingJobCards = async () => {
  return prisma.jobCard.findMany({
    where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
    include: { customer: true, vehicle: true },
    orderBy: { createdAt: 'asc' },
  });
};
export const warrantyCases = async () => {
  return prisma.jobCard.findMany({
    where: { serviceType: 'WARRANTY' },
    include: { customer: true, vehicle: true },
    orderBy: { createdAt: 'desc' },
  });
};
export const partsUsage = async () => {
  return prisma.partsReplacement.groupBy({
    by: ['partName'],
    _count: { partName: true },
    orderBy: { _count: { partName: 'desc' } },
  });
};



