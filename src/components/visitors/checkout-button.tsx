"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkOutVisitorAction } from "@/actions/visitors.actions";

export function CheckoutButton({ visitorId }: { visitorId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await checkOutVisitorAction(visitorId);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Button size="sm" variant="outline" disabled={isPending} onClick={handleClick}>
      <LogOut /> Registrar salida
    </Button>
  );
}
