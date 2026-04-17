import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveTransactionStep } from "@/components/transactions/transaction-flow";
import { TransactionDetail } from "@/components/transactions/transaction-detail";
import { requireSeller } from "@/lib/auth";
import {
  getActivityByTransactionId,
  getDocumentsByTransactionId,
  getInvoiceByTransactionId,
  getTransactionsBySellerId,
} from "@/lib/local-db";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ step?: string | string[] }>;
};

export default async function SellerTransactionDetailPage({
  params,
  searchParams,
}: PageProps) {
  const seller = await requireSeller();
  const { id } = await params;
  const transactions = await getTransactionsBySellerId(seller.id);
  const transaction = transactions.find((entry) => entry.id === id);

  if (!transaction) {
    notFound();
  }

  const [invoice, documents, activity] = await Promise.all([
    getInvoiceByTransactionId(transaction.id),
    getDocumentsByTransactionId(transaction.id),
    getActivityByTransactionId(transaction.id),
  ]);
  const query = await searchParams;
  const selectedStep = resolveTransactionStep(transaction.status, query.step);

  return (
    <main className="seller-shell">
      <div className="container-shell">
        <div className="admin-toolbar">
          <Link href="/seller/transactions" className="site-nav__button">
            Back to Seller Transactions
          </Link>
          <Link href="/seller/listings" className="site-nav__button">
            My Fleet
          </Link>
        </div>

        <TransactionDetail
          kicker="Seller Transaction"
          title={transaction.listingModel}
          copy="Seller visibility is now reduced to one stage at a time so payout and agreement progress are easier to follow."
          role="seller"
          basePath={`/seller/transactions/${transaction.id}`}
          selectedStep={selectedStep}
          transaction={transaction}
          invoice={invoice}
          documents={documents}
          activity={activity}
          invoiceHref={`/seller/transactions/${transaction.id}/invoice`}
        />
      </div>
    </main>
  );
}
