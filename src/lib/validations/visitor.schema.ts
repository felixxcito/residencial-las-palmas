import { z } from "zod";

export const visitorSchema = z.object({
  fullName: z.string().min(1, "El nombre es requerido"),
  documentId: z.string().optional(),
  reason: z.string().optional(),
  unitId: z.string().min(1, "Selecciona la unidad a visitar"),
  vehiclePlate: z.string().optional(),
});

export type VisitorInput = z.infer<typeof visitorSchema>;
