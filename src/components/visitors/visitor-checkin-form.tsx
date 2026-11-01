"use client";

import { useActionState } from "react";
import type { Unit } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/shared/submit-button";
import { checkInVisitorAction } from "@/actions/visitors.actions";
import type { FormState } from "@/lib/action-types";

export function VisitorCheckinForm({ units }: { units: Unit[] }) {
  const [state, formAction] = useActionState<FormState, FormData>(checkInVisitorAction, null);
  const unitLabels = Object.fromEntries(units.map((u) => [u.id, u.code]));

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre del visitante</Label>
        <Input id="fullName" name="fullName" required autoFocus />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="documentId">Documento de identidad</Label>
          <Input id="documentId" name="documentId" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehiclePlate">Placa (si aplica)</Label>
          <Input id="vehiclePlate" name="vehiclePlate" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unitId">Unidad que visita</Label>
        <Select name="unitId">
          <SelectTrigger id="unitId" className="w-full">
            <SelectValue placeholder="Selecciona una unidad">
              {(value: string) => unitLabels[value] ?? "Selecciona una unidad"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {units.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Motivo de la visita</Label>
        <Input id="reason" name="reason" placeholder="Visita familiar, entrega, servicio técnico..." />
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton>Registrar entrada</SubmitButton>
    </form>
  );
}
