import { Search, BookUser } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function GuardDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const units = await prisma.unit.findMany({
    include: { residents: { orderBy: [{ isPrimary: "desc" }, { fullName: "asc" }] } },
    orderBy: { code: "asc" },
  });

  const query = q?.trim().toLowerCase() ?? "";
  const filtered = query
    ? units.filter(
        (u) =>
          u.code.toLowerCase().includes(query) ||
          u.residents.some((r) => r.fullName.toLowerCase().includes(query))
      )
    : units;

  return (
    <div>
      <PageHeader title="Directorio de unidades" description="Busca una unidad o residente para verificar una visita." />

      <form className="mb-4" method="get">
        <div className="relative max-w-sm">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Buscar por unidad o nombre..." className="pl-8" />
        </div>
      </form>

      {filtered.length === 0 ? (
        <EmptyState icon={BookUser} title="Sin resultados" description="No se encontraron unidades o residentes." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((unit) => (
            <Card key={unit.id}>
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">{unit.code}</p>
                  <Badge variant={unit.status === "OCCUPIED" ? "default" : "outline"}>
                    {unit.building ?? "—"}
                    {unit.floor ? ` · P${unit.floor}` : ""}
                  </Badge>
                </div>
                {unit.residents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin residentes registrados</p>
                ) : (
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {unit.residents.map((r) => (
                      <li key={r.id}>
                        {r.fullName}
                        {r.isPrimary ? " (Principal)" : ""}
                        {r.phone ? ` · ${r.phone}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
