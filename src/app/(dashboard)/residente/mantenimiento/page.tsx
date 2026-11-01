import Link from "next/link";
import { Plus, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { TicketsTable } from "@/components/maintenance/tickets-table";

export default async function ResidentMaintenancePage() {
  const user = await getCurrentUser();

  const tickets = await prisma.maintenanceTicket.findMany({
    where: { createdById: user!.id },
    include: { unit: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Mantenimiento"
        description="Tus reportes de incidencias."
        actions={
          <Button render={<Link href="/residente/mantenimiento/nuevo" />} nativeButton={false}>
            <Plus /> Nuevo ticket
          </Button>
        }
      />

      {tickets.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="Sin tickets"
          description="Reporta una incidencia de tu unidad o de las áreas comunes."
          action={
            <Button render={<Link href="/residente/mantenimiento/nuevo" />} nativeButton={false}>
              <Plus /> Nuevo ticket
            </Button>
          }
        />
      ) : (
        <TicketsTable tickets={tickets} basePath="/residente/mantenimiento" />
      )}
    </div>
  );
}
