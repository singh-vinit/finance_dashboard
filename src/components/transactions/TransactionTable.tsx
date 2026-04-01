"use client";

import { DownloadIcon, MoreHorizontalIcon, PlusIcon, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";

import { useRole } from "@/hooks/useRole";
import { exportTransactionsToCsv } from "@/lib/exportUtils";
import { formatCurrency, formatTransactionDate } from "@/lib/utils";
import {
  getFilteredTransactions,
  useFinanceStore,
} from "@/store/useFinanceStore";
import type { Transaction } from "@/types";
import { AddEditTransactionModal } from "@/components/transactions/AddEditTransactionModal";
import { EmptyState } from "@/components/transactions/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TransactionTable() {
  const { isAdmin } = useRole();
  const allTransactions = useFinanceStore((state) => state.transactions);
  const filters = useFinanceStore((state) => state.filters);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const editTransaction = useFinanceStore((state) => state.editTransaction);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);
  const resetFilters = useFinanceStore((state) => state.resetFilters);
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null
  );
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(
    null
  );
  const transactions = getFilteredTransactions(allTransactions, filters);

  const totalAmount = transactions.reduce((total, transaction) => {
    return (
      total + (transaction.type === "income" ? transaction.amount : -transaction.amount)
    );
  }, 0);

  function handleSubmit(transaction: Transaction) {
    if (editingTransaction) {
      editTransaction(editingTransaction.id, transaction);
      setEditingTransaction(null);
      return;
    }

    addTransaction(transaction);
  }

  function openForCreate() {
    setEditingTransaction(null);
    setOpen(true);
  }

  function openForEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
    setOpen(true);
  }

  return (
    <>
      <Card className="surface-glass border-none">
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Transaction ledger</CardTitle>
            <CardDescription>
              {transactions.length} visible records across your current filter set.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="surface-glass border-none"
              onClick={() => exportTransactionsToCsv(transactions)}
            >
              <DownloadIcon data-icon="inline-start" />
              Export CSV
            </Button>
            {isAdmin && (
              <Button onClick={openForCreate}>
                <PlusIcon data-icon="inline-start" />
                Add transaction
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatTransactionDate(transaction.date)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{transaction.description}</span>
                        <span className="text-xs text-muted-foreground">
                          {transaction.tags?.join(", ") || "No tags"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.type === "income" ? "default" : "secondary"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        transaction.type === "income"
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {!isAdmin ? null : (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={<Button variant="ghost" size="icon-sm" />}
                          >
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open actions</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={() => openForEdit(transaction)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setTransactionToDelete(transaction)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-4">
                    <EmptyState
                      onReset={() => {
                        resetFilters();
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Visible net total</TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(totalAmount)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {open ? (
        <AddEditTransactionModal
          key={editingTransaction?.id ?? "new-transaction"}
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) {
              setEditingTransaction(null);
            }
          }}
          transaction={editingTransaction}
          onSubmit={handleSubmit}
        />
      ) : null}

      <Dialog
        open={Boolean(transactionToDelete)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setTransactionToDelete(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TriangleAlertIcon className="text-destructive" />
              Delete transaction?
            </DialogTitle>
            <DialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {transactionToDelete?.description}
              </span>{" "}
              from the persisted transaction history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransactionToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (transactionToDelete) {
                  deleteTransaction(transactionToDelete.id);
                }
                setTransactionToDelete(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
