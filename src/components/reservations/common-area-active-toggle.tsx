"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { toggleCommonAreaActiveAction } from "@/actions/common-areas.actions";

export function CommonAreaActiveToggle({ areaId, isActive }: { areaId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleCommonAreaActiveAction(areaId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending} className="cursor-pointer">
      <Badge variant={isActive ? "default" : "outline"}>{isActive ? "Activa" : "Inactiva"}</Badge>
    </button>
  );
}
