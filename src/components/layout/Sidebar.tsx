"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  LayoutDashboardIcon,
  ReceiptTextIcon,
  SparklesIcon,
  WalletCardsIcon,
} from "lucide-react";

import { useRole } from "@/hooks/useRole";
import { getInitials } from "@/lib/utils";
import { useFinanceStore } from "@/store/useFinanceStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navigation = [
  {
    href: "/",
    label: "Overview",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: ReceiptTextIcon,
  },
  {
    href: "/insights",
    label: "Insights",
    icon: SparklesIcon,
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole();
  const transactions = useFinanceStore((state) => state.transactions);
  const incomeCount = transactions.filter(
    (transaction) => transaction.type === "income"
  ).length;
  const expenseCount = transactions.filter(
    (transaction) => transaction.type === "expense"
  ).length;

  return (
    <SidebarRoot variant="inset" collapsible="icon">
      <SidebarHeader className="gap-4 p-3">
        <div className="surface-glass rounded-2xl border border-sidebar-border/70 p-3 text-sidebar-foreground shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
              <WalletCardsIcon />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">LedgerBloom</p>
              <p className="truncate text-xs text-sidebar-foreground/70">
                Modern finance cockpit
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-sidebar-foreground/75">
            Track cash flow, explore category trends, and prep reports fast.
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Momentum</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <ArrowUpRightIcon />
                  <span>Income entries</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>{incomeCount}</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <ArrowDownLeftIcon />
                  <span>Expense entries</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>{expenseCount}</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="surface-glass flex items-center gap-3 rounded-2xl border border-sidebar-border/70 p-3 shadow-sm">
          <Avatar size="lg">
            <AvatarFallback>{getInitials("Finance Team")}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium capitalize text-sidebar-foreground">
              {role}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              Mock API connected
            </p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </SidebarRoot>
  );
}
