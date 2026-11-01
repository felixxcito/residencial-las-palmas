import { z } from "zod";

export const residentSchema = z.object({
  unitId: z.string().min(1),
  fullName: z.string().min(1, "El nombre es requerido"),
  email: z.union([z.string().email("Correo inválido"), z.literal("")]).optional(),
  phone: z.string().optional(),
  relation: z.enum(["OWNER", "TENANT"]).default("OWNER"),
  isPrimary: z.coerce.boolean().default(false),
});

export type ResidentInput = z.infer<typeof residentSchema>;
