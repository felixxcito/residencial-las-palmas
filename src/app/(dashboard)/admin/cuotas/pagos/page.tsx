import Link from "next/link";
import { Plus, Receipt } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { PaymentsTable } from "@/components/fees/payments-table";

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: { charge: { include: { unit: true } }, registeredBy: true },
    orderBy: { paidAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Pagos registrados"
        description="Historial de pagos recibidos por unidad."
        actions={
          <Button render={<Link href="/admin/cuotas/pagos/nuevo" />} nativeButton={false}>
            <Plus /> Registrar pago
          </Button>
        }
      />

      {payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Sin pagos registrados"
          description="Registra el primer pago recibido de una unidad."
        />
      ) : (
        <PaymentsTable payments={payments} />
      )}
    </div>
  );
}
