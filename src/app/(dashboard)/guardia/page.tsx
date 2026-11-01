import Link from "next/link";
import { Megaphone, Plus, UserCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { formatDate, formatDateTime } from "@/lib/utils";

export default async function GuardDashboardPage() {
  const [activeCount, activeVisitors, announcements] = await Promise.all([
    prisma.visitor.count({ where: { checkOutAt: null } }),
    prisma.visitor.findMany({
      where: { checkOutAt: null },
      include: { unit: true },
      orderBy: { checkInAt: "desc" },
      take: 5,
    }),
    prisma.announcement.findMany({ orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }], take: 3 }),
  ]);

  return (
    <div>
      <PageHeader
        title="Inicio"
        description="Control de acceso y visitas."
        actions={
          <Button render={<Link href="/guardia/visitas/nueva" />} nativeButton={false}>
            <Plus /> Nueva visita
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <KpiCard icon={UserCheck} label="Visitantes activos" value={String(activeCount)} color="blue" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCheck className="size-4" /> Visitantes activos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeVisitors.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay visitantes activos.</p>
            ) : (
              activeVisitors.map((v) => (
                <div key={v.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{v.fullName}</p>
                    <p className="text-xs text-muted-foreground">{v.unit?.code ?? "—"}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDateTime(v.checkInAt)}</span>
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
