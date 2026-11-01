"use client";

import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { ThemeToggle } from "./theme-toggle";
import { InstallPwaButton } from "@/components/shared/install-pwa-button";
import { getNavItemsForRole, isNavItemActive } from "./nav-config";

function currentTitle(pathname: string, role: Role) {
  const items = getNavItemsForRole(role);
  const match = items.find((item) => isNavItemActive(pathname, item.href));
  return match?.label ?? "Inicio";
}

export function Topbar({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 lg:px-6">
      <h1 className="text-sm font-medium text-foreground lg:text-base">
        {currentTitle(pathname, role)}
      </h1>
      <div className="flex items-center gap-2">
        <InstallPwaButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
