"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { paymentSchema } from "@/lib/validations/payment.schema";
import type { FormState, ActionResult } from "@/lib/action-types";
import type { ChargeStatus } from "@prisma/client";

function statusForBalance(amountCents: number, paidCents: number): ChargeStatus {
  if (paidCents <= 0) return "PENDING";
  if (paidCents >= amountCents) return "PAID";
  return "PARTIAL";
}

export async function createPaymentAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireRole(["ADMIN"]);

  const parsed = paymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const charge = await prisma.charge.findUnique({
    where: { id: parsed.data.chargeId },
    include: { payments: true },
  });

  if (!charge) {
    return { error: "Cuota no encontrada" };
  }

  const amountCents = Math.round(parsed.data.amount * 100);

  await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        chargeId: charge.id,
        amountCents,
        method: parsed.data.method,
        reference: parsed.data.reference,
        notes: parsed.data.notes,
        registeredById: user.id,
      },
    });

    const paidCents = charge.payments.reduce((sum, p) => sum + p.amountCents, 0) + amountCents;

    await tx.charge.update({
      where: { id: charge.id },
      data: { status: statusForBalance(charge.amountCents, paidCents) },
    });
  });

  revalidatePath("/admin/cuotas");
  revalidatePath("/admin/cuotas/pagos");
  revalidatePath("/admin");
  redirect("/admin/cuotas/pagos");
}

export async function deletePaymentAction(paymentId: string): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { charge: { include: { payments: true } } },
  });

  if (!payment) {
    return { success: false, message: "Pago no encontrado" };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.delete({ where: { id: paymentId } });

    const remainingCents =
      payment.charge.payments.reduce((sum, p) => sum + p.amountCents, 0) - payment.amountCents;

    await tx.charge.update({
      where: { id: payment.charge.id },
      data: { status: statusForBalance(payment.charge.amountCents, remainingCents) },
    });
  });

  revalidatePath("/admin/cuotas");
  revalidatePath("/admin/cuotas/pagos");
  revalidatePath("/admin");
  return { success: true, message: "Pago eliminado" };
}
