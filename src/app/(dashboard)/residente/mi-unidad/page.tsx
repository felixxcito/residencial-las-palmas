import { Building2, CarFront, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RESIDENT_RELATION_LABELS } from "@/lib/constants";
import { initials } from "@/lib/utils";

export default async function MyUnitPage() {
  const user = await getCurrentUser();

  const resident = await prisma.resident.findUnique({
    where: { userId: user!.id },
    include: {
      unit: {
        include: {
          residents: { orderBy: [{ isPrimary: "desc" }, { fullName: "asc" }] },
          vehicles: { orderBy: { plate: "asc" } },
        },
      },
    },
  });

  if (!resident) {
    return (
      <div>
        <PageHeader title="Mi unidad" />
        <EmptyState
          icon={Building2}
          title="No tienes una unidad asignada"
          description="Contacta a la administración para vincular tu cuenta a una unidad."
        />
      </div>
    );
  }

  const { unit } = resident;

  return (
    <div>
      <PageHeader title={`Unidad ${unit.code}`} description={`${unit.building ?? ""}${unit.floor ? ` · Piso ${unit.floor}` : ""}`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="size-4" /> Datos de la unidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Tipo: {unit.type ?? "—"}</p>
            <p>Área: {unit.areaM2 ? `${unit.areaM2} m²` : "—"}</p>
            <p>Parqueos: {unit.parkingSpots}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" /> Residentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {unit.residents.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback>{initials(r.fullName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{r.fullName}</p>
                    {r.isPrimary && <Badge variant="secondary">Principal</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{RESIDENT_RELATION_LABELS[r.relation]}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <CarFront className="size-4" /> Vehículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unit.vehicles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay vehículos registrados.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {unit.vehicles.map((v) => (
                  <div key={v.id} className="rounded-lg border p-3 text-sm">
                    <p className="font-medium">{v.plate}</p>
                    <p className="text-xs text-muted-foreground">
                      {[v.brand, v.model, v.color].filter(Boolean).join(" · ") || "Sin detalles"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        ¿Necesitas actualizar esta información? Contacta a la administración.
      </p>
    </div>
  );
}
