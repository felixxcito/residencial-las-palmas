import type { Resident } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
import { ResidentFormDialog } from "./resident-form-dialog";
import { deleteResidentAction } from "@/actions/residents.actions";
import { RESIDENT_RELATION_LABELS } from "@/lib/constants";
import { initials } from "@/lib/utils";
import { Users } from "lucide-react";

export function ResidentsList({ unitId, residents }: { unitId: string; residents: Resident[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ResidentFormDialog unitId={unitId} />
      </div>

      {residents.length === 0 ? (
        <EmptyState icon={Users} title="Sin residentes registrados" description="Agrega al primer residente de esta unidad." />
      ) : (
        <div className="space-y-2">
          {residents.map((resident) => (
            <div
              key={resident.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback>{initials(resident.fullName)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{resident.fullName}</p>
                    {resident.isPrimary && <Badge variant="secondary">Principal</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {RESIDENT_RELATION_LABELS[resident.relation]}
                    {resident.email ? ` · ${resident.email}` : ""}
                    {resident.phone ? ` · ${resident.phone}` : ""}
                  </p>
                </div>
              </div>
              <ConfirmDeleteButton
                title="Eliminar residente"
                description={`¿Eliminar a ${resident.fullName} de esta unidad? Esta acción no se puede deshacer.`}
                action={deleteResidentAction.bind(null, resident.id, unitId)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
