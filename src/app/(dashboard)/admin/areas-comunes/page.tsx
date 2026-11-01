import Link from "next/link";
import { CalendarRange, Plus, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommonAreaActiveToggle } from "@/components/reservations/common-area-active-toggle";

export default async function CommonAreasPage() {
  const areas = await prisma.commonArea.findMany({
    include: { _count: { select: { reservations: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Áreas comunes"
        description="Gestiona los espacios disponibles para reserva."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              render={<Link href="/admin/areas-comunes/reservas" />}
              nativeButton={false}
            >
              <CalendarRange /> Ver reservas
            </Button>
            <Button render={<Link href="/admin/areas-comunes/nueva" />} nativeButton={false}>
              <Plus /> Nueva área
            </Button>
          </div>
        }
      />

      {areas.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin áreas comunes"
          description="Crea la primera área común disponible para reservar."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Card key={area.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{area.name}</CardTitle>
                  <CommonAreaActiveToggle areaId={area.id} isActive={area.isActive} />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {area.description && <p>{area.description}</p>}
                <p>
                  Horario: {area.openTime} - {area.closeTime}
                </p>
                <p>Bloques de {area.slotMinutes} min</p>
                {area.capacity && <p>Capacidad: {area.capacity} personas</p>}
                {area.requiresApproval && <p className="text-amber-600 dark:text-amber-400">Requiere aprobación</p>}
                <p>{area._count.reservations} reservas totales</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
