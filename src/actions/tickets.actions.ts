"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth/session";
import { UnauthorizedError } from "@/lib/auth/session";
import { ticketSchema } from "@/lib/validations/ticket.schema";
import type { FormState, ActionResult } from "@/lib/action-types";
import type { TicketStatus, TicketPriority } from "@prisma/client";

export async function createTicketAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "RESIDENT" && user.role !== "ADMIN")) {
    throw new UnauthorizedError();
  }

  const parsed = ticketSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  let unitId: string | undefined;
  if (user.role === "RESIDENT") {
    const resident = await prisma.resident.findUnique({ where: { userId: user.id } });
    unitId = resident?.unitId;
  }

  await prisma.maintenanceTicket.create({
    data: {
      ...parsed.data,
      unitId,
      createdById: user.id,
    },
  });

  revalidatePath("/admin/mantenimiento");
  revalidatePath("/residente/mantenimiento");
  redirect(user.role === "ADMIN" ? "/admin/mantenimiento" : "/residente/mantenimiento");
}

export async function updateTicketAction(
  ticketId: string,
  data: { status?: TicketStatus; priority?: TicketPriority }
): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  await prisma.maintenanceTicket.update({ where: { id: ticketId }, data });

  revalidatePath("/admin/mantenimiento");
  revalidatePath(`/admin/mantenimiento/${ticketId}`);
  revalidatePath("/admin");
  revalidatePath("/residente/mantenimiento");
  return { success: true, message: "Ticket actualizado" };
}

export async function addTicketCommentAction(
  ticketId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireRole(["ADMIN"]);

  const body = formData.get("body");
  if (typeof body !== "string" || body.trim().length === 0) {
    return { error: "El comentario no puede estar vacío" };
  }

  await prisma.ticketComment.create({
    data: { ticketId, authorId: user.id, body: body.trim() },
  });

  revalidatePath(`/admin/mantenimiento/${ticketId}`);
  return null;
}
