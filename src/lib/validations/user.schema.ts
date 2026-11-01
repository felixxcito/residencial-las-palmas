import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Correo inválido"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "RESIDENT", "GUARD"]),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});
