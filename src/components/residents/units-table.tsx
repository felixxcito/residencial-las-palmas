import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Unit, Resident } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { ResponsiveTable, type Column } from "@/components/shared/responsive-table";
import { UnitStatusToggle } from "./unit-status-toggle";

type UnitRow = Unit & {
  residents: Pick<Resident, "id" | "fullName" | "isPrimary">[];
  _count: { vehicles: number };
};

function primaryResidentName(unit: UnitRow) {
  const primary = unit.residents.find((r) => r.isPrimary) ?? unit.residents[0];
  return primary?.fullName ?? "Sin residente";
}

export function UnitsTable({ units }: { units: UnitRow[] }) {
  const columns: Column<UnitRow>[] = [
    {
      key: "code",
      header: "Unidad",
      render: (u) => (
        <Link href={`/admin/residentes/${u.id}`} className="font-medium hover:underline">
          {u.code}
        </Link>
      ),
    },
    { key: "building", header: "Torre / Piso", render: (u) => `${u.building ?? "—"}${u.floor ? ` · Piso ${u.floor}` : ""}` },
    { key: "resident", header: "Residente principal", render: primaryResidentName },
    { key: "vehicles", header: "Vehículos", render: (u) => u._count.vehicles },
    { key: "status", header: "Estado", render: (u) => <UnitStatusToggle unitId={u.id} status={u.status} /> },
    {
      key: "action",
      header: "",
      className: "text-right",
      render: (u) => (
        <Link href={`/admin/residentes/${u.id}`} className="text-muted-foreground hover:text-foreground">
          <ChevronRight className="ml-auto size-4" />
        </Link>
      ),
    },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      rows={units}
      getRowKey={(u) => u.id}
      renderMobileCard={(u) => (
        <Card className="p-4">
          <Link href={`/admin/residentes/${u.id}`} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{u.code}</p>
              <p className="text-sm text-muted-foreground">
                {u.building ?? "—"}
                {u.floor ? ` · Piso ${u.floor}` : ""}
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{primaryResidentName(u)}</span>
            <UnitStatusToggle unitId={u.id} status={u.status} />
          </div>
        </Card>
      )}
    />
  );
}
