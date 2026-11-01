import { CalendarRange } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ResponsiveTable, type Column } from "@/components/shared/responsive-table";
import { ReservationRowActions } from "@/components/reservations/reservation-row-actions";
import { RESERVATION_STATUS_LABELS, RESERVATION_STATUS_VARIANT } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { Reservation, CommonArea, Unit, User } from "@prisma/client";

type ReservationRow = Reservation & { commonArea: CommonArea; unit: Unit; user: User };

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    include: { commonArea: true, unit: true, user: true },
    orderBy: { startTime: "asc" },
  });

  const columns: Column<ReservationRow>[] = [
    { key: "area", header: "Área", render: (r) => r.commonArea.name },
    { key: "unit", header: "Unidad", render: (r) => r.unit.code },
    { key: "start", header: "Fecha y hora", render: (r) => formatDateTime(r.startTime) },
    { key: "resident", header: "Residente", render: (r) => r.user.name },
    {
      key: "status",
      header: "Estado",
      render: (r) => <Badge variant={RESERVATION_STATUS_VARIANT[r.status]}>{RESERVATION_STATUS_LABELS[r.status]}</Badge>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (r) => <ReservationRowActions id={r.id} status={r.status} canApprove />,
    },
  ];

  return (
    <div>
      <PageHeader title="Reservas" description="Agenda de todas las áreas comunes." />

      {reservations.length === 0 ? (
        <EmptyState icon={CalendarRange} title="Sin reservas" description="Aún no se han creado reservas." />
      ) : (
        <ResponsiveTable
          columns={columns}
          rows={reservations}
          getRowKey={(r) => r.id}
          renderMobileCard={(r) => (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {r.commonArea.name} · {r.unit.code}
                </p>
                <Badge variant={RESERVATION_STATUS_VARIANT[r.status]}>{RESERVATION_STATUS_LABELS[r.status]}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(r.startTime)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{r.user.name}</p>
              <div className="mt-2">
                <ReservationRowActions id={r.id} status={r.status} canApprove />
              </div>
            </Card>
          )}
        />
      )}
    </div>
  );
}
