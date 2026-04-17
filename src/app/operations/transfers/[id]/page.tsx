import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveTransactionStep } from "@/components/transactions/transaction-flow";
import {
  closeTransactionAction,
  issueBuyerAgreementAction,
  verifyTransactionPaymentAction,
} from "@/app/actions";
import { TransactionDetail } from "@/components/transactions/transaction-detail";
import { requireOperator } from "@/lib/auth";
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

export default async function OperationsTransferDetailPage({
  params,
  searchParams,
}: PageProps) {
  await requireOperator();
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

  const actions = (
    <>
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

      <form action={issueBuyerAgreementAction} className="admin-inline-form">
        <input type="hidden" name="transactionId" value={transaction.id} />
        <input
          type="text"
          name="agreementName"
          placeholder="Agreement file name"
          defaultValue={transaction.agreementName}
        />
        <button
          type="submit"
          className="site-nav__button"
          disabled={
            transaction.status !== "payment-verified" &&
            transaction.status !== "agreement-sent"
          }
        >
          Issue Buyer Agreement
        </button>
      </form>

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
    </>
  );

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-toolbar">
          <Link href="/operations" className="site-nav__button">
            Operations Home
          </Link>
          <Link href="/operations/transfers/pending" className="site-nav__button">
            Pending Queue
          </Link>
          <Link href="/operations/transfers/completed" className="site-nav__button">
            Completed Queue
          </Link>
        </div>

        <TransactionDetail
          kicker="Operations Transfer"
          title={transaction.listingModel}
          copy="This transfer view now stays locked to the current stage so operations can process one checkpoint at a time."
          role="operator"
          basePath={`/operations/transfers/${transaction.id}`}
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
