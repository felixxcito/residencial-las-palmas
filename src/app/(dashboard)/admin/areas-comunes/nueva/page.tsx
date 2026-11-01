import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { CommonAreaForm } from "@/components/reservations/common-area-form";

export default function NewCommonAreaPage() {
  return (
    <div>
      <PageHeader title="Nueva área común" description="Configura un nuevo espacio disponible para reserva." />
      <Card className="max-w-xl">
        <CardContent className="pt-6">
          <CommonAreaForm />
        </CardContent>
      </Card>
    </div>
  );
}
