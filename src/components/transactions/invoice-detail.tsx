import type { LocalInvoiceRecord, LocalTransactionRecord } from "@/lib/local-db";
import { PrintButton } from "@/components/shared/print-button";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatStatusLabel(value: string | null | undefined) {
  if (!value) {
    return "Pending";
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type InvoiceDetailProps = {
  title: string;
  copy: string;
  transaction: LocalTransactionRecord;
  invoice: LocalInvoiceRecord | null;
};

export function InvoiceDetail({ title, copy, transaction, invoice }: InvoiceDetailProps) {
  return (
    <article className="account-card transaction-detail">
      <div className="transaction-detail__hero">
        <div>
          <div className="thula-kicker">Invoice View</div>
          <h1 className="account-title">{title}</h1>
          <p className="account-copy">{copy}</p>
        </div>
        <div className="invoice-detail__actions">
          <span className="fleet-status fleet-status--accepted">
            {invoice ? formatStatusLabel(invoice.status) : "Pending"}
          </span>
          <PrintButton />
        </div>
      </div>

      <section className="transaction-panel">
        <div className="account-card__grid">
          <div>
            <h5>Listing</h5>
            <strong>{transaction.listingModel}</strong>
          </div>
          <div>
            <h5>Buyer</h5>
            <strong>{transaction.userName}</strong>
          </div>
          <div>
            <h5>Invoice Number</h5>
            <strong>{invoice?.invoiceNumber ?? "Pending"}</strong>
          </div>
          <div>
            <h5>Total Payable Now</h5>
            <strong>{invoice?.amount ?? "Pending"}</strong>
          </div>
          <div>
            <h5>Status</h5>
            <strong>{invoice ? formatStatusLabel(invoice.status) : "Pending"}</strong>
          </div>
          <div>
            <h5>Issued</h5>
            <strong>{invoice ? formatTimestamp(invoice.createdAt) : "Pending"}</strong>
          </div>
          <div>
            <h5>Billing Name</h5>
            <strong>{transaction.billingFullName || "Pending"}</strong>
          </div>
          <div>
            <h5>Billing Email</h5>
            <strong>{transaction.billingEmail || "Pending"}</strong>
          </div>
          <div>
            <h5>Billing Address</h5>
            <strong>{transaction.billingAddress || "Pending"}</strong>
          </div>
          <div>
            <h5>VAT</h5>
            <strong>{transaction.billingVatNumber || "Not provided"}</strong>
          </div>
        </div>
      </section>
    </article>
  );
}
