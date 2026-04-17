import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  resolveTransactionStep,
  type TransactionStepKey,
} from "@/components/transactions/transaction-flow";
import {
  closeTransactionAction,
  verifyTransactionPaymentAction,
} from "@/app/actions";
import { AdminBuyerAgreementUploadForm } from "@/components/transactions/admin-buyer-agreement-upload-form";
import { TransactionDetail } from "@/components/transactions/transaction-detail";
import { requireAdmin } from "@/lib/auth";
import {
  getActivityByTransactionId,
  getAllTransactions,
  getDocumentsByTransactionId,
  getInvoiceByTransactionId,
} from "@/lib/local-db";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ step?: string | string[] }>;
};

export default async function AdminTransactionDetailPage({
  params,
  searchParams,
}: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const transactions = await getAllTransactions();
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

  const actionsByStep = {
    "invoice-details": (
      <div className="admin-step-actions">
        <Link
          href={`/admin/transactions/${transaction.id}/invoice-details/download`}
          className="site-nav__button"
        >
          Download Invoice Details
        </Link>
        {invoice ? (
          <Link
            href={`/admin/transactions/${transaction.id}/invoice`}
            className="site-nav__button"
          >
            Open Invoice
          </Link>
        ) : null}
      </div>
    ),
    payment: (
      <form action={verifyTransactionPaymentAction} className="admin-inline-form">
        <input type="hidden" name="transactionId" value={transaction.id} />
        <button
          type="submit"
          className="site-nav__button"
          disabled={transaction.paymentProofStatus !== "uploaded"}
        >
          Verify Payment
        </button>
      </form>
    ),
    "payment-verified": (
      <AdminBuyerAgreementUploadForm
        transactionId={transaction.id}
        enabled={transaction.status === "payment-verified" || transaction.status === "agreement-sent"}
      />
    ),
    "buyer-agreement": (
      <form action={closeTransactionAction} className="admin-inline-form">
        <input type="hidden" name="transactionId" value={transaction.id} />
        <button
          type="submit"
          className="site-nav__button"
          disabled={transaction.status !== "agreement-sent"}
        >
          Close Transaction
        </button>
      </form>
    ),
    completed: null,
  } satisfies Record<TransactionStepKey, ReactNode>;

  const actions = actionsByStep[selectedStep];

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-toolbar">
          <Link href="/admin/transactions" className="site-nav__button">
            Back to Transactions
          </Link>
          <Link href="/admin/offers" className="site-nav__button">
            Offers
          </Link>
        </div>

        <TransactionDetail
          kicker="Admin Transaction"
          title={transaction.listingModel}
          copy="This operational view is now staged so you only work on the current checkpoint, with previous checkpoints still reviewable."
          role="admin"
          basePath={`/admin/transactions/${transaction.id}`}
          selectedStep={selectedStep}
          transaction={transaction}
          invoice={invoice}
          documents={documents}
          activity={activity}
          actions={actions}
          invoiceHref={`/admin/transactions/${transaction.id}/invoice`}
        />
      </div>
    </main>
  );
}
