import { z } from "zod";

export const chargeSchema = z.object({
  unitId: z.string().min(1, "Selecciona una unidad"),
  concept: z.string().min(1, "El concepto es requerido"),
  amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
  dueDate: z.coerce.date(),
});

export type ChargeInput = z.infer<typeof chargeSchema>;
