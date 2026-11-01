"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { CondoSettings } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/shared/submit-button";
import { updateSettingsAction } from "@/actions/settings.actions";
import type { FormState } from "@/lib/action-types";

export function SettingsForm({ settings }: { settings: CondoSettings | null }) {
  const [state, formAction] = useActionState<FormState, FormData>(updateSettingsAction, null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!submittedRef.current) return;
    submittedRef.current = false;
    if (state?.error) toast.error(state.error);
    else toast.success("Configuración guardada");
  }, [state]);

  return (
    <form
      action={formAction}
      onSubmit={() => {
        submittedRef.current = true;
      }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del condominio</Label>
        <Input id="name" name="name" defaultValue={settings?.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" name="address" defaultValue={settings?.address ?? ""} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="currency">Moneda (código)</Label>
          <Input id="currency" name="currency" defaultValue={settings?.currency ?? "USD"} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="feeDueDay">Día de vencimiento de cuotas</Label>
          <Input
            id="feeDueDay"
            name="feeDueDay"
            type="number"
            min={1}
            max={28}
            defaultValue={settings?.feeDueDay ?? 5}
            required
          />
        </div>
      </div>

      <SubmitButton>Guardar configuración</SubmitButton>
    </form>
  );
}
