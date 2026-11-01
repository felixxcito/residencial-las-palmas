"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { residentSchema } from "@/lib/validations/resident.schema";
import type { FormState, ActionResult } from "@/lib/action-types";

export async function createResidentAction(
  unitId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(["ADMIN"]);

  const parsed = residentSchema.safeParse({
    ...Object.fromEntries(formData),
    unitId,
    isPrimary: formData.get("isPrimary") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  if (parsed.data.isPrimary) {
    await prisma.resident.updateMany({
      where: { unitId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  await prisma.resident.create({
    data: {
      unitId,
      fullName: parsed.data.fullName,
      email: parsed.data.email || null,
      phone: parsed.data.phone,
      relation: parsed.data.relation,
      isPrimary: parsed.data.isPrimary,
    },
  });

  revalidatePath(`/admin/residentes/${unitId}`);
  revalidatePath("/admin/residentes");
  return null;
}

export async function deleteResidentAction(residentId: string, unitId: string): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  await prisma.resident.delete({ where: { id: residentId } });

  revalidatePath(`/admin/residentes/${unitId}`);
  revalidatePath("/admin/residentes");
  return { success: true, message: "Residente eliminado" };
}
