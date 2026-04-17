import { PrintButton } from "@/components/shared/print-button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InvoiceDetail } from "@/components/transactions/invoice-detail";
import { requireAdmin } from "@/lib/auth";
import { getAllTransactions, getInvoiceByTransactionId } from "@/lib/local-db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminInvoicePage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const transactions = await getAllTransactions();
  const transaction = transactions.find((entry) => entry.id === id);

  if (!transaction) {
    notFound();
  }

  const invoice = await getInvoiceByTransactionId(transaction.id);

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-toolbar">
          <Link href={`/admin/transactions/${transaction.id}`} className="site-nav__button">
            Back to Transaction
          </Link>
          <PrintButton />
        </div>

        <InvoiceDetail
          title={`Invoice for ${transaction.listingModel}`}
          copy="This is the admin-side invoice reference view for the current transaction."
          transaction={transaction}
          invoice={invoice}
        />
      </div>
    </main>
  );
}
