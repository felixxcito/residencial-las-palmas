import type { Role } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  CalendarRange,
  Wrench,
  Megaphone,
  UserCheck,
  Settings,
  Home,
  Building2,
  BookUser,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Residentes", href: "/admin/residentes", icon: Users },
  { label: "Cuotas y pagos", href: "/admin/cuotas", icon: Wallet },
  { label: "Áreas comunes", href: "/admin/areas-comunes", icon: CalendarRange },
  { label: "Mantenimiento", href: "/admin/mantenimiento", icon: Wrench },
  { label: "Avisos", href: "/admin/avisos", icon: Megaphone },
  { label: "Visitas", href: "/admin/visitas", icon: UserCheck },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings },
];

const RESIDENT_NAV: NavItem[] = [
  { label: "Inicio", href: "/residente", icon: Home },
  { label: "Mi unidad", href: "/residente/mi-unidad", icon: Building2 },
  { label: "Pagos", href: "/residente/pagos", icon: Wallet },
  { label: "Reservas", href: "/residente/reservas", icon: CalendarRange },
  { label: "Mantenimiento", href: "/residente/mantenimiento", icon: Wrench },
  { label: "Avisos", href: "/residente/avisos", icon: Megaphone },
];

const GUARD_NAV: NavItem[] = [
  { label: "Inicio", href: "/guardia", icon: Home },
  { label: "Visitas", href: "/guardia/visitas", icon: UserCheck },
  { label: "Directorio", href: "/guardia/directorio", icon: BookUser },
  { label: "Avisos", href: "/guardia/avisos", icon: Megaphone },
];

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  ADMIN: ADMIN_NAV,
  RESIDENT: RESIDENT_NAV,
  GUARD: GUARD_NAV,
};

export function getNavItemsForRole(role: Role): NavItem[] {
  return NAV_BY_ROLE[role];
}

export const BOTTOM_NAV_LIMIT = 4;

const ROOT_HREFS = new Set<string>(["/admin", "/residente", "/guardia"]);

export function isNavItemActive(pathname: string, href: string) {
  if (ROOT_HREFS.has(href)) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
