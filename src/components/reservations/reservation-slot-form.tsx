"use client";

import { useActionState } from "react";
import type { Slot } from "@/lib/reservations";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/shared/submit-button";
import { createReservationAction } from "@/actions/reservations.actions";
import { cn } from "@/lib/utils";
import type { FormState } from "@/lib/action-types";

export function ReservationSlotForm({
  commonAreaId,
  date,
  slots,
}: {
  commonAreaId: string;
  date: string;
  slots: Slot[];
}) {
  const [state, formAction] = useActionState<FormState, FormData>(createReservationAction, null);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="commonAreaId" value={commonAreaId} />
      <input type="hidden" name="date" value={date} />

      <div className="space-y-2">
        <Label>Horario disponible</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((slot, i) => (
            <label
              key={slot.startLabel}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm has-checked:border-primary has-checked:bg-primary/10 has-checked:font-medium"
              )}
            >
              <input
                type="radio"
                name="startTime"
                value={slot.startLabel}
                defaultChecked={i === 0}
                className="sr-only"
                required
              />
              {slot.startLabel} - {slot.endLabel}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas (opcional)</Label>
        <Textarea id="notes" name="notes" rows={3} placeholder="Motivo del evento, número de invitados, etc." />
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton>Confirmar reserva</SubmitButton>
    </form>
  );
}
