"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const description = "A donut chart showing product categories";

interface CategoriesChartProps {
  data: { name: string; value: number }[];
}

const chartConfig = {
  value: {
    label: "Products",
  },
};

export function CategoriesChart({ data }: CategoriesChartProps) {
  // Use a monochromatic palette to match the Quiet Luxury theme
  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--on-surface-variant))",
    "hsl(var(--outline))",
    "hsl(var(--outline-variant))",
    "hsl(var(--surface-variant))",
  ];

  return (
    <Card className="rounded-none border-outline-variant/50 shadow-sm bg-surface">
      <CardHeader>
        <CardTitle className="font-heading text-xl font-medium tracking-tight text-primary">Category Distribution</CardTitle>
        <CardDescription className="text-on-surface-variant">Products per category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
