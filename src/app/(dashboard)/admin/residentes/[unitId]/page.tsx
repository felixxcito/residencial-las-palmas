import { notFound } from "next/navigation";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitForm } from "@/components/residents/unit-form";
import { ResidentsList } from "@/components/residents/residents-list";
import { VehiclesList } from "@/components/residents/vehicles-list";
import { UnitStatusToggle } from "@/components/residents/unit-status-toggle";
import { updateUnitAction } from "@/actions/units.actions";

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;

  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: {
      residents: { orderBy: [{ isPrimary: "desc" }, { fullName: "asc" }] },
      vehicles: { orderBy: { plate: "asc" } },
    },
  });

  if (!unit) notFound();

  const boundUpdate = updateUnitAction.bind(null, unit.id);

  return (
    <div>
      <PageHeader
        title={unit.code}
        description={`${unit.building ?? "Sin torre"}${unit.floor ? ` · Piso ${unit.floor}` : ""}`}
        actions={
          <div className="flex items-center gap-2">
            <UnitStatusToggle unitId={unit.id} status={unit.status} />
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/admin/cuotas?unitId=${unit.id}`} />}
              nativeButton={false}
            >
              <Wallet /> Ver cuotas
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="residentes">
        <TabsList>
          <TabsTrigger value="residentes">Residentes</TabsTrigger>
          <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
          <TabsTrigger value="datos">Datos de la unidad</TabsTrigger>
        </TabsList>

        <TabsContent value="residentes">
          <Card>
            <CardContent className="pt-6">
              <ResidentsList unitId={unit.id} residents={unit.residents} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehiculos">
          <Card>
            <CardContent className="pt-6">
              <VehiclesList unitId={unit.id} vehicles={unit.vehicles} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="datos">
          <Card className="max-w-2xl">
            <CardContent className="pt-6">
              <UnitForm unit={unit} action={boundUpdate} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
