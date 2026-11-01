"use client";

import { useActionState, useMemo, useState } from "react";
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
import { createPaymentAction } from "@/actions/payments.actions";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { FormState } from "@/lib/action-types";

export type PendingCharge = {
  id: string;
  unitCode: string;
  concept: string;
  balanceCents: number;
};

export function PaymentForm({
  charges,
  defaultChargeId,
}: {
  charges: PendingCharge[];
  defaultChargeId?: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(createPaymentAction, null);
  const [chargeId, setChargeId] = useState(defaultChargeId ?? charges[0]?.id ?? "");

  const chargeLabels = useMemo(() => {
    const map: Record<string, string> = {};
    charges.forEach((c) => {
      map[c.id] = `${c.unitCode} · ${c.concept} · Saldo ${formatCurrency(c.balanceCents)}`;
    });
    return map;
  }, [charges]);

  const selected = charges.find((c) => c.id === chargeId);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="chargeId">Cuota</Label>
        <Select name="chargeId" value={chargeId} onValueChange={(value) => setChargeId(value ?? "")}>
          <SelectTrigger id="chargeId" className="w-full">
            <SelectValue>{(value: string) => chargeLabels[value] ?? "Selecciona una cuota"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {charges.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.unitCode} · {c.concept} · Saldo {formatCurrency(c.balanceCents)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Monto pagado</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={selected ? (selected.balanceCents / 100).toFixed(2) : undefined}
            key={chargeId}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="method">Método</Label>
          <Select name="method" defaultValue="CASH">
            <SelectTrigger id="method" className="w-full">
              <SelectValue>
                {(value: keyof typeof PAYMENT_METHOD_LABELS) => PAYMENT_METHOD_LABELS[value]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Referencia</Label>
        <Input id="reference" name="reference" placeholder="N° de transferencia, recibo, etc." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton>Registrar pago</SubmitButton>
    </form>
  );
}
