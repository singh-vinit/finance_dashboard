import { BalanceTrendChart } from "@/components/dashboard/BalanceTrendChart";
import { SpendingBreakdownChart } from "@/components/dashboard/SpendingBreakdownChart";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { InsightCards } from "@/components/insights/InsightCards";

export default function HomePage() {
  return (
    <section className="flex flex-1 flex-col gap-6 py-4 md:py-6">
      <SummaryCards />
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>
      <InsightCards />
    </section>
  );
}
