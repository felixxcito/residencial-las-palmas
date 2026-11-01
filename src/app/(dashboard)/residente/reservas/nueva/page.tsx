import { CalendarRange } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submit-button";
import { ReservationSlotForm } from "@/components/reservations/reservation-slot-form";
import { getAvailableSlots } from "@/lib/reservations";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default async function NewReservationPage({
  searchParams,
}: {
  searchParams: Promise<{ areaId?: string; date?: string }>;
}) {
  const { areaId, date } = await searchParams;

  const areas = await prisma.commonArea.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  if (areas.length === 0) {
    return (
      <div>
        <PageHeader title="Nueva reserva" />
        <EmptyState icon={CalendarRange} title="Sin áreas comunes disponibles" description="Contacta a la administración." />
      </div>
    );
  }

  const selectedArea = areaId ? areas.find((a) => a.id === areaId) : undefined;

  return (
    <div>
      <PageHeader title="Nueva reserva" description="Elige un área común, la fecha y un horario disponible." />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">1. Área común</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {areas.map((area) => (
                <a
                  key={area.id}
                  href={`/residente/reservas/nueva?areaId=${area.id}`}
                  className={`rounded-lg border p-3 text-sm hover:border-primary ${
                    selectedArea?.id === area.id ? "border-primary bg-primary/10 font-medium" : ""
                  }`}
                >
                  {area.name}
                  {area.requiresApproval && (
                    <span className="block text-xs text-muted-foreground">Requiere aprobación</span>
                  )}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedArea && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">2. Fecha</CardTitle>
            </CardHeader>
            <CardContent>
              <form method="get" className="flex flex-wrap items-end gap-3">
                <input type="hidden" name="areaId" value={selectedArea.id} />
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input id="date" name="date" type="date" min={todayStr()} defaultValue={date ?? todayStr()} />
                </div>
                <SubmitButton variant="outline">Ver horarios disponibles</SubmitButton>
              </form>
            </CardContent>
          </Card>
        )}

        {selectedArea && date && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">3. Horario</CardTitle>
            </CardHeader>
            <CardContent>
              <SlotPicker areaId={selectedArea.id} date={date} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

async function SlotPicker({ areaId, date }: { areaId: string; date: string }) {
  const area = await prisma.commonArea.findUnique({ where: { id: areaId } });
  if (!area) return null;

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);

  const existing = await prisma.reservation.findMany({
    where: {
      commonAreaId: area.id,
      status: { in: ["PENDING", "CONFIRMED"] },
      startTime: { gte: dayStart, lte: dayEnd },
    },
    select: { startTime: true, endTime: true },
  });

  const slots = getAvailableSlots(area, date, existing);

  if (slots.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay horarios disponibles para esta fecha.</p>;
  }

  return <ReservationSlotForm commonAreaId={area.id} date={date} slots={slots} />;
}
