import { z } from "zod";

export const vehicleInspectionSchema = z.array(
  z.object({
    componentName: z.string().min(1),
    condition: z.enum(["OK", "NOT_OK", "DAMAGE"]),
  })
);
