import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SettingsForm } from "@/components/settings/settings-form";
import { CreateUserDialog } from "@/components/settings/create-user-dialog";
import { UserRowActions } from "@/components/settings/user-row-actions";
import { ROLE_LABELS } from "@/lib/constants";
import { initials } from "@/lib/utils";

export default async function SettingsPage() {
  const [settings, users] = await Promise.all([
    prisma.condoSettings.findFirst(),
    prisma.user.findMany({ orderBy: [{ role: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <div>
      <PageHeader title="Configuración" description="Datos del condominio y gestión de usuarios." />

      <div className="space-y-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Datos del condominio</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingsForm settings={settings} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Usuarios</CardTitle>
            <CreateUserDialog />
          </CardHeader>
          <CardContent className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <Badge variant="outline">{ROLE_LABELS[user.role]}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <UserRowActions userId={user.id} isActive={user.isActive} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
