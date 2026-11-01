import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { TicketForm } from "@/components/maintenance/ticket-form";

export default function NewTicketPage() {
  return (
    <div>
      <PageHeader title="Nuevo ticket" description="Reporta una incidencia de mantenimiento." />
      <Card className="max-w-xl">
        <CardContent className="pt-6">
          <TicketForm />
        </CardContent>
      </Card>
    </div>
  );
}
