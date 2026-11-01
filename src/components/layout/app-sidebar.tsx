"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LogOut } from "lucide-react";
import type { Role } from "@prisma/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getNavItemsForRole, isNavItemActive } from "./nav-config";
import { signOutAction } from "@/actions/auth.actions";
import { ROLE_LABELS } from "@/lib/constants";
import { initials } from "@/lib/utils";

type Props = {
  role: Role;
  name: string;
  email: string;
  condoName: string;
};

export function AppSidebar({ role, name, email, condoName }: Props) {
  const pathname = usePathname();
  const items = getNavItemsForRole(role);

  return (
    <Sidebar collapsible="none" className="hidden border-r lg:flex">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="size-4" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold leading-none">{condoName}</span>
            <span className="text-xs text-muted-foreground">{ROLE_LABELS[role]}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-1 px-2">
          {items.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton render={<Link href={item.href} />} isActive={active}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar className="size-8">
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium leading-none">{name}</span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground"
          >
            <LogOut className="size-4" /> Cerrar sesión
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
