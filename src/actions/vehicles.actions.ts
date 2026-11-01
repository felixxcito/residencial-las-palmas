"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { vehicleSchema } from "@/lib/validations/vehicle.schema";
import type { FormState, ActionResult } from "@/lib/action-types";

export async function createVehicleAction(
  unitId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(["ADMIN"]);

  const parsed = vehicleSchema.safeParse({ ...Object.fromEntries(formData), unitId });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.vehicle.findUnique({ where: { plate: parsed.data.plate } });
  if (existing) {
    return { error: "Ya existe un vehículo con esa placa" };
  }

  await prisma.vehicle.create({ data: parsed.data });

  revalidatePath(`/admin/residentes/${unitId}`);
  return null;
}

export async function deleteVehicleAction(vehicleId: string, unitId: string): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  await prisma.vehicle.delete({ where: { id: vehicleId } });

  revalidatePath(`/admin/residentes/${unitId}`);
  return { success: true, message: "Vehículo eliminado" };
}
