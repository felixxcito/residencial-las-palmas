import { AlertCircle, CalendarRange, Home, Megaphone, Wallet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { getBalanceCents, getDisplayStatus } from "@/lib/charges";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

export default async function ResidentDashboardPage() {
  const user = await getCurrentUser();
  const resident = await prisma.resident.findUnique({ where: { userId: user!.id } });

  if (!resident) {
    return (
      <div>
        <PageHeader title="Inicio" description="Tu resumen personal." />
        <EmptyState
          icon={Home}
          title="No tienes una unidad asignada"
          description="Contacta a la administración para vincular tu cuenta a una unidad."
        />
      </div>
    );
  }

  const [charges, announcements, upcomingReservations] = await Promise.all([
    prisma.charge.findMany({ where: { unitId: resident.unitId }, include: { payments: true } }),
    prisma.announcement.findMany({ orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }], take: 3 }),
    prisma.reservation.findMany({
      where: {
        userId: user!.id,
        status: { in: ["PENDING", "CONFIRMED"] },
        startTime: { gte: new Date() },
      },
      include: { commonArea: true },
      orderBy: { startTime: "asc" },
      take: 3,
    }),
  ]);

  const pendingCharges = charges.filter((c) => getDisplayStatus(c) !== "PAID");
  const totalBalanceCents = pendingCharges.reduce((sum, c) => sum + getBalanceCents(c), 0);
  const nextDue = pendingCharges.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];

  return (
    <div>
      <PageHeader title="Inicio" description="Tu resumen personal." />

      <div className="grid gap-4 sm:grid-cols-2">
        <KpiCard
          icon={Wallet}
          label="Saldo pendiente"
          value={formatCurrency(totalBalanceCents)}
          hint={nextDue ? `Próximo vencimiento: ${formatDate(nextDue.dueDate)}` : "Estás al día"}
          color={totalBalanceCents > 0 ? "red" : "green"}
        />
        <KpiCard
          icon={AlertCircle}
          label="Cuotas pendientes"
          value={String(pendingCharges.length)}
          color="amber"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarRange className="size-4" /> Próximas reservas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingReservations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tienes reservas próximas.</p>
            ) : (
              upcomingReservations.map((r) => (
                <div key={r.id}>
                  <p className="text-sm font-medium">{r.commonArea.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(r.startTime)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <Megaphone className="size-4" /> Últimos avisos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin avisos publicados.</p>
            ) : (
              announcements.map((a) => (
                <div key={a.id}>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(a.publishedAt)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
