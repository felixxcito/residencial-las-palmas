"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { visitorSchema } from "@/lib/validations/visitor.schema";
import type { FormState, ActionResult } from "@/lib/action-types";

export async function checkInVisitorAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireRole(["GUARD", "ADMIN"]);

  const parsed = visitorSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const primaryResident = await prisma.resident.findFirst({
    where: { unitId: parsed.data.unitId, isPrimary: true },
  });

  await prisma.visitor.create({
    data: {
      ...parsed.data,
      hostName: primaryResident?.fullName,
      registeredById: user.id,
    },
  });

  revalidatePath("/guardia/visitas");
  revalidatePath("/admin/visitas");
  redirect("/guardia/visitas");
}

export async function checkOutVisitorAction(visitorId: string): Promise<ActionResult> {
  await requireRole(["GUARD", "ADMIN"]);

  await prisma.visitor.update({ where: { id: visitorId }, data: { checkOutAt: new Date() } });

  revalidatePath("/guardia/visitas");
  revalidatePath("/admin/visitas");
  return { success: true, message: "Salida registrada" };
}
