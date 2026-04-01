import { BalanceTrendChart } from "@/components/dashboard/BalanceTrendChart";
import { SpendingBreakdownChart } from "@/components/dashboard/SpendingBreakdownChart";
import { InsightCards } from "@/components/insights/InsightCards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InsightsPage() {
  return (
    <section className="flex flex-1 flex-col gap-6 py-4 md:py-6">
      <InsightCards />
      <div className="grid gap-6 xl:grid-cols-2">
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="surface-glass border-none">
          <CardHeader>
            <CardTitle>Signals worth watching</CardTitle>
            <CardDescription>
              Housing remains the anchor cost, while food and health create the
              sharpest week-to-week swings.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            The current dataset suggests stable primary income with increasingly
            healthy freelance contributions through Q1 2026. That makes the
            next optimization move less about earning more and more about
            smoothing variable expenses.
          </CardContent>
        </Card>
        <Card className="surface-glass border-none">
          <CardHeader>
            <CardTitle>Suggested next features</CardTitle>
            <CardDescription>
              This foundation is ready for budgeting, CSV import/export, and
              trend alerts without changing the stack.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            The store and component boundaries are already set up for upcoming
            instructions, so the next feature can plug into the current
            transactions flow without a structural rewrite.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
