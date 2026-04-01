"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { formatCurrency } from "@/lib/utils";
import { getMonthlyTrendData, useFinanceStore } from "@/store/useFinanceStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-2)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-4)",
  },
  net: {
    label: "Net",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function BalanceTrendChart() {
  const transactions = useFinanceStore((state) => state.transactions);
  const data = getMonthlyTrendData(transactions);

  return (
    <Card className="surface-glass border-none">
      <CardHeader>
        <CardTitle>Balance trend</CardTitle>
        <CardDescription>
          Income, spending, and monthly net movement across the mock timeline.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
          <AreaChart data={data} margin={{ left: 8, right: 8, top: 12, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
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
            <Area
              type="monotone"
              dataKey="income"
              stroke="var(--color-income)"
              fill="var(--color-income)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="var(--color-expenses)"
              fill="var(--color-expenses)"
              fillOpacity={0.08}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="net"
              stroke="var(--color-net)"
              fill="var(--color-net)"
              fillOpacity={0.14}
              strokeWidth={3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
