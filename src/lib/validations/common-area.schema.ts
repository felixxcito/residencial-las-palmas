import { z } from "zod";
import { optionalNumber } from "./shared";

export const commonAreaSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  capacity: optionalNumber(z.coerce.number().int().positive()),
  openTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:MM"),
  closeTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:MM"),
  slotMinutes: z.coerce.number().int().min(15).max(480),
  requiresApproval: z.coerce.boolean().default(false),
});

export type CommonAreaInput = z.infer<typeof commonAreaSchema>;
