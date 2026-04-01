"use client";

import { format } from "date-fns";
import { MoonStarIcon, ShieldCheckIcon, SunMediumIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { useRole } from "@/hooks/useRole";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Overview",
    description: "See balance, income, and spending trends across the last 6 months.",
  },
  "/transactions": {
    title: "Transactions",
    description: "Filter, add, edit, and export financial activity from one place.",
  },
  "/insights": {
    title: "Insights",
    description: "Surface patterns that help you decide what to optimize next.",
  },
};

export function Header() {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? pageMeta["/"];
  const { resolvedTheme, setTheme } = useTheme();
  const { role, isAdmin } = useRole();
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const activeTheme = isHydrated ? resolvedTheme : undefined;
  const sessionDate = isHydrated ? format(new Date(), "EEE, MMM d") : "Dashboard";

  return (
    <header className="sticky top-0 z-20 px-4 pt-4 md:px-6 md:pt-6">
      <div className="panel-soft mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-[1.75rem] px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <SidebarTrigger className="mt-1 md:hidden" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight md:text-[2rem]">
                {meta.title}
              </h1>
              <Badge variant="secondary">Live mock data</Badge>
              <Badge variant={isAdmin ? "default" : "outline"}>
                <ShieldCheckIcon data-icon="inline-start" />
                {role}
              </Badge>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {meta.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium">{sessionDate}</p>
            <p className="text-xs text-muted-foreground">Dashboard session</p>
          </div>
          <RoleSwitcher />
          <Button
            variant="outline"
            size="icon-sm"
            className="panel-soft border-none shadow-none"
            onClick={() =>
              setTheme(activeTheme === "dark" ? "light" : "dark")
            }
          >
            {activeTheme === "dark" ? (
              <SunMediumIcon />
            ) : (
              <MoonStarIcon />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
