"use client";

import { useState } from "react";

import { categories, type Category, type Transaction, type TransactionType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AddEditTransactionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSubmit: (transaction: Transaction) => void;
};

type TransactionDraft = {
  date: string;
  description: string;
  amount: string;
  category: Category;
  type: TransactionType;
  tags: string;
};

function getDefaultDraft(): TransactionDraft {
  return {
    date: new Date().toISOString().slice(0, 10),
    description: "",
    amount: "",
    category: "Food",
    type: "expense",
    tags: "",
  };
}

export function AddEditTransactionModal({
  open,
  onOpenChange,
  transaction,
  onSubmit,
}: AddEditTransactionModalProps) {
  const [draft, setDraft] = useState<TransactionDraft>(() =>
    transaction
      ? {
          date: transaction.date,
          description: transaction.description,
          amount: String(transaction.amount),
          category: transaction.category,
          type: transaction.type,
          tags: transaction.tags?.join(", ") ?? "",
        }
      : getDefaultDraft()
  );
  const [error, setError] = useState("");

  function handleSave() {
    if (!draft.description.trim()) {
      setError("Description is required.");
      return;
    }

    const amount = Number(draft.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    onSubmit({
      id: transaction?.id ?? `txn-${Date.now()}`,
      date: draft.date,
      description: draft.description.trim(),
      amount,
      category: draft.category,
      type: draft.type,
      tags: draft.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit transaction" : "Add transaction"}
          </DialogTitle>
          <DialogDescription>
            Capture finance activity using the same schema as your mock API.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="transaction-date">Date</FieldLabel>
              <FieldContent>
                <Input
                  id="transaction-date"
                  type="date"
                  value={draft.date}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, date: event.target.value }))
                  }
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="transaction-amount">Amount</FieldLabel>
              <FieldContent>
                <Input
                  id="transaction-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.amount}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, amount: event.target.value }))
                  }
                  placeholder="0.00"
                />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="transaction-description">Description</FieldLabel>
            <FieldContent>
              <Input
                id="transaction-description"
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Monthly salary, rent, groceries..."
              />
            </FieldContent>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Category</FieldLabel>
              <FieldContent>
                <Select
                  value={draft.category}
                  onValueChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      category: value as Category,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Type</FieldLabel>
              <FieldContent>
                <Select
                  value={draft.type}
                  onValueChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      type: value as TransactionType,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </div>

          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="transaction-tags">Tags</FieldLabel>
            <FieldContent>
              <Input
                id="transaction-tags"
                value={draft.tags}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, tags: event.target.value }))
                }
                placeholder="recurring, groceries, side-income"
                aria-invalid={Boolean(error)}
              />
              <FieldDescription>
                Use comma-separated tags to keep search and export flexible.
              </FieldDescription>
              <FieldError>{error}</FieldError>
            </FieldContent>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {transaction ? "Save changes" : "Create transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
