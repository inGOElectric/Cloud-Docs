import { z } from "zod";

export const vehicleSchema = z.object({
  vinNumber: z.string().min(5, "VIN number must be at least 5 characters"),
  model: z.string().min(1, "Model is required"),
  registrationNumber: z.string().optional(),
  batchDetails: z.string().optional(),
  batteryNumber: z.string().optional(),
  chargerNumber: z.string().optional(),
  motorNumber: z.string().optional(),
  warrantyStatus: z.string().optional(),
  customerId: z.number().int("Customer ID must be an integer"),
});
