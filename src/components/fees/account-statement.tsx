import type { Payment } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ResponsiveTable, type Column } from "@/components/shared/responsive-table";
import { CHARGE_STATUS_LABELS, CHARGE_STATUS_VARIANT } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getBalanceCents, getDisplayStatus, type ChargeWithPayments } from "@/lib/charges";

type ChargeRow = ChargeWithPayments & { payments: Payment[] };

export function AccountStatement({ charges }: { charges: ChargeRow[] }) {
  const columns: Column<ChargeRow>[] = [
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
              <p className="font-medium">{c.concept}</p>
              <Badge variant={CHARGE_STATUS_VARIANT[status]}>{CHARGE_STATUS_LABELS[status]}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Vence {formatDate(c.dueDate)}</p>
            <p className="mt-2 text-sm">
              {formatCurrency(c.amountCents)}
              {balance > 0 && <span className="text-muted-foreground"> · Saldo {formatCurrency(balance)}</span>}
            </p>
          </Card>
        );
      }}
    />
  );
}
