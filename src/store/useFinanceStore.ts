"use client";

import {
  compareAsc,
  compareDesc,
  eachMonthOfInterval,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { mockTransactions } from "@/data/mockData";
import { formatCompactCurrency, percentage } from "@/lib/utils";
import type {
  Category,
  MonthlySnapshot,
  SummaryMetric,
  Transaction,
  TransactionFilters,
  UserRole,
} from "@/types";

type FinanceState = {
  transactions: Transaction[];
  role: UserRole;
  filters: TransactionFilters;
  addTransaction: (transaction: Transaction) => void;
  editTransaction: (id: string, transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  setRole: (role: UserRole) => void;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  resetFilters: () => void;
};

const latestDate = mockTransactions
  .map((transaction) => transaction.date)
  .toSorted()
  .at(-1) ?? new Date().toISOString().slice(0, 10);

export const defaultFilters: TransactionFilters = {
  search: "",
  category: "all",
  type: "all",
  dateRange: {
    from: format(subMonths(parseISO(latestDate), 5), "yyyy-MM-01"),
    to: latestDate,
  },
  sort: {
    field: "date",
    direction: "desc",
  },
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: "admin",
      filters: defaultFilters,
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),
      editTransaction: (id, transaction) =>
        set((state) => ({
          transactions: state.transactions.map((currentTransaction) =>
            currentTransaction.id === id ? transaction : currentTransaction
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id
          ),
        })),
      setRole: (role) => set({ role }),
      setFilters: (filters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
            dateRange: {
              ...state.filters.dateRange,
              ...filters.dateRange,
            },
            sort: {
              ...state.filters.sort,
              ...filters.sort,
            },
          },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: "finance-dashboard-store",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
      }),
      migrate: (persistedState) => {
        const state = persistedState as {
          role?: string;
          transactions?: Transaction[];
        };
        const persistedRole = state.role;

        const normalizedRole =
          persistedRole === "viewer" || persistedRole === "analyst"
            ? "viewer"
            : "admin";

        return {
          transactions:
            Array.isArray(state.transactions) && state.transactions.length > 0
              ? state.transactions
              : mockTransactions,
          role: normalizedRole,
        };
      },
    }
  )
);

export function getFilteredTransactions(
  transactions: Transaction[],
  filters: TransactionFilters
) {
  const filteredTransactions = transactions.filter((transaction) => {
    const searchValue = filters.search.trim().toLowerCase();
    const searchableText = [
      transaction.description,
      transaction.category,
      transaction.type,
      transaction.date,
      String(transaction.amount),
      transaction.tags?.join(" ") ?? "",
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch =
      searchValue.length === 0 || searchableText.includes(searchValue);
    const matchesCategory =
      filters.category === "all" || transaction.category === filters.category;
    const matchesType = filters.type === "all" || transaction.type === filters.type;
    const matchesFrom =
      filters.dateRange.from.length === 0 ||
      compareDesc(parseISO(transaction.date), parseISO(filters.dateRange.from)) <= 0;
    const matchesTo =
      filters.dateRange.to.length === 0 ||
      compareAsc(parseISO(transaction.date), parseISO(filters.dateRange.to)) <= 0;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesFrom &&
      matchesTo
    );
  });

  return filteredTransactions.toSorted((left, right) => {
    const direction = filters.sort.direction === "asc" ? 1 : -1;

    if (filters.sort.field === "amount") {
      return (left.amount - right.amount) * direction;
    }

    return left.date.localeCompare(right.date) * direction;
  });
}

function getWindowedTransactions(transactions: Transaction[]) {
  return getFilteredTransactions(transactions, defaultFilters);
}

export function getSummaryMetrics(transactions: Transaction[]): SummaryMetric[] {
  const scopedTransactions = getWindowedTransactions(transactions);
  const currentMonth = getCurrentMonthSnapshot(transactions);
  const totalIncome = scopedTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const totalExpenses = scopedTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  return [
    {
      label: "Total Balance",
      value: formatCompactCurrency(totalBalance),
      change: `${totalBalance >= 0 ? "+" : ""}${percentage(
        Math.abs(currentMonth.savingsRate)
      )} this month`,
      tone: totalBalance >= 0 ? "positive" : "negative",
    },
    {
      label: "Monthly Income",
      value: formatCompactCurrency(currentMonth.income),
      change: currentMonth.monthLabel,
      tone: "positive",
    },
    {
      label: "Monthly Expenses",
      value: formatCompactCurrency(currentMonth.expenses),
      change: `${currentMonth.transactions.filter((item) => item.type === "expense").length} outgoing entries`,
      tone: "neutral",
    },
    {
      label: "Savings Rate",
      value: percentage(currentMonth.savingsRate),
      change: currentMonth.savingsRate >= 35 ? "Improving cushion" : "Needs attention",
      tone: currentMonth.savingsRate >= 35 ? "positive" : "neutral",
    },
  ];
}

