import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ChargeForm } from "@/components/fees/charge-form";
import { prisma } from "@/lib/prisma";

export default async function NewChargePage({
  searchParams,
}: {
  searchParams: Promise<{ unitId?: string }>;
}) {
  const { unitId } = await searchParams;
  const units = await prisma.unit.findMany({ orderBy: { code: "asc" } });

  return (
    <div>
      <PageHeader title="Generar cuota" description="Crea un cargo para una unidad o para todas las unidades ocupadas." />
      <Card className="max-w-xl">
        <CardContent className="pt-6">
          <ChargeForm units={units} defaultUnitId={unitId} />
        </CardContent>
      </Card>
    </div>
  );
}
