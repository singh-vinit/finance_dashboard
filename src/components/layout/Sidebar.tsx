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
        <div className="sidebar-panel rounded-[1.5rem] p-4 text-sidebar-foreground">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-black/10">
              <WalletCardsIcon />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold tracking-tight">LedgerBloom</p>
              <p className="truncate text-xs uppercase tracking-[0.22em] text-sidebar-foreground/55">
                Modern finance cockpit
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-sidebar-foreground/72">
            Track cash flow, explore category trends, and prep reports fast.
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[0.72rem] uppercase tracking-[0.24em] text-sidebar-foreground/45">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="mx-1 rounded-xl px-3 py-2.5 text-[0.96rem] font-medium data-active:shadow-sm"
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
          <SidebarGroupLabel className="px-3 text-[0.72rem] uppercase tracking-[0.24em] text-sidebar-foreground/45">
            Momentum
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="mx-1 rounded-xl px-3 py-2.5 text-[0.96rem] font-medium">
                  <ArrowUpRightIcon />
                  <span>Income entries</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>{incomeCount}</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="mx-1 rounded-xl px-3 py-2.5 text-[0.96rem] font-medium">
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
        <div className="sidebar-panel flex items-center gap-3 rounded-[1.5rem] p-3">
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
          <div className="size-2 rounded-full bg-sidebar-primary" />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </SidebarRoot>
  );
}
