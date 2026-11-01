import { UserCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ResponsiveTable, type Column } from "@/components/shared/responsive-table";
import { formatDateTime } from "@/lib/utils";
import type { Visitor, Unit } from "@prisma/client";

type VisitorRow = Visitor & { unit: Unit | null };

export default async function AdminVisitorsPage() {
  const visitors = await prisma.visitor.findMany({
    include: { unit: true },
    orderBy: { checkInAt: "desc" },
    take: 100,
  });

  const columns: Column<VisitorRow>[] = [
    { key: "name", header: "Visitante", render: (v) => v.fullName },
    { key: "unit", header: "Unidad", render: (v) => v.unit?.code ?? "—" },
    { key: "reason", header: "Motivo", render: (v) => v.reason ?? "—" },
    { key: "checkin", header: "Entrada", render: (v) => formatDateTime(v.checkInAt) },
    { key: "checkout", header: "Salida", render: (v) => (v.checkOutAt ? formatDateTime(v.checkOutAt) : "—") },
    {
      key: "status",
      header: "Estado",
      render: (v) => <Badge variant={v.checkOutAt ? "outline" : "default"}>{v.checkOutAt ? "Finalizada" : "Activa"}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader title="Historial de visitas" description="Registro completo de visitantes." />

      {visitors.length === 0 ? (
        <EmptyState icon={UserCheck} title="Sin visitas registradas" description="No hay historial de visitantes." />
      ) : (
        <ResponsiveTable
          columns={columns}
          rows={visitors}
          getRowKey={(v) => v.id}
          renderMobileCard={(v) => (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{v.fullName}</p>
                <Badge variant={v.checkOutAt ? "outline" : "default"}>{v.checkOutAt ? "Finalizada" : "Activa"}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{v.unit?.code ?? "—"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(v.checkInAt)}</p>
            </Card>
          )}
        />
      )}
    </div>
  );
}
