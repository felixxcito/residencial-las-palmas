import type { Payment, Charge, Unit, User } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { ResponsiveTable, type Column } from "@/components/shared/responsive-table";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
import { deletePaymentAction } from "@/actions/payments.actions";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { formatCurrency, formatDateTime } from "@/lib/utils";

type PaymentRow = Payment & { charge: Charge & { unit: Unit }; registeredBy: User };

export function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
  const columns: Column<PaymentRow>[] = [
    { key: "unit", header: "Unidad", render: (p) => p.charge.unit.code },
    { key: "concept", header: "Concepto", render: (p) => p.charge.concept },
    { key: "amount", header: "Monto", render: (p) => formatCurrency(p.amountCents) },
    { key: "method", header: "Método", render: (p) => PAYMENT_METHOD_LABELS[p.method] },
    { key: "date", header: "Fecha", render: (p) => formatDateTime(p.paidAt) },
    { key: "by", header: "Registrado por", render: (p) => p.registeredBy.name },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (p) => (
        <div className="flex justify-end">
          <ConfirmDeleteButton
            title="Eliminar pago"
            description={`¿Eliminar el pago de ${formatCurrency(p.amountCents)} de ${p.charge.unit.code}? El saldo de la cuota se recalculará.`}
            action={deletePaymentAction.bind(null, p.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      rows={payments}
      getRowKey={(p) => p.id}
      renderMobileCard={(p) => (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">
              {p.charge.unit.code} · {formatCurrency(p.amountCents)}
            </p>
            <span className="text-xs text-muted-foreground">{PAYMENT_METHOD_LABELS[p.method]}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{p.charge.concept}</p>
          <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(p.paidAt)}</p>
        </Card>
      )}
    />
  );
}
