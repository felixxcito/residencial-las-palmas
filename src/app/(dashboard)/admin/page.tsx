import { AlertTriangle, CalendarCheck, TicketCheck, Wallet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { CollectionsChart, type MonthlyCollection } from "@/components/dashboard/collections-chart";
import { DelinquencyChart, type DelinquencyByBuilding } from "@/components/dashboard/delinquency-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDisplayStatus } from "@/lib/charges";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TICKET_STATUS_LABELS, TICKET_STATUS_VARIANT } from "@/lib/constants";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthShortLabel(date: Date) {
  return new Intl.DateTimeFormat("es", { month: "short" }).format(date);
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const [charges, paymentsThisMonth, openTicketsCount, todayReservations, occupiedUnitsCount, recentAnnouncements, recentTickets] =
    await Promise.all([
      prisma.charge.findMany({ include: { unit: true, payments: true } }),
      prisma.payment.aggregate({
        _sum: { amountCents: true },
        where: { paidAt: { gte: startOfMonth } },
      }),
      prisma.maintenanceTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
      prisma.reservation.count({
        where: {
          startTime: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()), lt: startOfTomorrow },
          status: { in: ["CONFIRMED", "PENDING"] },
        },
      }),
      prisma.unit.count({ where: { status: "OCCUPIED" } }),
      prisma.announcement.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
      prisma.maintenanceTicket.findMany({
        where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
        include: { unit: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const overdueUnitIds = new Set(
    charges.filter((c) => getDisplayStatus(c) === "OVERDUE").map((c) => c.unitId)
  );
  const delinquencyPct = occupiedUnitsCount > 0 ? Math.round((overdueUnitIds.size / occupiedUnitsCount) * 100) : 0;

  const months: Date[] = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return d;
  });

  const collectionsData: MonthlyCollection[] = months.map((m) => {
    const key = monthKey(m);
    const facturado = charges
      .filter((c) => c.period === key)
      .reduce((sum, c) => sum + c.amountCents, 0);
    const cobrado = charges
      .flatMap((c) => c.payments.filter((p) => monthKey(p.paidAt) === key))
      .reduce((sum, p) => sum + p.amountCents, 0);
    return { month: monthShortLabel(m), cobrado: cobrado / 100, facturado: facturado / 100 };
  });

  const byBuilding = new Map<string, { total: number; overdue: number }>();
  for (const c of charges) {
    const building = c.unit.building ?? "Sin torre";
    const entry = byBuilding.get(building) ?? { total: 0, overdue: 0 };
    entry.total += 1;
    if (getDisplayStatus(c) === "OVERDUE") entry.overdue += 1;
    byBuilding.set(building, entry);
  }
  const delinquencyData: DelinquencyByBuilding[] = Array.from(byBuilding.entries()).map(
    ([building, { total, overdue }]) => ({
      building,
      morosidad: total > 0 ? Math.round((overdue / total) * 100) : 0,
    })
  );

  return (
    <div>
      <PageHeader title="Dashboard" description="Resumen general del condominio." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Wallet}
          label="Cobranza del mes"
          value={formatCurrency(paymentsThisMonth._sum.amountCents ?? 0)}
          color="green"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Morosidad"
          value={`${delinquencyPct}%`}
          hint={`${overdueUnitIds.size} de ${occupiedUnitsCount} unidades`}
          color="red"
        />
        <KpiCard icon={TicketCheck} label="Tickets abiertos" value={String(openTicketsCount)} color="amber" />
        <KpiCard icon={CalendarCheck} label="Reservas de hoy" value={String(todayReservations)} color="blue" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <CollectionsChart data={collectionsData} />
        <DelinquencyChart data={delinquencyData} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Últimos avisos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAnnouncements.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin avisos publicados.</p>
            ) : (
              recentAnnouncements.map((a) => (
                <div key={a.id}>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(a.publishedAt)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Últimos tickets abiertos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay tickets abiertos.</p>
            ) : (
              recentTickets.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.unit?.code ?? "Área común"}</p>
                  </div>
                  <Badge variant={TICKET_STATUS_VARIANT[t.status]}>{TICKET_STATUS_LABELS[t.status]}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
