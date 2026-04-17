import { PrintButton } from "@/components/shared/print-button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InvoiceDetail } from "@/components/transactions/invoice-detail";
import { requireSeller } from "@/lib/auth";
import { getInvoiceByTransactionId, getTransactionsBySellerId } from "@/lib/local-db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SellerInvoicePage({ params }: PageProps) {
  const seller = await requireSeller();
  const { id } = await params;
  const transactions = await getTransactionsBySellerId(seller.id);
  const transaction = transactions.find((entry) => entry.id === id);

  if (!transaction) {
    notFound();
  }

  const invoice = await getInvoiceByTransactionId(transaction.id);

  return (
    <main className="seller-shell">
      <div className="container-shell">
        <div className="admin-toolbar">
          <Link href={`/seller/transactions/${transaction.id}`} className="site-nav__button">
            Back to Transaction
          </Link>
          <PrintButton />
        </div>

        <InvoiceDetail
          title={`Invoice for ${transaction.listingModel}`}
          copy="This is the seller-side invoice view for the same operational transaction flow."
          transaction={transaction}
          invoice={invoice}
        />
      </div>
    </main>
  );
}
