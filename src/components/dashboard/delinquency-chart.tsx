"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  morosidad: { label: "% Morosidad", color: "var(--chart-5)" },
} satisfies ChartConfig;

export type DelinquencyByBuilding = { building: string; morosidad: number };

export function DelinquencyChart({ data }: { data: DelinquencyByBuilding[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Morosidad por torre</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} unit="%" />
            <YAxis dataKey="building" type="category" tickLine={false} axisLine={false} width={80} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
            <Bar dataKey="morosidad" fill="var(--color-morosidad)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
