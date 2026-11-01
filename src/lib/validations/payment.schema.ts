import { z } from "zod";

export const paymentSchema = z.object({
  chargeId: z.string().min(1, "Selecciona una cuota"),
  amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
  method: z.enum(["CASH", "TRANSFER", "CHECK", "OTHER"]).default("CASH"),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
