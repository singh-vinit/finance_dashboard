import Papa from "papaparse";

import type { Transaction } from "@/types";

export function exportTransactionsToCsv(transactions: Transaction[]) {
  if (typeof window === "undefined" || transactions.length === 0) {
    return;
  }

  const csv = Papa.unparse(
    transactions.map((transaction) => ({
      Date: transaction.date,
      Description: transaction.description,
      Category: transaction.category,
      Type: transaction.type,
      Amount: transaction.amount,
      Tags: transaction.tags?.join(", ") ?? "",
    }))
  );

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "transactions-export.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}
