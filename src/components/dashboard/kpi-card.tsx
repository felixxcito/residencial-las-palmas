import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLOR_MAP = {
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
} as const;

export function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  color: keyof typeof COLOR_MAP;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between pt-6">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", COLOR_MAP[color])}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
