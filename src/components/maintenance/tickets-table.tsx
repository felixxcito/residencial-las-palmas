import Link from "next/link";
import type { MaintenanceTicket, Unit } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ResponsiveTable, type Column } from "@/components/shared/responsive-table";
import { TICKET_STATUS_LABELS, TICKET_STATUS_VARIANT, TICKET_PRIORITY_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type TicketRow = MaintenanceTicket & { unit: Unit | null };

export function TicketsTable({ tickets, basePath }: { tickets: TicketRow[]; basePath: string }) {
  const columns: Column<TicketRow>[] = [
    {
      key: "title",
      header: "Ticket",
      render: (t) => (
        <Link href={`${basePath}/${t.id}`} className="font-medium hover:underline">
          {t.title}
        </Link>
      ),
    },
    { key: "unit", header: "Unidad", render: (t) => t.unit?.code ?? "Área común" },
    { key: "category", header: "Categoría", render: (t) => t.category ?? "—" },
    { key: "priority", header: "Prioridad", render: (t) => TICKET_PRIORITY_LABELS[t.priority] },
    {
      key: "status",
      header: "Estado",
      render: (t) => <Badge variant={TICKET_STATUS_VARIANT[t.status]}>{TICKET_STATUS_LABELS[t.status]}</Badge>,
    },
    { key: "date", header: "Creado", render: (t) => formatDate(t.createdAt) },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      rows={tickets}
      getRowKey={(t) => t.id}
      renderMobileCard={(t) => (
        <Link href={`${basePath}/${t.id}`}>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{t.title}</p>
              <Badge variant={TICKET_STATUS_VARIANT[t.status]}>{TICKET_STATUS_LABELS[t.status]}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.unit?.code ?? "Área común"} · {t.category ?? "Sin categoría"}
            </p>
          </Card>
        </Link>
      )}
    />
  );
}
