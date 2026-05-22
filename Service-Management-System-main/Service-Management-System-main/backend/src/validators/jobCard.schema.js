import { z } from "zod";

export const createJobCardSchema = z.object({
  jobCardNumber: z.string().optional(),
  serviceType: z.enum(["GENERAL", "COMPLAINT", "BATTERY", "CHARGER"]),
  status: z.literal("OPEN").optional(),
  serviceInDatetime: z.string().datetime(),
  customerData: z.object({
    name: z.string(),
    mobileNumber: z.string(),
  }),
  vehicleData: z.object({
    vinNumber: z.string(),
    model: z.string(),
  }),
  remarks: z.string().optional(),
});
