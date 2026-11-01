"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import type { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getNavItemsForRole, isNavItemActive, BOTTOM_NAV_LIMIT } from "./nav-config";
import { signOutAction } from "@/actions/auth.actions";

export function MobileBottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = getNavItemsForRole(role);
  const primary = items.slice(0, BOTTOM_NAV_LIMIT);
  const hasMore = items.length > BOTTOM_NAV_LIMIT;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 lg:hidden">
      {primary.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-xs",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="size-5" />
            <span className="truncate px-1">{item.label}</span>
          </Link>
        );
      })}
      {hasMore && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex flex-1 flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
            <Menu className="size-5" />
            <span>Más</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-xl">
            <SheetHeader>
              <SheetTitle>Navegación</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-3 px-4 pb-2">
              {items.map((item) => {
                const active = isNavItemActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-lg border p-3 text-xs",
                      active ? "border-primary text-primary" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="size-5" />
                    <span className="text-center">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <form action={signOutAction} className="border-t p-4">
              <Button type="submit" variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                <LogOut className="size-4" /> Cerrar sesión
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      )}
    </nav>
  );
}
