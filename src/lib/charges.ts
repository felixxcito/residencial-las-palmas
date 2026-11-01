import type { Charge, Payment } from "@prisma/client";

export type ChargeWithPayments = Charge & { payments: Pick<Payment, "amountCents">[] };

export type DisplayChargeStatus = "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";

export function getPaidCents(charge: ChargeWithPayments) {
  return charge.payments.reduce((sum, p) => sum + p.amountCents, 0);
}

export function getBalanceCents(charge: ChargeWithPayments) {
  return Math.max(charge.amountCents - getPaidCents(charge), 0);
}

export function getDisplayStatus(charge: Charge): DisplayChargeStatus {
  if (charge.status === "PENDING" || charge.status === "PARTIAL") {
    if (charge.dueDate.getTime() < Date.now()) {
      return "OVERDUE";
    }
  }
  return charge.status;
}
