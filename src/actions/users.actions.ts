"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { createUserSchema, resetPasswordSchema } from "@/lib/validations/user.schema";
import type { FormState, ActionResult } from "@/lib/action-types";

export async function createUserAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(["ADMIN"]);

  const parsed = createUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "Ya existe un usuario con ese correo" };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      role: parsed.data.role,
      passwordHash,
    },
  });

  revalidatePath("/admin/configuracion");
  return null;
}

export async function toggleUserActiveAction(userId: string): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, message: "Usuario no encontrado" };

  await prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });

  revalidatePath("/admin/configuracion");
  return { success: true, message: user.isActive ? "Usuario desactivado" : "Usuario activado" };
}

export async function resetPasswordAction(
  userId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(["ADMIN"]);

  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return null;
}
