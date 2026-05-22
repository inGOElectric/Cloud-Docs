import { z } from 'zod';

export const searchJobCardsSchema = z.object({
  jobCardNumber: z.string().optional(),
  mobileNumber: z.string().optional(),
  vinNumber: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']).optional(),
  fromDate: z.string().datetime('Invalid ISO datetime format').optional(),
  toDate: z.string().datetime('Invalid ISO datetime format').optional(),
}).strict();
