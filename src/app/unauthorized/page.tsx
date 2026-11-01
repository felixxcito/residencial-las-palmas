import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { ROLE_HOME } from "@/auth.config";

export default async function UnauthorizedPage() {
  const session = await auth();
  const homeHref = session?.user ? ROLE_HOME[session.user.role] : "/login";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="size-8" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Acceso no autorizado</h1>
      <p className="max-w-sm text-muted-foreground">
        No tienes permisos para ver esta sección. Si crees que esto es un error, contacta a la administración.
      </p>
      <Button render={<Link href={homeHref} />} nativeButton={false}>
        Volver al inicio
      </Button>
    </div>
  );
}
