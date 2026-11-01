import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  body: z.string().min(1, "El contenido es requerido"),
  isPinned: z.coerce.boolean().default(false),
  expiresAt: z.string().optional(),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
