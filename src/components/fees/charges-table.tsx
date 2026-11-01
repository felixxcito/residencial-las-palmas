import Link from "next/link";
import { CreditCard } from "lucide-react";
import type { Unit, Payment } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveTable, type Column } from "@/components/shared/responsive-table";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
import { deleteChargeAction } from "@/actions/fees.actions";
import { CHARGE_STATUS_LABELS, CHARGE_STATUS_VARIANT } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getBalanceCents, getDisplayStatus, type ChargeWithPayments } from "@/lib/charges";

type ChargeRow = ChargeWithPayments & { unit: Unit; payments: Payment[] };

export function ChargesTable({ charges }: { charges: ChargeRow[] }) {
  const columns: Column<ChargeRow>[] = [
    { key: "unit", header: "Unidad", render: (c) => c.unit.code },
    { key: "concept", header: "Concepto", render: (c) => c.concept },
    { key: "due", header: "Vencimiento", render: (c) => formatDate(c.dueDate) },
    { key: "amount", header: "Monto", render: (c) => formatCurrency(c.amountCents) },
    {
      key: "balance",
      header: "Saldo",
      render: (c) => {
        const balance = getBalanceCents(c);
        return balance > 0 ? formatCurrency(balance) : "—";
      },
    },
    {
      key: "status",
      header: "Estado",
      render: (c) => {
        const status = getDisplayStatus(c);
        return <Badge variant={CHARGE_STATUS_VARIANT[status]}>{CHARGE_STATUS_LABELS[status]}</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          {getBalanceCents(c) > 0 && (
            <Button
              size="sm"
              variant="outline"
              render={<Link href={`/admin/cuotas/pagos/nuevo?chargeId=${c.id}`} />}
              nativeButton={false}
            >
              <CreditCard /> Registrar pago
            </Button>
          )}
          {c.payments.length === 0 && (
            <ConfirmDeleteButton
              title="Eliminar cuota"
              description={`¿Eliminar la cuota "${c.concept}" de ${c.unit.code}?`}
              action={deleteChargeAction.bind(null, c.id)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      rows={charges}
      getRowKey={(c) => c.id}
      renderMobileCard={(c) => {
        const status = getDisplayStatus(c);
        const balance = getBalanceCents(c);
        return (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {c.unit.code} · {c.concept}
                </p>
                <p className="text-xs text-muted-foreground">Vence {formatDate(c.dueDate)}</p>
              </div>
              <Badge variant={CHARGE_STATUS_VARIANT[status]}>{CHARGE_STATUS_LABELS[status]}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm">
                {formatCurrency(c.amountCents)}
                {balance > 0 && (
                  <span className="text-muted-foreground"> · Saldo {formatCurrency(balance)}</span>
                )}
              </p>
              {balance > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  render={<Link href={`/admin/cuotas/pagos/nuevo?chargeId=${c.id}`} />}
                  nativeButton={false}
                >
                  Registrar pago
                </Button>
              )}
            </div>
          </Card>
        );
      }}
    />
  );
}
