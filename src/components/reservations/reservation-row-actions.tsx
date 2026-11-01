"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveReservationAction, cancelReservationAction } from "@/actions/reservations.actions";
import type { ReservationStatus } from "@prisma/client";

export function ReservationRowActions({
  id,
  status,
  canApprove = false,
}: {
  id: string;
  status: ReservationStatus;
  canApprove?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function run(action: (id: string) => Promise<{ success: boolean; message: string }>) {
    startTransition(async () => {
      const result = await action(id);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <div className="flex justify-end gap-1">
      {canApprove && status === "PENDING" && (
        <Button size="icon-sm" variant="outline" disabled={isPending} onClick={() => run(approveReservationAction)}>
          <Check />
        </Button>
      )}
      {(status === "PENDING" || status === "CONFIRMED") && (
        <Button
          size="icon-sm"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          disabled={isPending}
          onClick={() => run(cancelReservationAction)}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