export function getMonthlySnapshots(transactions: Transaction[]): MonthlySnapshot[] {
  if (transactions.length === 0) {
    return [];
  }

  const dates = transactions.map((transaction) => parseISO(transaction.date));
  const interval = {
    start: startOfMonth(new Date(Math.min(...dates.map((date) => date.getTime())))),
    end: endOfMonth(new Date(Math.max(...dates.map((date) => date.getTime())))),
  };

  return eachMonthOfInterval(interval)
    .map((month) => {
      const monthKey = format(month, "yyyy-MM");
      const monthTransactions = transactions.filter((transaction) =>
        transaction.date.startsWith(monthKey)
      );
      const income = monthTransactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);
      const expenses = monthTransactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);
      const net = income - expenses;

      return {
        monthKey,
        monthLabel: format(month, "MMM yyyy"),
        income,
        expenses,
        net,
        savingsRate: income > 0 ? (net / income) * 100 : 0,
        transactions: monthTransactions,
      };
    })
    .toSorted((left, right) => left.monthKey.localeCompare(right.monthKey));
}

export function getMonthlyTrendData(transactions: Transaction[]) {
  return getMonthlySnapshots(transactions)
    .slice(-6)
    .map((snapshot) => ({
      month: format(parseISO(`${snapshot.monthKey}-01`), "MMM"),
      income: snapshot.income,
      expenses: snapshot.expenses,
      net: snapshot.net,
      savingsRate: snapshot.savingsRate,
    }));
}

export function getCategoryBreakdown(transactions: Transaction[]) {
  const expenseMap = new Map<Category, number>();

  for (const transaction of transactions) {
    if (transaction.type !== "expense") {
      continue;
    }

    expenseMap.set(
      transaction.category,
      (expenseMap.get(transaction.category) ?? 0) + transaction.amount
    );
  }

  const totalExpenses = Array.from(expenseMap.values()).reduce(
    (total, value) => total + value,
    0
  );

  return Array.from(expenseMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      share: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .toSorted((left, right) => right.amount - left.amount);
}

export function getCurrentMonthSnapshot(transactions: Transaction[]) {
  return getMonthlySnapshots(transactions).at(-1) ?? {
    monthKey: "",
    monthLabel: "No data",
    income: 0,
    expenses: 0,
    net: 0,
    savingsRate: 0,
    transactions: [],
  };
}

export function getPreviousMonthSnapshot(transactions: Transaction[]) {
  return getMonthlySnapshots(transactions).at(-2) ?? {
    monthKey: "",
    monthLabel: "No data",
    income: 0,
    expenses: 0,
    net: 0,
    savingsRate: 0,
    transactions: [],
  };
}

export function getMonthOverMonthComparison(transactions: Transaction[]) {
  const currentMonth = getCurrentMonthSnapshot(transactions);
  const previousMonth = getPreviousMonthSnapshot(transactions);

  if (previousMonth.expenses === 0) {
    return {
      percent: 0,
      isBetter: currentMonth.expenses <= previousMonth.expenses,
      detail: "Not enough history yet",
    };
  }

  const delta = currentMonth.expenses - previousMonth.expenses;
  const percent = (delta / previousMonth.expenses) * 100;

  return {
    percent,
    isBetter: delta <= 0,
    detail: `${currentMonth.monthLabel} vs ${previousMonth.monthLabel}`,
  };
}

export function getBiggestTransactionThisMonth(transactions: Transaction[]) {
  const currentMonth = getCurrentMonthSnapshot(transactions);
  return currentMonth.transactions.toSorted(
    (left, right) => right.amount - left.amount
  )[0];
}

export function getTopExpenseCategoriesThisMonth(transactions: Transaction[]) {
  const currentMonth = getCurrentMonthSnapshot(transactions);
  return getCategoryBreakdown(currentMonth.transactions).slice(0, 3);
}

export function getSavingsRateTrend(transactions: Transaction[]) {
  return getMonthlySnapshots(transactions)
    .slice(-6)
    .map((snapshot) => ({
      month: format(parseISO(`${snapshot.monthKey}-01`), "MMM"),
      savingsRate: snapshot.savingsRate,
    }));
}

export function getHighestSpendingCategoryThisMonth(transactions: Transaction[]) {
  return getCategoryBreakdown(getCurrentMonthSnapshot(transactions).transactions)[0];
}

export function getBiggestExpenseThisMonth(transactions: Transaction[]) {
  return getCurrentMonthSnapshot(transactions).transactions
    .filter((transaction) => transaction.type === "expense")
    .toSorted((left, right) => right.amount - left.amount)[0];
}

export function describeSavingsDirection(transactions: Transaction[]) {
  const currentMonth = getCurrentMonthSnapshot(transactions);
  const previousMonth = getPreviousMonthSnapshot(transactions);
  const delta = currentMonth.savingsRate - previousMonth.savingsRate;

  return {
    delta,
    improving: delta >= 0,
    label:
      previousMonth.monthKey.length === 0
        ? "No previous month to compare"
        : `${delta >= 0 ? "+" : ""}${percentage(delta)} vs last month`,
  };
}
