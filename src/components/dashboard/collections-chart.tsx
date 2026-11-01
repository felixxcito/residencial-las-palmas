"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

const chartConfig = {
  cobrado: { label: "Cobrado", color: "var(--chart-1)" },
  facturado: { label: "Facturado", color: "var(--chart-2)" },
} satisfies ChartConfig;

export type MonthlyCollection = { month: string; cobrado: number; facturado: number };

export function CollectionsChart({ data }: { data: MonthlyCollection[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cobranza mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
            />
            <Bar dataKey="facturado" fill="var(--color-facturado)" radius={4} />
            <Bar dataKey="cobrado" fill="var(--color-cobrado)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
