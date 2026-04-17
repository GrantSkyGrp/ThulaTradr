import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  getAllTransactions,
  getInvoiceByTransactionId,
} from "@/lib/local-db";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatStatusLabel(value: string | null | undefined) {
  if (!value) {
    return "Pending";
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function AdminTransactionInvoiceDetailsPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const transactions = await getAllTransactions();
  const transaction = transactions.find((entry) => entry.id === id);

  if (!transaction) {
    notFound();
  }

  if (transaction.invoiceDetailsStatus !== "submitted") {
    notFound();
  }

  const invoice = await getInvoiceByTransactionId(transaction.id);

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-toolbar">
          <Link href="/admin/transactions" className="site-nav__button">
            Back to Transactions
          </Link>
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

        <article className="account-card admin-invoice-details-page">
          <header className="transaction-detail__hero">
            <div>
              <div className="thula-kicker">Invoice Details</div>
              <h1 className="account-title">{transaction.listingModel}</h1>
              <p className="account-copy">
                Buyer-submitted billing information for invoice generation and transaction
                processing.
              </p>
            </div>
            <span className="fleet-status fleet-status--accepted">
              {formatStatusLabel(transaction.invoiceDetailsStatus)}
            </span>
          </header>

          <section className="transaction-panel transaction-panel--focus">
            <div className="account-card__grid">
              <div>
                <h5>Buyer Name</h5>
                <strong>{transaction.billingFullName || transaction.userName}</strong>
              </div>
              <div>
                <h5>Email</h5>
                <strong>{transaction.billingEmail || transaction.userEmail}</strong>
              </div>
              <div>
                <h5>Cell Number</h5>
                <strong>{transaction.billingCellNumber || "Pending"}</strong>
              </div>
              <div>
                <h5>Company Name</h5>
                <strong>{transaction.billingCompanyName || "Not provided"}</strong>
              </div>
              <div>
                <h5>VAT Number</h5>
                <strong>{transaction.billingVatNumber || "Not provided"}</strong>
              </div>
              <div>
                <h5>Invoice Number</h5>
                <strong>{invoice?.invoiceNumber ?? "Pending"}</strong>
              </div>
              <div>
                <h5>Invoice Amount</h5>
                <strong>{invoice?.amount ?? "Pending"}</strong>
              </div>
              <div>
                <h5>Transaction ID</h5>
                <strong>{transaction.id}</strong>
              </div>
            </div>
          </section>

          <section className="transaction-panel">
            <div className="transaction-panel__head">
              <h3>Billing Address</h3>
              <p>{transaction.billingAddress || "No billing address was submitted."}</p>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
