"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { announcementSchema } from "@/lib/validations/announcement.schema";
import type { FormState, ActionResult } from "@/lib/action-types";

function revalidateAll() {
  revalidatePath("/admin/avisos");
  revalidatePath("/residente/avisos");
  revalidatePath("/guardia/avisos");
  revalidatePath("/admin");
  revalidatePath("/residente");
}

export async function createAnnouncementAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireRole(["ADMIN"]);

  const parsed = announcementSchema.safeParse({
    ...Object.fromEntries(formData),
    isPinned: formData.get("isPinned") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.announcement.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      isPinned: parsed.data.isPinned,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      authorId: user.id,
    },
  });

  revalidateAll();
  redirect("/admin/avisos");
}

export async function updateAnnouncementAction(
  announcementId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(["ADMIN"]);

  const parsed = announcementSchema.safeParse({
    ...Object.fromEntries(formData),
    isPinned: formData.get("isPinned") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.announcement.update({
    where: { id: announcementId },
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      isPinned: parsed.data.isPinned,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  revalidateAll();
  redirect("/admin/avisos");
}

export async function deleteAnnouncementAction(announcementId: string): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  await prisma.announcement.delete({ where: { id: announcementId } });

  revalidateAll();
  return { success: true, message: "Aviso eliminado" };
}

export async function togglePinAction(announcementId: string): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  const announcement = await prisma.announcement.findUnique({ where: { id: announcementId } });
  if (!announcement) return { success: false, message: "Aviso no encontrado" };

  await prisma.announcement.update({
    where: { id: announcementId },
    data: { isPinned: !announcement.isPinned },
  });

  revalidateAll();
  return { success: true, message: announcement.isPinned ? "Aviso desfijado" : "Aviso fijado" };
}
