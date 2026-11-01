"use client";

import { useState } from "react";
import { CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitButton } from "@/components/shared/submit-button";
import { createVehicleAction } from "@/actions/vehicles.actions";

export function VehicleFormDialog({ unitId }: { unitId: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await createVehicleAction(unitId, null, formData);
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
        <CarFront /> Agregar vehículo
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar vehículo</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plate">Placa</Label>
            <Input id="plate" name="plate" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" name="brand" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" name="model" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parkingSpot">Parqueo</Label>
              <Input id="parkingSpot" name="parkingSpot" />
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <SubmitButton className="w-full">Guardar vehículo</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
