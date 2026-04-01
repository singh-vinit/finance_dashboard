"use client";

import {
  DollarSignIcon,
  PiggyBankIcon,
  ReceiptTextIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { formatCurrency, percentage } from "@/lib/utils";
import {
  describeSavingsDirection,
  getBiggestTransactionThisMonth,
  getCurrentMonthSnapshot,
  getHighestSpendingCategoryThisMonth,
  getMonthOverMonthComparison,
  getSavingsRateTrend,
  getTopExpenseCategoriesThisMonth,
  useFinanceStore,
} from "@/store/useFinanceStore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export function InsightCards() {
  const transactions = useFinanceStore((state) => state.transactions);
  const currentMonth = getCurrentMonthSnapshot(transactions);
  const highestCategory = getHighestSpendingCategoryThisMonth(transactions);
  const monthComparison = getMonthOverMonthComparison(transactions);
  const topCategories = getTopExpenseCategoriesThisMonth(transactions);
  const biggestTransaction = getBiggestTransactionThisMonth(transactions);
  const savingsTrend = getSavingsRateTrend(transactions);
  const savingsDirection = describeSavingsDirection(transactions);

  const topCategoryChartConfig = {
    amount: {
      label: "Amount",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const savingsChartConfig = {
    savingsRate: {
      label: "Savings rate",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
      <Card className="surface-glass border-none xl:col-span-3">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <DollarSignIcon />
            </div>
            <Badge variant="secondary">{currentMonth.monthLabel}</Badge>
          </div>
          <div>
            <CardDescription>Highest spending category</CardDescription>
            <CardTitle className="mt-2 text-2xl">
              {highestCategory?.category ?? "No expenses"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          {highestCategory
            ? `${formatCurrency(highestCategory.amount)} spent this month`
            : "No expense activity in the current month."}
        </CardContent>
      </Card>

      <Card className="surface-glass border-none xl:col-span-3">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              {monthComparison.isBetter ? <TrendingDownIcon /> : <TrendingUpIcon />}
            </div>
            <Badge variant={monthComparison.isBetter ? "default" : "destructive"}>
              {monthComparison.isBetter ? "Better" : "Worse"}
            </Badge>
          </div>
          <div>
            <CardDescription>Month-over-month expenses</CardDescription>
            <CardTitle className="mt-2 text-2xl">
              {monthComparison.percent >= 0 ? "+" : ""}
              {percentage(monthComparison.percent)}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          {monthComparison.detail}
        </CardContent>
      </Card>

      <Card className="surface-glass border-none xl:col-span-3">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <ReceiptTextIcon />
            </div>
            <Badge variant="outline">Current month</Badge>
          </div>
          <div>
            <CardDescription>Biggest single transaction</CardDescription>
            <CardTitle className="mt-2 text-2xl">
              {biggestTransaction ? formatCurrency(biggestTransaction.amount) : "$0"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          {biggestTransaction?.description ?? "No transactions this month."}
        </CardContent>
      </Card>

      <Card className="surface-glass border-none xl:col-span-3">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <PiggyBankIcon />
            </div>
            <Badge variant={savingsDirection.improving ? "default" : "secondary"}>
              {savingsDirection.improving ? "Improving" : "Softening"}
            </Badge>
          </div>
          <div>
            <CardDescription>Savings rate trend</CardDescription>
            <CardTitle className="mt-2 text-2xl">
              {percentage(currentMonth.savingsRate)}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          {savingsDirection.label}
        </CardContent>
      </Card>

      <Card className="surface-glass border-none xl:col-span-6">
        <CardHeader>
          <CardTitle>Top 3 expense categories</CardTitle>
          <CardDescription>
            Which categories are driving this month&apos;s outgoing cash flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={topCategoryChartConfig}
            className="aspect-auto h-[240px] w-full"
          >
            <BarChart data={topCategories} layout="vertical" margin={{ left: 0, right: 16 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tickFormatter={(value) => `$${Math.round(value)}`} />
              <YAxis type="category" dataKey="category" width={92} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                }
              />
              <Bar dataKey="amount" radius={8} fill="var(--color-amount)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="surface-glass border-none xl:col-span-6">
        <CardHeader>
          <CardTitle>Savings rate over time</CardTitle>
          <CardDescription>
            Last 6 months of saving efficiency based on monthly income and expenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={savingsChartConfig}
            className="aspect-auto h-[240px] w-full"
          >
            <LineChart data={savingsTrend} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => `${Math.round(value)}%`} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => percentage(Number(value))}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="savingsRate"
                stroke="var(--color-savingsRate)"
                strokeWidth={3}
                dot={{ fill: "var(--color-savingsRate)", r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
