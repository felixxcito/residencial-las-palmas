import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PaymentForm, type PendingCharge } from "@/components/fees/payment-form";
import { prisma } from "@/lib/prisma";
import { getBalanceCents } from "@/lib/charges";
import { Wallet } from "lucide-react";

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ chargeId?: string }>;
}) {
  const { chargeId } = await searchParams;

  const charges = await prisma.charge.findMany({
    where: { status: { in: ["PENDING", "PARTIAL"] } },
    include: { unit: true, payments: true },
    orderBy: { dueDate: "asc" },
  });

  const pending: PendingCharge[] = charges.map((c) => ({
    id: c.id,
    unitCode: c.unit.code,
    concept: c.concept,
    balanceCents: getBalanceCents(c),
  }));

  return (
    <div>
      <PageHeader title="Registrar pago" description="Registra el pago recibido para una cuota pendiente." />
      {pending.length === 0 ? (
        <EmptyState icon={Wallet} title="No hay cuotas pendientes" description="Todas las cuotas están al día." />
      ) : (
        <Card className="max-w-xl">
          <CardContent className="pt-6">
            <PaymentForm charges={pending} defaultChargeId={chargeId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
