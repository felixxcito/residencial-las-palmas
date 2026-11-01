"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { toggleUnitStatusAction } from "@/actions/units.actions";
import { UNIT_STATUS_LABELS } from "@/lib/constants";
import type { UnitStatus } from "@prisma/client";

export function UnitStatusToggle({ unitId, status }: { unitId: string; status: UnitStatus }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleUnitStatusAction(unitId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending} className="cursor-pointer">
      <Badge variant={status === "OCCUPIED" ? "default" : "outline"}>
        {UNIT_STATUS_LABELS[status]}
      </Badge>
    </button>
  );
}
