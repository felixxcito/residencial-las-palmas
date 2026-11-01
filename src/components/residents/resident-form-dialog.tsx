"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitButton } from "@/components/shared/submit-button";
import { RESIDENT_RELATION_LABELS } from "@/lib/constants";
import { createResidentAction } from "@/actions/residents.actions";

export function ResidentFormDialog({ unitId }: { unitId: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await createResidentAction(unitId, null, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setError(null);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <UserPlus /> Agregar residente
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar residente</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input id="fullName" name="fullName" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="relation">Relación</Label>
            <Select name="relation" defaultValue="OWNER">
              <SelectTrigger id="relation" className="w-full">
                <SelectValue>
                  {(value: keyof typeof RESIDENT_RELATION_LABELS) => RESIDENT_RELATION_LABELS[value]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RESIDENT_RELATION_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="isPrimary" name="isPrimary" />
            <Label htmlFor="isPrimary" className="font-normal">
              Es el residente principal de la unidad
            </Label>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <SubmitButton className="w-full">Guardar residente</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
