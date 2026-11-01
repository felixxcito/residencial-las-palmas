"use client";

import { useActionState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginActionState } from "@/actions/auth.actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginActionState, FormData>(
    loginAction,
    null
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@condominio.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Iniciar sesión
      </Button>
    </form>
  );
}

export function LoginBrand() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Building2 className="size-6" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight">Residencial Las Palmas</h1>
      <p className="text-sm text-muted-foreground">Sistema de control de condominios</p>
    </div>
  );
}
