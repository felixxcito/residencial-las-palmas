"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { chargeSchema } from "@/lib/validations/fee.schema";
import type { FormState, ActionResult } from "@/lib/action-types";

function periodFromDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function createChargeAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(["ADMIN"]);

  const raw = Object.fromEntries(formData);
  const parsed = chargeSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const amountCents = Math.round(parsed.data.amount * 100);
  const period = periodFromDate(parsed.data.dueDate);

  if (parsed.data.unitId === "ALL") {
    const units = await prisma.unit.findMany({
      where: { status: "OCCUPIED" },
      select: { id: true },
    });

    await prisma.charge.createMany({
      data: units.map((u) => ({
        unitId: u.id,
        concept: parsed.data.concept,
        amountCents,
        period,
        dueDate: parsed.data.dueDate,
      })),
    });
  } else {
    await prisma.charge.create({
      data: {
        unitId: parsed.data.unitId,
        concept: parsed.data.concept,
        amountCents,
        period,
        dueDate: parsed.data.dueDate,
      },
    });
  }

  revalidatePath("/admin/cuotas");
  redirect("/admin/cuotas");
}

export async function deleteChargeAction(chargeId: string): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  const charge = await prisma.charge.findUnique({
    where: { id: chargeId },
    include: { _count: { select: { payments: true } } },
  });

  if (!charge) {
    return { success: false, message: "Cuota no encontrada" };
  }

  if (charge._count.payments > 0) {
    return { success: false, message: "No se puede eliminar: ya tiene pagos registrados" };
  }

  await prisma.charge.delete({ where: { id: chargeId } });

  revalidatePath("/admin/cuotas");
  return { success: true, message: "Cuota eliminada" };
}
