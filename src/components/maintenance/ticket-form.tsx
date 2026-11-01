"use client";

import { useActionState } from "react";
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
import { createTicketAction } from "@/actions/tickets.actions";
import { TICKET_CATEGORY_OPTIONS, TICKET_PRIORITY_LABELS } from "@/lib/constants";
import type { FormState } from "@/lib/action-types";

export function TicketForm() {
  const [state, formAction] = useActionState<FormState, FormData>(createTicketAction, null);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" placeholder="Fuga de agua en el pasillo" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" rows={4} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select name="category" defaultValue={TICKET_CATEGORY_OPTIONS[0]}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue>{(value: string) => value}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TICKET_CATEGORY_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Prioridad</Label>
          <Select name="priority" defaultValue="MEDIUM">
            <SelectTrigger id="priority" className="w-full">
              <SelectValue>
                {(value: keyof typeof TICKET_PRIORITY_LABELS) => TICKET_PRIORITY_LABELS[value]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TICKET_PRIORITY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton>Crear ticket</SubmitButton>
    </form>
  );
}
