"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { commonAreaSchema } from "@/lib/validations/common-area.schema";
import type { FormState, ActionResult } from "@/lib/action-types";

export async function createCommonAreaAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(["ADMIN"]);

  const parsed = commonAreaSchema.safeParse({
    ...Object.fromEntries(formData),
    requiresApproval: formData.get("requiresApproval") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.commonArea.create({ data: parsed.data });

  revalidatePath("/admin/areas-comunes");
  redirect("/admin/areas-comunes");
}

export async function toggleCommonAreaActiveAction(areaId: string): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  const area = await prisma.commonArea.findUnique({ where: { id: areaId } });
  if (!area) return { success: false, message: "Área no encontrada" };

  await prisma.commonArea.update({ where: { id: areaId }, data: { isActive: !area.isActive } });

  revalidatePath("/admin/areas-comunes");
  return { success: true, message: area.isActive ? "Área desactivada" : "Área activada" };
}
