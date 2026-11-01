export const ROLE_LABELS = {
  ADMIN: "Administrador",
  RESIDENT: "Residente",
  GUARD: "Guardia",
} as const;

export const UNIT_STATUS_LABELS = {
  OCCUPIED: "Ocupada",
  VACANT: "Vacante",
} as const;

export const RESIDENT_RELATION_LABELS = {
  OWNER: "Propietario",
  TENANT: "Inquilino",
} as const;

export const CHARGE_STATUS_LABELS = {
  PENDING: "Pendiente",
  PARTIAL: "Pago parcial",
  PAID: "Pagado",
  OVERDUE: "Vencido",
} as const;

export const CHARGE_STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  PARTIAL: "secondary",
  PAID: "default",
  OVERDUE: "destructive",
};

export const PAYMENT_METHOD_LABELS = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  CHECK: "Cheque",
  OTHER: "Otro",
} as const;

export const RESERVATION_STATUS_LABELS = {
  PENDING: "Por aprobar",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
} as const;

export const RESERVATION_STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  CONFIRMED: "default",
  CANCELLED: "destructive",
  COMPLETED: "secondary",
};

export const TICKET_STATUS_LABELS = {
  OPEN: "Abierto",
  IN_PROGRESS: "En progreso",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado",
} as const;

export const TICKET_STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  OPEN: "destructive",
  IN_PROGRESS: "secondary",
  RESOLVED: "default",
  CLOSED: "outline",
};

export const TICKET_PRIORITY_LABELS = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  URGENT: "Urgente",
} as const;

export const TICKET_CATEGORY_OPTIONS = [
  "Plomería",
  "Electricidad",
  "Áreas comunes",
  "Ascensores",
  "Jardinería",
  "Seguridad",
  "Otro",
];
