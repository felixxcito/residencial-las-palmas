"use client";

import { useActionState } from "react";
import type { Unit } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/shared/submit-button";
import { UNIT_STATUS_LABELS } from "@/lib/constants";
import type { FormState } from "@/lib/action-types";

export function UnitForm({
  unit,
  action,
}: {
  unit?: Unit;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, null);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code">Código de unidad</Label>
          <Input id="code" name="code" placeholder="A-101" defaultValue={unit?.code} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="building">Torre / Bloque</Label>
          <Input id="building" name="building" placeholder="Torre A" defaultValue={unit?.building ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="floor">Piso</Label>
          <Input id="floor" name="floor" type="number" defaultValue={unit?.floor ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Input id="type" name="type" placeholder="Departamento" defaultValue={unit?.type ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="areaM2">Área (m²)</Label>
          <Input id="areaM2" name="areaM2" type="number" step="0.1" defaultValue={unit?.areaM2 ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parkingSpots">Parqueos</Label>
          <Input
            id="parkingSpots"
            name="parkingSpots"
            type="number"
            min={0}
            defaultValue={unit?.parkingSpots ?? 0}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="status">Estado</Label>
          <Select name="status" defaultValue={unit?.status ?? "OCCUPIED"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue>
                {(value: keyof typeof UNIT_STATUS_LABELS) => UNIT_STATUS_LABELS[value]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(UNIT_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={unit?.notes ?? ""} />
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton>{unit ? "Guardar cambios" : "Crear unidad"}</SubmitButton>
    </form>
  );
}
