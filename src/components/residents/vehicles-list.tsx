import type { Vehicle } from "@prisma/client";
import { CarFront } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
import { VehicleFormDialog } from "./vehicle-form-dialog";
import { deleteVehicleAction } from "@/actions/vehicles.actions";

export function VehiclesList({ unitId, vehicles }: { unitId: string; vehicles: Vehicle[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <VehicleFormDialog unitId={unitId} />
      </div>

      {vehicles.length === 0 ? (
        <EmptyState icon={CarFront} title="Sin vehículos registrados" description="Agrega los vehículos de esta unidad." />
      ) : (
        <div className="space-y-2">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                  <CarFront className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{vehicle.plate}</p>
                  <p className="text-xs text-muted-foreground">
                    {[vehicle.brand, vehicle.model, vehicle.color].filter(Boolean).join(" · ") || "Sin detalles"}
                    {vehicle.parkingSpot ? ` · Parqueo ${vehicle.parkingSpot}` : ""}
                  </p>
                </div>
              </div>
              <ConfirmDeleteButton
                title="Eliminar vehículo"
                description={`¿Eliminar el vehículo con placa ${vehicle.plate}?`}
                action={deleteVehicleAction.bind(null, vehicle.id, unitId)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
