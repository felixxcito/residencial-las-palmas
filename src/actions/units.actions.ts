"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { unitSchema } from "@/lib/validations/unit.schema";
import type { FormState, ActionResult } from "@/lib/action-types";

export async function createUnitAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(["ADMIN"]);

  const parsed = unitSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.unit.findUnique({ where: { code: parsed.data.code } });
  if (existing) {
    return { error: "Ya existe una unidad con ese código" };
  }

  const unit = await prisma.unit.create({ data: parsed.data });

  revalidatePath("/admin/residentes");
  redirect(`/admin/residentes/${unit.id}`);
}

export async function updateUnitAction(
  unitId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(["ADMIN"]);

  const parsed = unitSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.unit.findUnique({ where: { code: parsed.data.code } });
  if (existing && existing.id !== unitId) {
    return { error: "Ya existe una unidad con ese código" };
  }

  await prisma.unit.update({ where: { id: unitId }, data: parsed.data });

  revalidatePath("/admin/residentes");
  revalidatePath(`/admin/residentes/${unitId}`);
  return null;
}

export async function toggleUnitStatusAction(unitId: string): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  const unit = await prisma.unit.findUnique({ where: { id: unitId } });
  if (!unit) {
    return { success: false, message: "Unidad no encontrada" };
  }

  await prisma.unit.update({
    where: { id: unitId },
    data: { status: unit.status === "OCCUPIED" ? "VACANT" : "OCCUPIED" },
  });

  revalidatePath("/admin/residentes");
  revalidatePath(`/admin/residentes/${unitId}`);
  return { success: true, message: "Estado de la unidad actualizado" };
}
