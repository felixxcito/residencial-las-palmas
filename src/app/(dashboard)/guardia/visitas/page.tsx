import Link from "next/link";
import { Plus, UserCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutButton } from "@/components/visitors/checkout-button";
import { formatDateTime } from "@/lib/utils";

export default async function GuardVisitorsPage() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [active, todayHistory] = await Promise.all([
    prisma.visitor.findMany({
      where: { checkOutAt: null },
      include: { unit: true },
      orderBy: { checkInAt: "desc" },
    }),
    prisma.visitor.findMany({
      where: { checkOutAt: { not: null }, checkInAt: { gte: todayStart } },
      include: { unit: true },
      orderBy: { checkInAt: "desc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Visitas"
        description="Control de acceso de visitantes."
        actions={
          <Button render={<Link href="/guardia/visitas/nueva" />} nativeButton={false}>
            <Plus /> Nueva visita
          </Button>
        }
      />

      <h3 className="mb-3 text-sm font-medium text-muted-foreground">
        Visitantes activos ({active.length})
      </h3>
      {active.length === 0 ? (
        <EmptyState icon={UserCheck} title="Sin visitantes activos" description="No hay visitas en curso." />
      ) : (
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((v) => (
            <Card key={v.id}>
              <CardContent className="pt-6">
                <p className="font-medium">{v.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {v.unit?.code ?? "—"} {v.hostName ? `· ${v.hostName}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">{v.reason}</p>
                <p className="mt-1 text-xs text-muted-foreground">Ingreso: {formatDateTime(v.checkInAt)}</p>
                <div className="mt-3">
                  <CheckoutButton visitorId={v.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Historial de hoy</h3>
      {todayHistory.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin visitas finalizadas hoy.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {todayHistory.map((v) => (
            <Card key={v.id}>
              <CardContent className="pt-6">
                <p className="font-medium">{v.fullName}</p>
                <p className="text-sm text-muted-foreground">{v.unit?.code ?? "—"}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(v.checkInAt)} → {v.checkOutAt && formatDateTime(v.checkOutAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
