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
import { createChargeAction } from "@/actions/fees.actions";
import type { FormState } from "@/lib/action-types";

function todayPlusDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function ChargeForm({ units, defaultUnitId }: { units: Unit[]; defaultUnitId?: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(createChargeAction, null);
  const unitLabels: Record<string, string> = { ALL: "Todas las unidades ocupadas" };
  units.forEach((u) => {
    unitLabels[u.id] = u.code;
  });

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="unitId">Unidad</Label>
        <Select name="unitId" defaultValue={defaultUnitId ?? "ALL"}>
          <SelectTrigger id="unitId" className="w-full">
            <SelectValue>{(value: string) => unitLabels[value] ?? value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las unidades ocupadas</SelectItem>
            {units.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="concept">Concepto</Label>
        <Input id="concept" name="concept" placeholder="Cuota de mantenimiento - Marzo 2026" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Monto</Label>
          <Input id="amount" name="amount" type="number" step="0.01" min="0.01" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Fecha de vencimiento</Label>
          <Input id="dueDate" name="dueDate" type="date" defaultValue={todayPlusDays(5)} required />
        </div>
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton>Crear cuota</SubmitButton>
    </form>
  );
}
