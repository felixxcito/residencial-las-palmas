import { z } from "zod";

export const settingsSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  address: z.string().optional(),
  currency: z.string().min(1).max(6),
  feeDueDay: z.coerce.number().int().min(1).max(28),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
