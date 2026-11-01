import { z } from "zod";

export const reservationSchema = z.object({
  commonAreaId: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().min(1, "Selecciona un horario"),
  notes: z.string().optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
