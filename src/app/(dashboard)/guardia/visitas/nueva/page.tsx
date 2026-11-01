import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { VisitorCheckinForm } from "@/components/visitors/visitor-checkin-form";
import { prisma } from "@/lib/prisma";

export default async function NewVisitorPage() {
  const units = await prisma.unit.findMany({ orderBy: { code: "asc" } });

  return (
    <div>
      <PageHeader title="Registrar visita" description="Check-in de un nuevo visitante." />
      <Card className="max-w-xl">
        <CardContent className="pt-6">
          <VisitorCheckinForm units={units} />
        </CardContent>
      </Card>
    </div>
  );
}
