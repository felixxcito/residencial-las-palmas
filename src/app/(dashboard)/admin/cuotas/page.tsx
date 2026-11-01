import Link from "next/link";
import { Plus, Receipt, Wallet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { ChargesTable } from "@/components/fees/charges-table";

export default async function ChargesPage({
  searchParams,
}: {
  searchParams: Promise<{ unitId?: string }>;
}) {
  const { unitId } = await searchParams;

  const charges = await prisma.charge.findMany({
    where: unitId ? { unitId } : undefined,
    include: { unit: true, payments: true },
    orderBy: [{ dueDate: "desc" }],
  });

  return (
    <div>
      <PageHeader
        title="Cuotas y pagos"
        description="Genera cuotas de mantenimiento y registra los pagos recibidos."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              render={<Link href="/admin/cuotas/pagos" />}
              nativeButton={false}
            >
              <Receipt /> Ver pagos
            </Button>
            <Button render={<Link href="/admin/cuotas/nueva" />} nativeButton={false}>
              <Plus /> Generar cuota
            </Button>
          </div>
        }
      />

      {charges.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Sin cuotas generadas"
          description="Genera la primera cuota de mantenimiento."
          action={
            <Button render={<Link href="/admin/cuotas/nueva" />} nativeButton={false}>
              <Plus /> Generar cuota
            </Button>
          }
        />
      ) : (
        <ChargesTable charges={charges} />
      )}
    </div>
  );
}
