import Image from "next/image";
import Link from "next/link";
import {
  closeTransactionAction,
} from "@/app/actions";
import { AdminBuyerAgreementUploadForm } from "@/components/transactions/admin-buyer-agreement-upload-form";
import { AdminInvoiceDetailsModal } from "@/components/transactions/admin-invoice-details-modal";
import { AdminPaymentProofModal } from "@/components/transactions/admin-payment-proof-modal";
import { AdminSuccessModal } from "@/components/transactions/admin-success-modal";
import { requireAdmin } from "@/lib/auth";
import {
  getAllTransactions,
  getInvoiceByTransactionId,
  getDocumentsByTransactionId,
  getListingBySlug,
  getOfferById,
} from "@/lib/local-db";

function formatCurrency(value: number | null | undefined) {
  if (typeof value !== "number") {
    return "Pending";
  }

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatOfferReference(id: string) {
  return id.replace(/^offer-/, "").replace(/-/g, "").slice(0, 5).toUpperCase();
}

function formatStatusLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getTransactionBadgeClass(status: string) {
  if (status === "completed") {
    return "owned";
  }

  if (status === "payment-submitted" || status === "payment-verified" || status === "agreement-sent") {
    return "accepted";
  }

  return "pending";
}

type PageProps = {
  searchParams: Promise<{ agreementUploaded?: string | string[] }>;
};

export default async function AdminTransactionsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const query = await searchParams;
  const showAgreementUploadSuccess =
    (Array.isArray(query.agreementUploaded)
      ? query.agreementUploaded[0]
      : query.agreementUploaded) === "1";
  const transactions = await getAllTransactions();

  const bundles = await Promise.all(
    transactions.map(async (transaction) => {
      const [invoice, documents, listing, offer] = await Promise.all([
        getInvoiceByTransactionId(transaction.id),
        getDocumentsByTransactionId(transaction.id),
        getListingBySlug(transaction.listingSlug),
        getOfferById(transaction.offerId),
      ]);

      return {
        transaction,
        invoice,
        documents,
        listing,
        offer,
      };
    }),
  );

  return (
    <main className="admin-shell">
      {showAgreementUploadSuccess ? (
        <AdminSuccessModal
          title="Buyer Agreement Uploaded"
          message="The buyer agreement has been uploaded and is now available for the buyer to download."
          returnHref="/admin/transactions"
        />
      ) : null}
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin Transactions</div>
          <h1 className="admin-title">Transaction operations oversight</h1>
          <p className="admin-copy">
            Admin now manages payment verification, seller payout, agreement issue, and final
            ownership transfer from a single transaction workspace.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin/listings" className="site-nav__button">
            Listings
          </Link>
          <Link href="/admin/offers" className="site-nav__button">
            Offers
          </Link>
          <Link href="/admin/transactions" className="site-nav__button">
            Transactions
          </Link>
        </div>

        <div className="offers-board">
          {bundles.length === 0 ? (
            <article className="account-card">
              <h3>No transactions yet</h3>
              <p>Accept an offer to open the next-stage workflow.</p>
            </article>
          ) : (
            bundles.map(({ transaction, invoice, documents, listing, offer }) => (
              <article key={transaction.id} className="offer-row admin-transaction-row">
                <div className="offer-row__media">
                  {listing?.imageUrls[0] ? (
                    <Image
                      src={listing.imageUrls[0]}
                      alt={transaction.listingModel}
                      fill
                      sizes="(max-width: 900px) 100vw, 280px"
                    />
                  ) : (
                    <span>{transaction.listingModel}</span>
                  )}
                </div>

                <div className="offer-row__vehicle">
                  <h2>{transaction.listingModel}</h2>
                  <p>{listing?.code || transaction.listingSlug}</p>
                  <dl>
                    <div>
                      <dt>Serial Number</dt>
                      <dd>{listing?.serialLabel || listing?.code || "Pending"}</dd>
                    </div>
                    <div>
                      <dt>Offer ID</dt>
                      <dd>{formatOfferReference(transaction.offerId)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="offer-row__figures">
                  <dl>
                    <div>
                      <dt>Current List Price</dt>
                      <dd>{offer?.currentListPrice ?? listing?.currentListPrice ?? "Pending"}</dd>
                    </div>
                    <div>
                      <dt>Accepted Offer</dt>
                      <dd>{offer ? formatCurrency(offer.amount) : "Pending"}</dd>
                    </div>
                  </dl>
                </div>

                <div className="offer-row__status admin-transaction-row__status">
                  <span
                    className={`offer-row__status-badge offer-row__badge offer-row__badge--${getTransactionBadgeClass(
                      transaction.status,
                    )}`}
                  >
                    {formatStatusLabel(transaction.status)}
                  </span>
                  <div>
                    <h5>Invoice</h5>
                    <strong>{invoice?.invoiceNumber ?? "Pending"}</strong>
                  </div>
                  <div>
                    <h5>Payment Proof</h5>
                    <strong>{transaction.paymentProofStatus}</strong>
                  </div>
                  <div>
                    <h5>Buyer Agreement</h5>
                    <strong>{transaction.agreementStatus}</strong>
                  </div>
                </div>

                <div className="offer-row__actions admin-transaction-row__actions">
                  <AdminInvoiceDetailsModal
                    transactionId={transaction.id}
                    disabled={transaction.invoiceDetailsStatus !== "submitted"}
                    details={{
                      listingModel: transaction.listingModel,
                      buyerName: transaction.billingFullName || transaction.userName,
                      buyerEmail: transaction.billingEmail || transaction.userEmail,
                      cellNumber: transaction.billingCellNumber || "Pending",
                      companyName: transaction.billingCompanyName || "Not provided",
                      vatNumber: transaction.billingVatNumber || "Not provided",
                      billingAddress: transaction.billingAddress || "No billing address submitted.",
                      invoiceNumber: invoice?.invoiceNumber ?? "Pending",
                      invoiceAmount: invoice?.amount ?? "Pending",
                    }}
                  />

                  <AdminPaymentProofModal
                    transactionId={transaction.id}
                    disabled={transaction.paymentProofStatus !== "uploaded"}
                    proofName={transaction.paymentProofName || "No proof uploaded"}
                    invoiceNumber={invoice?.invoiceNumber ?? "Pending"}
                    invoiceAmount={invoice?.amount ?? "Pending"}
                  />

                  <AdminBuyerAgreementUploadForm
                    transactionId={transaction.id}
                    enabled={
                      transaction.status === "payment-verified" ||
                      transaction.status === "agreement-sent"
                    }
                  />

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
                  <span className="admin-transaction-row__documents">
                    {documents.filter((document) => document.status === "received").length}/
                    {documents.length} documents received
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
