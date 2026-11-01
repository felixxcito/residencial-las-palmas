import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const settings = await prisma.condoSettings.findFirst();

  return (
    <SidebarProvider>
      <AppSidebar
        role={session.user.role}
        name={session.user.name ?? ""}
        email={session.user.email ?? ""}
        condoName={settings?.name ?? "Mi Condominio"}
      />
      <SidebarInset>
        <Topbar role={session.user.role} />
        <main className="flex-1 p-4 pb-24 lg:p-6 lg:pb-6">{children}</main>
      </SidebarInset>
      <MobileBottomNav role={session.user.role} />
    </SidebarProvider>
  );
}
