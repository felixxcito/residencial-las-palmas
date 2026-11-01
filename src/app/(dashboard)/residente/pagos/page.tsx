import { Wallet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AccountStatement } from "@/components/fees/account-statement";

export default async function ResidentPaymentsPage() {
  const user = await getCurrentUser();

  const resident = await prisma.resident.findUnique({ where: { userId: user!.id } });

  if (!resident) {
    return (
      <div>
        <PageHeader title="Pagos" />
        <EmptyState icon={Wallet} title="No tienes una unidad asignada" description="Contacta a la administración." />
      </div>
    );
  }

  const charges = await prisma.charge.findMany({
    where: { unitId: resident.unitId },
    include: { payments: true },
    orderBy: { dueDate: "desc" },
  });

  return (
    <div>
      <PageHeader title="Pagos" description="Estado de cuenta de tu unidad." />
      {charges.length === 0 ? (
        <EmptyState icon={Wallet} title="Sin cuotas registradas" description="Aún no se han generado cuotas para tu unidad." />
      ) : (
        <AccountStatement charges={charges} />
      )}
    </div>
  );
}
