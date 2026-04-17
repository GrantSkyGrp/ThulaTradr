import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getCurrentTransactionStep,
  getTransactionSteps,
  type TransactionStepKey,
} from "@/components/transactions/transaction-flow";
import { PaymentProofModal } from "@/components/transactions/payment-proof-modal";
import { requireUser } from "@/lib/auth";
import {
  getInvoiceByTransactionId,
  getListingBySlug,
  getOfferById,
  getTransactionsByUserId,
} from "@/lib/local-db";

type PageProps = {
  params: Promise<{ id: string }>;
};

const thulaServiceFeeRate = 0.015;

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

function formatStatusLabel(value: string | null | undefined) {
  if (!value) {
    return "Pending";
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStepState(step: TransactionStepKey, currentStep: TransactionStepKey) {
  const steps = getTransactionSteps("buyer");
  const currentIndex = steps.findIndex((entry) => entry.key === currentStep);
  const stepIndex = steps.findIndex((entry) => entry.key === step);

  if (stepIndex < currentIndex) {
    return "complete";
  }

  if (stepIndex === currentIndex) {
    return "current";
  }

  return "upcoming";
}

export default async function AccountTransactionPaymentProofPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const transactions = await getTransactionsByUserId(user.id);
  const transaction = transactions.find((entry) => entry.id === id);

  if (!transaction) {
    notFound();
  }

  if (transaction.invoiceDetailsStatus !== "submitted") {
    redirect(`/account/transactions/${transaction.id}/invoice-details`);
  }

  const [invoice, offer, listing] = await Promise.all([
    getInvoiceByTransactionId(transaction.id),
    getOfferById(transaction.offerId),
    getListingBySlug(transaction.listingSlug),
  ]);
  const currentStep = getCurrentTransactionStep(transaction.status, "buyer");
  const listingImage = listing?.imageUrls[0];
  const payableNow =
    offer?.payableNow ?? invoice?.amount ?? (listing ? formatCurrency(listing.payableNowBase) : "Pending");
  const thulaServiceFee = offer ? formatCurrency(offer.amount * thulaServiceFeeRate) : "Pending";

  return (
    <main className="account-shell">
      <div className="container-shell">
        <div className="transaction-process-bar" aria-label="Transaction progress">
          {getTransactionSteps("buyer").map((step) => (
            <span
              key={step.key}
              className={`transaction-process-bar__item transaction-process-bar__item--${getStepState(
                step.key,
                currentStep,
              )}${step.key === "payment" ? " transaction-process-bar__item--selected" : ""}`}
            >
              {step.label}
            </span>
          ))}
        </div>

        <article className="account-card payment-proof-workspace">
          <header className="payment-proof-workspace__header">
            <div>
              <div className="thula-kicker">Buyer Transaction</div>
              <h1 className="account-title">Payment proof</h1>
              <p className="account-copy">
                Upload the buyer payment confirmation against the issued Thula invoice. This keeps
                the transaction on the existing payment verification step before seller payout and
                buyer agreement handling.
              </p>
            </div>
            <div className="payment-proof-workspace__status">
              <span>{formatStatusLabel(transaction.paymentProofStatus)}</span>
              <strong>{transaction.paymentProofName || "No proof uploaded yet"}</strong>
            </div>
          </header>

          <section className="payment-proof-workspace__grid">
            <aside className="payment-proof-summary">
              <div className="payment-proof-summary__media">
                {listingImage ? (
                  <Image
                    src={listingImage}
                    alt={transaction.listingModel}
                    fill
                    priority
                    sizes="(max-width: 1000px) 100vw, 360px"
                  />
                ) : (
                  <span>{transaction.listingModel}</span>
                )}
              </div>

              <div className="payment-proof-summary__content">
                <div>
                  <h2>{transaction.listingModel}</h2>
                  <p>{listing?.code || transaction.listingSlug}</p>
                </div>

                <dl>
                  <div>
                    <dt>Invoice Number</dt>
                    <dd>{invoice?.invoiceNumber ?? "Pending"}</dd>
                  </div>
                  <div>
                    <dt>Amount Due</dt>
                    <dd>{payableNow}</dd>
                  </div>
                  <div>
                    <dt>Your Offer</dt>
                    <dd>{offer ? formatCurrency(offer.amount) : "Pending"}</dd>
                  </div>
                  <div>
                    <dt>Thula Service Fee</dt>
                    <dd>{thulaServiceFee}</dd>
                  </div>
                </dl>
              </div>
            </aside>

            <section className="payment-proof-upload">
              <div>
                <div className="thula-kicker">Current Step</div>
                <h2>Upload proof of payment</h2>
                <p>
                  Accepted file types are PDF, PNG, JPG, and JPEG. The platform records the document
                  name locally for admin verification in the Thula transaction workflow.
                </p>
              </div>

              <div className="payment-proof-upload__actions">
                <PaymentProofModal
                  transactionId={transaction.id}
                  buttonLabel="Upload proof of payment"
                  defaultReference={invoice?.invoiceNumber}
                  invoiceNumber={invoice?.invoiceNumber}
                />
                <Link
                  href={`/account/transactions/${transaction.id}/invoice/pdf`}
                  className="button-secondary--outline"
                  target="_blank"
                >
                  Open invoice PDF
                </Link>
              </div>
            </section>
          </section>
        </article>
      </div>
    </main>
  );
}
