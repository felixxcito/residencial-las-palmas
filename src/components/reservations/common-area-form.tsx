"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/shared/submit-button";
import { createCommonAreaAction } from "@/actions/common-areas.actions";
import type { FormState } from "@/lib/action-types";

export function CommonAreaForm() {
  const [state, formAction] = useActionState<FormState, FormData>(createCommonAreaAction, null);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" placeholder="Salón de eventos" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacidad</Label>
          <Input id="capacity" name="capacity" type="number" min={1} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slotMinutes">Duración del bloque (min)</Label>
          <Input id="slotMinutes" name="slotMinutes" type="number" min={15} step={15} defaultValue={60} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="openTime">Hora de apertura</Label>
          <Input id="openTime" name="openTime" type="time" defaultValue="08:00" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="closeTime">Hora de cierre</Label>
          <Input id="closeTime" name="closeTime" type="time" defaultValue="22:00" required />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="requiresApproval" name="requiresApproval" />
        <Label htmlFor="requiresApproval" className="font-normal">
          Requiere aprobación del administrador
        </Label>
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton>Crear área común</SubmitButton>
    </form>
  );
}
