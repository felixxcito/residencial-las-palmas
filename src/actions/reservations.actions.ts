"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth/session";
import { UnauthorizedError } from "@/lib/auth/session";
import { reservationSchema } from "@/lib/validations/reservation.schema";
import { getAvailableSlots } from "@/lib/reservations";
import type { FormState, ActionResult } from "@/lib/action-types";

export async function createReservationAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireRole(["RESIDENT"]);

  const parsed = reservationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const resident = await prisma.resident.findUnique({ where: { userId: user.id } });
  if (!resident) {
    return { error: "No tienes una unidad asignada" };
  }

  const area = await prisma.commonArea.findUnique({ where: { id: parsed.data.commonAreaId } });
  if (!area || !area.isActive) {
    return { error: "Área común no disponible" };
  }

  const dayStart = new Date(`${parsed.data.date}T00:00:00`);
  const dayEnd = new Date(`${parsed.data.date}T23:59:59`);

  const existing = await prisma.reservation.findMany({
    where: {
      commonAreaId: area.id,
      status: { in: ["PENDING", "CONFIRMED"] },
      startTime: { gte: dayStart, lte: dayEnd },
    },
    select: { startTime: true, endTime: true },
  });

  const slots = getAvailableSlots(area, parsed.data.date, existing);
  const slot = slots.find((s) => s.startLabel === parsed.data.startTime);

  if (!slot) {
    return { error: "Ese horario ya no está disponible, elige otro." };
  }

  await prisma.reservation.create({
    data: {
      commonAreaId: area.id,
      unitId: resident.unitId,
      userId: user.id,
      startTime: slot.start,
      endTime: slot.end,
      status: area.requiresApproval ? "PENDING" : "CONFIRMED",
      notes: parsed.data.notes,
    },
  });

  revalidatePath("/residente/reservas");
  revalidatePath("/admin/areas-comunes/reservas");
  redirect("/residente/reservas");
}

export async function approveReservationAction(reservationId: string): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: "CONFIRMED" },
  });

  revalidatePath("/admin/areas-comunes/reservas");
  return { success: true, message: "Reserva aprobada" };
}

export async function cancelReservationAction(reservationId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();

  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) {
    return { success: false, message: "Reserva no encontrada" };
  }

  if (user.role !== "ADMIN" && reservation.userId !== user.id) {
    return { success: false, message: "No autorizado" };
  }

  await prisma.reservation.update({ where: { id: reservationId }, data: { status: "CANCELLED" } });

  revalidatePath("/admin/areas-comunes/reservas");
  revalidatePath("/residente/reservas");
  return { success: true, message: "Reserva cancelada" };
}
