"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { settingsSchema } from "@/lib/validations/settings.schema";
import type { FormState } from "@/lib/action-types";

export async function updateSettingsAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(["ADMIN"]);

  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.condoSettings.findFirst();

  if (existing) {
    await prisma.condoSettings.update({ where: { id: existing.id }, data: parsed.data });
  } else {
    await prisma.condoSettings.create({ data: parsed.data });
  }

  revalidatePath("/admin/configuracion");
  revalidatePath("/", "layout");
  return null;
}
