import { z } from "zod";

export const vehicleInspectionSchema = z.object({
  brakes: z.enum(["OK", "NOT_OK"]),
  lights: z.enum(["OK", "NOT_OK"]),
  tires: z.enum(["OK", "NOT_OK"]),
  battery: z.enum(["OK", "NOT_OK"]),
  remarks: z.string().optional(),
});
