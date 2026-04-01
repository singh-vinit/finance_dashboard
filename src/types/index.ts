export const transactionTypes = ["income", "expense"] as const;

export const categories = [
  "Food",
  "Housing",
  "Transport",
  "Health",
  "Entertainment",
  "Salary",
  "Freelance",
] as const;

export const roles = ["admin", "viewer"] as const;
export const sortFields = ["date", "amount"] as const;
export const sortDirections = ["asc", "desc"] as const;

export type TransactionType = (typeof transactionTypes)[number];
export type Category = (typeof categories)[number];
export type UserRole = (typeof roles)[number];
export type SortField = (typeof sortFields)[number];
export type SortDirection = (typeof sortDirections)[number];

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
  tags?: string[];
};

export type TransactionFilters = {
  search: string;
  category: Category | "all";
  type: TransactionType | "all";
  dateRange: {
    from: string;
    to: string;
  };
  sort: {
    field: SortField;
    direction: SortDirection;
  };
};

export type SummaryMetric = {
  label: string;
  value: string;
  change: string;
  tone: "positive" | "neutral" | "negative";
};

export type InsightCard = {
  title: string;
  value: string;
  detail: string;
  tone: "positive" | "neutral" | "negative";
};

export type MonthlySnapshot = {
  monthKey: string;
  monthLabel: string;
  income: number;
  expenses: number;
  net: number;
  savingsRate: number;
  transactions: Transaction[];
};
