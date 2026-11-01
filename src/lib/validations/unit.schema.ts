import { z } from "zod";
import { optionalNumber } from "./shared";

export const unitSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  building: z.string().optional(),
  floor: optionalNumber(z.coerce.number().int()),
  type: z.string().optional(),
  areaM2: optionalNumber(z.coerce.number().positive()),
  parkingSpots: z.coerce.number().int().min(0).default(0),
  status: z.enum(["OCCUPIED", "VACANT"]).default("OCCUPIED"),
  notes: z.string().optional(),
});

export type UnitInput = z.infer<typeof unitSchema>;
