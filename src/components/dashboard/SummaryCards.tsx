"use client";

import { ArrowDownRightIcon, ArrowUpRightIcon, WalletIcon } from "lucide-react";

import { getSummaryMetrics, useFinanceStore } from "@/store/useFinanceStore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const icons = [WalletIcon, ArrowUpRightIcon, ArrowDownRightIcon, WalletIcon];

export function SummaryCards() {
  const transactions = useFinanceStore((state) => state.transactions);
  const metrics = getSummaryMetrics(transactions);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = icons[index];
        const badgeVariant =
          metric.tone === "negative"
            ? "destructive"
            : metric.tone === "neutral"
              ? "secondary"
              : "default";

        return (
          <Card
            key={metric.label}
            className="panel-soft animate-in fade-in-0 slide-in-from-bottom-4 border-none duration-500 transition-transform hover:-translate-y-1 hover:shadow-[0_18px_40px_color-mix(in_oklab,var(--foreground)_8%,transparent)]"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <CardHeader className="gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex size-11 items-center justify-center rounded-[1.35rem] bg-primary/12 text-primary">
                  <Icon />
                </div>
                <Badge variant={badgeVariant}>{metric.change}</Badge>
              </div>
              <div>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="mt-2 text-3xl">{metric.value}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Snapshot from the current six-month mock dataset.
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
