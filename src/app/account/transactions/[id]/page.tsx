import { notFound } from "next/navigation";
import { resolveTransactionStep } from "@/components/transactions/transaction-flow";
import { TransactionDetail } from "@/components/transactions/transaction-detail";
import { requireUser } from "@/lib/auth";
import {
  getActivityByTransactionId,
  getDocumentsByTransactionId,
  getListingBySlug,
  getOfferById,
  getInvoiceByTransactionId,
  getTransactionsByUserId,
} from "@/lib/local-db";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ step?: string | string[] }>;
};

export default async function AccountTransactionDetailPage({
  params,
  searchParams,
}: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const transactions = await getTransactionsByUserId(user.id);
  const transaction = transactions.find((entry) => entry.id === id);

  if (!transaction) {
    notFound();
  }

  const [invoice, documents, activity, offer, listing] = await Promise.all([
    getInvoiceByTransactionId(transaction.id),
    getDocumentsByTransactionId(transaction.id),
    getActivityByTransactionId(transaction.id),
    getOfferById(transaction.offerId),
    getListingBySlug(transaction.listingSlug),
  ]);
  const query = await searchParams;
  const selectedStep = resolveTransactionStep(transaction.status, query.step, "buyer");

  return (
    <main className="account-shell">
      <div className="container-shell">
        <TransactionDetail
          kicker="Buyer Transaction"
          title={transaction.listingModel}
          copy="This page now stays focused on the single stage you are currently in, with earlier stages available one step back."
          role="buyer"
          basePath={`/account/transactions/${transaction.id}`}
          selectedStep={selectedStep}
          transaction={transaction}
          invoice={invoice}
          offer={offer}
          listing={listing}
          documents={documents}
          activity={activity}
          invoiceHref={`/account/transactions/${transaction.id}/invoice`}
          buyerPhone={user.phone}
        />
      </div>
    </main>
  );
}
