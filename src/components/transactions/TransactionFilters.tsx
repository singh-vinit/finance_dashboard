"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { categories } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TransactionFilters() {
  const filters = useFinanceStore((state) => state.filters);
  const setFilters = useFinanceStore((state) => state.setFilters);
  const resetFilters = useFinanceStore((state) => state.resetFilters);

  return (
    <Card className="surface-glass border-none">
      <CardHeader>
        <CardTitle>Filter transactions</CardTitle>
        <CardDescription>
          Narrow the table by date range, category, type, and sort order.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-6">
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-sm font-medium">Search</span>
          <Input
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
            placeholder="Try groceries, rent, client..."
            className="surface-glass border-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">From</span>
          <Input
            type="date"
            value={filters.dateRange.from}
            onChange={(event) =>
              setFilters({
                dateRange: {
                  from: event.target.value,
                  to: filters.dateRange.to,
                },
              })
            }
            className="surface-glass border-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">To</span>
          <Input
            type="date"
            value={filters.dateRange.to}
            onChange={(event) =>
              setFilters({
                dateRange: {
                  from: filters.dateRange.from,
                  to: event.target.value,
                },
              })
            }
            className="surface-glass border-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Category</span>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters({ category: value as (typeof filters)["category"] })
            }
          >
            <SelectTrigger className="surface-glass w-full min-w-44 border-none">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Type</span>
          <Select
            value={filters.type}
            onValueChange={(value) =>
              setFilters({ type: value as (typeof filters)["type"] })
            }
          >
            <SelectTrigger className="surface-glass w-full min-w-36 border-none">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Sort</span>
          <Select
            value={`${filters.sort.field}-${filters.sort.direction}`}
            onValueChange={(value) => {
              if (!value) {
                return;
              }

              const [field, direction] = value.split("-");
              setFilters({
                sort: {
                  field: field as "date" | "amount",
                  direction: direction as "asc" | "desc",
                },
              });
            }}
          >
            <SelectTrigger className="surface-glass w-full border-none">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="date-desc">Date: newest first</SelectItem>
                <SelectItem value="date-asc">Date: oldest first</SelectItem>
                <SelectItem value="amount-desc">Amount: high to low</SelectItem>
                <SelectItem value="amount-asc">Amount: low to high</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          className="surface-glass self-end border-none"
          onClick={resetFilters}
        >
          Reset
        </Button>
      </CardContent>
    </Card>
  );
}
