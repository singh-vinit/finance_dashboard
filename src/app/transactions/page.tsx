import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";

export default function TransactionsPage() {
  return (
    <section className="flex flex-1 flex-col gap-6 py-4 md:py-6">
      <TransactionFilters />
      <TransactionTable />
    </section>
  );
}
