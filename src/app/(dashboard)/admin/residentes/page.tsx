import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { UnitsTable } from "@/components/residents/units-table";

export default async function ResidentsPage() {
  const units = await prisma.unit.findMany({
    include: {
      residents: { select: { id: true, fullName: true, isPrimary: true } },
      _count: { select: { vehicles: true } },
    },
    orderBy: { code: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Residentes y unidades"
        description="Directorio de unidades, propietarios, inquilinos y vehículos."
        actions={
          <Button render={<Link href="/admin/residentes/nueva" />} nativeButton={false}>
            <Plus /> Nueva unidad
          </Button>
        }
      />

      {units.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin unidades registradas"
          description="Crea la primera unidad del condominio para empezar."
          action={
            <Button render={<Link href="/admin/residentes/nueva" />}>
              <Plus /> Nueva unidad
            </Button>
          }
        />
      ) : (
        <UnitsTable units={units} />
      )}
    </div>
  );
}
