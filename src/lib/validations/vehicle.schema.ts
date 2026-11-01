import { z } from "zod";

export const vehicleSchema = z.object({
  unitId: z.string().min(1),
  plate: z.string().min(1, "La placa es requerida"),
  brand: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  parkingSpot: z.string().optional(),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
