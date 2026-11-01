import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { UnitForm } from "@/components/residents/unit-form";
import { createUnitAction } from "@/actions/units.actions";

export default function NewUnitPage() {
  return (
    <div>
      <PageHeader title="Nueva unidad" description="Registra una nueva unidad del condominio." />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <UnitForm action={createUnitAction} />
        </CardContent>
      </Card>
    </div>
  );
}
