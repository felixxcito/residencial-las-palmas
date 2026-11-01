import Link from "next/link";
import { CalendarRange, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReservationRowActions } from "@/components/reservations/reservation-row-actions";
import { RESERVATION_STATUS_LABELS, RESERVATION_STATUS_VARIANT } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

export default async function ResidentReservationsPage() {
  const user = await getCurrentUser();

  const reservations = await prisma.reservation.findMany({
    where: { userId: user!.id },
    include: { commonArea: true },
    orderBy: { startTime: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Mis reservas"
        description="Áreas comunes que has reservado."
        actions={
          <Button render={<Link href="/residente/reservas/nueva" />} nativeButton={false}>
            <Plus /> Nueva reserva
          </Button>
        }
      />

      {reservations.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="Sin reservas"
          description="Reserva un área común para tu próximo evento."
          action={
            <Button render={<Link href="/residente/reservas/nueva" />} nativeButton={false}>
              <Plus /> Nueva reserva
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reservations.map((r) => (
            <Card key={r.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{r.commonArea.name}</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(r.startTime)}</p>
                  </div>
                  <Badge variant={RESERVATION_STATUS_VARIANT[r.status]}>{RESERVATION_STATUS_LABELS[r.status]}</Badge>
                </div>
                <div className="mt-3">
                  <ReservationRowActions id={r.id} status={r.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
