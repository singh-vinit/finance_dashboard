"use client";

import { SearchXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  onReset: () => void;
};

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/80 bg-background/40 px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <SearchXIcon />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">No transactions found</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Try widening the date range, clearing the search term, or resetting the
          active filters.
        </p>
      </div>
      <Button variant="outline" onClick={onReset}>
        Reset filters
      </Button>
    </div>
  );
}
