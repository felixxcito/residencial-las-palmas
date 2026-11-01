"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitButton } from "@/components/shared/submit-button";
import { toggleUserActiveAction, resetPasswordAction } from "@/actions/users.actions";

export function UserRowActions({ userId, isActive }: { userId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleUserActiveAction(userId);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  async function handleReset(formData: FormData) {
    const result = await resetPasswordAction(userId, null, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setError(null);
      setOpen(false);
      toast.success("Contraseña actualizada");
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <KeyRound />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restablecer contraseña</DialogTitle>
          </DialogHeader>
          <form action={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input id="password" name="password" type="text" minLength={8} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <SubmitButton className="w-full">Actualizar contraseña</SubmitButton>
          </form>
        </DialogContent>
      </Dialog>

      <button type="button" onClick={handleToggle} disabled={isPending} className="cursor-pointer">
        <Badge variant={isActive ? "default" : "outline"}>{isActive ? "Activo" : "Inactivo"}</Badge>
      </button>
    </div>
  );
}
