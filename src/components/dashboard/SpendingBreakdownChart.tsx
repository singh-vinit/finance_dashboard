"use client";

import { Pie, PieChart } from "recharts";

import { formatCurrency } from "@/lib/utils";
import { getCategoryBreakdown, useFinanceStore } from "@/store/useFinanceStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "color-mix(in oklab, var(--chart-2) 65%, var(--chart-1))",
  "color-mix(in oklab, var(--chart-4) 70%, var(--chart-3))",
];

export function SpendingBreakdownChart() {
  const transactions = useFinanceStore((state) => state.transactions);
  const data = getCategoryBreakdown(transactions).map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));

  const chartConfig = data.reduce<ChartConfig>((config, item) => {
    config[item.category] = {
      label: item.category,
      color: item.fill,
    };
    return config;
  }, {});

  return (
    <Card className="surface-glass border-none">
      <CardHeader>
        <CardTitle>Spending breakdown</CardTitle>
        <CardDescription>
          Expense distribution by category across all tracked activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full md:h-[320px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-muted-foreground">{String(name)}</span>
                      <span className="font-mono font-medium">
                        {formatCurrency(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={72}
              outerRadius={108}
              paddingAngle={3}
              strokeWidth={0}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" className="flex-wrap" />}
              verticalAlign="bottom"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
