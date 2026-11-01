import { Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { TicketsTable } from "@/components/maintenance/tickets-table";

export default async function AdminMaintenancePage() {
  const tickets = await prisma.maintenanceTicket.findMany({
    include: { unit: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Mantenimiento" description="Tickets de incidencias reportadas." />

      {tickets.length === 0 ? (
        <EmptyState icon={Wrench} title="Sin tickets" description="No hay incidencias registradas." />
      ) : (
        <TicketsTable tickets={tickets} basePath="/admin/mantenimiento" />
      )}
    </div>
  );
}
