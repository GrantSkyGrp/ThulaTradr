import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  getBuyerContinueHref,
  getBuyerContinueLabel,
  getCurrentTransactionStep,
  getNextTransactionStep,
  getPreviousTransactionStep,
  getStepDescription,
  getStepFacts,
  getStepHeadline,
  getTransactionStepHref,
  getTransactionSteps,
  type TransactionStepKey,
  type TransactionViewerRole,
} from "@/components/transactions/transaction-flow";
import { InvoiceDetailsModal } from "@/components/transactions/invoice-details-modal";
import { PaymentProofModal } from "@/components/transactions/payment-proof-modal";
import type {
  LocalActivityRecord,
  LocalDocumentRecord,
  LocalInvoiceRecord,
  LocalListingRecord,
  LocalOfferRecord,
  LocalTransactionRecord,
} from "@/lib/local-db";

const thulaServiceFeeRate = 0.015;

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

function getProcessState(
  step: TransactionStepKey,
  currentStep: TransactionStepKey,
  role: TransactionViewerRole,
) {
  const flowOrder: TransactionStepKey[] =
    role === "buyer"
      ? ["invoice-details", "payment", "buyer-agreement", "completed"]
      : ["invoice-details", "payment", "payment-verified", "buyer-agreement", "completed"];
  const currentIndex = flowOrder.findIndex((entry) => entry === currentStep);
  const stepIndex = flowOrder.findIndex((entry) => entry === step);

  if (stepIndex < currentIndex) {
    return "complete";
  }

  if (stepIndex === currentIndex) {
    return "current";
  }

  return "upcoming";
}

type TransactionDetailProps = {
  title: string;
  kicker: string;
  copy: string;
  role: TransactionViewerRole;
  basePath: string;
  selectedStep: TransactionStepKey;
  transaction: LocalTransactionRecord;
  invoice: LocalInvoiceRecord | null;
  offer?: LocalOfferRecord | null;
  listing?: LocalListingRecord | null;
  documents: LocalDocumentRecord[];
  activity: LocalActivityRecord[];
  actions?: ReactNode;
  invoiceHref?: string;
  buyerPhone?: string | null;
};

export function TransactionDetail({
  title,
  kicker,
  copy,
  role,
  basePath,
  selectedStep,
  transaction,
  invoice,
  offer,
  listing,
  documents,
  activity,
  actions,
  invoiceHref,
  buyerPhone,
}: TransactionDetailProps) {
  const currentStep = getCurrentTransactionStep(transaction.status, role);
  const visibleSteps = getTransactionSteps(role);
  const currentIndex = visibleSteps.findIndex((step) => step.key === currentStep);
  const selectedIndex = visibleSteps.findIndex((step) => step.key === selectedStep);
  const previousStep = getPreviousTransactionStep(selectedStep, role);
  const nextStep =
    selectedStep !== currentStep ? getNextTransactionStep(selectedStep, role) : null;
  const stepFacts = getStepFacts(role, selectedStep, transaction, invoice);
  const continueHref =
    role === "buyer" && selectedStep === currentStep
      ? getBuyerContinueHref(transaction.id, transaction.status)
      : null;
  const continueLabel =
    role === "buyer" && selectedStep === currentStep
      ? getBuyerContinueLabel(transaction.status)
      : null;
  const recentActivity = activity.slice(0, 3);
  const currentDocuments = documents.filter((document) => document.status === "received");
  const listingImage = listing?.imageUrls[0];
  const shouldCollectInvoiceDetails =
    role === "buyer" &&
    selectedStep === currentStep &&
    transaction.status === "awaiting-invoice-details";
  const shouldShowBuyerAgreementDownload =
    role === "buyer" &&
    selectedStep === "buyer-agreement" &&
    transaction.agreementStatus === "received" &&
    Boolean(transaction.agreementName);
  const payableNow =
    offer?.payableNow ??
    invoice?.amount ??
    (listing ? formatCurrency(listing.payableNowBase) : "Pending");
  const processSteps: Array<{
    key: TransactionStepKey;
    label: string;
    detail: string;
  }> =
    role === "buyer"
      ? [
          {
            key: "invoice-details",
            label: "Invoice Details",
            detail: "Billing information is captured for the Thula invoice.",
          },
          {
            key: "payment",
            label: "Payment is made",
            detail: "Payment proof is submitted against the issued invoice.",
          },
          {
            key: "buyer-agreement",
            label: "Ownership transfer",
            detail: "The buyer agreement and transfer record are finalized.",
          },
        ]
      : [
          {
            key: "invoice-details",
            label: "Submit invoice details",
            detail: "Billing information is captured for the Thula invoice.",
          },
          {
            key: "payment",
            label: "Payment is made",
            detail: "Payment proof is submitted against the issued invoice.",
          },
          {
            key: "payment-verified",
            label: "Payment verified",
            detail: "Thula confirms the payment before transfer documents are issued.",
          },
          {
            key: "buyer-agreement",
            label: "Ownership transfer",
            detail: "The buyer agreement and transfer record are finalized.",
          },
        ];

  return (
    <article className="transaction-detail">
      <div className="transaction-process-bar" aria-label="Transaction progress">
        <span className="transaction-process-bar__item transaction-process-bar__item--complete">
          Offer Details
        </span>
        {processSteps.map((step) => (
          <Link
            key={step.key}
            href={getTransactionStepHref(basePath, step.key)}
            className={`transaction-process-bar__item transaction-process-bar__item--${getProcessState(
              step.key,
              currentStep,
              role,
            )}${step.key === selectedStep ? " transaction-process-bar__item--selected" : ""}`}
          >
            {step.label}
          </Link>
        ))}
      </div>

      <section className="offer-packet">
        <aside className="offer-packet__aside">
          <div className="offer-packet__media">
            {listingImage ? (
              <Image
                src={listingImage}
                alt={transaction.listingModel}
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 420px"
              />
            ) : (
              <div className="offer-packet__media-fallback">{transaction.listingModel}</div>
            )}
          </div>

          <div className="offer-packet__figures">
            <div>
              <h5>Serial Number</h5>
              <strong>{listing?.serialLabel || listing?.code || transaction.listingSlug}</strong>
            </div>
            <div>
              <h5>Current List Price</h5>
              <strong>{offer?.currentListPrice ?? listing?.currentListPrice ?? "Pending"}</strong>
            </div>
            <div>
              <h5>Thula Service Fee</h5>
              <strong>{offer ? formatCurrency(offer.amount * thulaServiceFeeRate) : "Pending"}</strong>
            </div>
            <div>
              <h5>Your Offer</h5>
              <strong>{offer ? formatCurrency(offer.amount) : "Pending"}</strong>
            </div>
            <div className="offer-packet__total">
              <h5>Total Payable Now</h5>
              <strong>{payableNow}</strong>
            </div>
          </div>

          <div className="offer-packet__actions">
            {shouldCollectInvoiceDetails && continueLabel ? (
              <InvoiceDetailsModal
                transactionId={transaction.id}
                buttonLabel={continueLabel}
                defaults={{
                  fullName: transaction.billingFullName ?? transaction.userName,
                  companyName: transaction.billingCompanyName,
                  vatNumber: transaction.billingVatNumber,
                  billingAddress: transaction.billingAddress,
                  cellNumber: transaction.billingCellNumber ?? buyerPhone,
                  email: transaction.billingEmail ?? transaction.userEmail,
                }}
              />
            ) : role === "buyer" &&
              selectedStep === currentStep &&
              currentStep === "payment" &&
              continueLabel ? (
              <PaymentProofModal
                transactionId={transaction.id}
                buttonLabel={continueLabel}
                defaultReference={invoice?.invoiceNumber}
                invoiceNumber={invoice?.invoiceNumber}
              />
            ) : continueHref && continueLabel ? (
              <Link href={continueHref} className="button-primary button-primary--dark">
                {continueLabel}
              </Link>
            ) : null}
            {shouldShowBuyerAgreementDownload ? (
              <Link
                href={`/account/transactions/${transaction.id}/agreement/download`}
                className="button-secondary--outline"
              >
                Download Buyer Agreement
              </Link>
            ) : (
              <Link href={invoiceHref ?? basePath} className="button-secondary--outline">
                View Invoice
              </Link>
            )}
          </div>
        </aside>

        <div className="offer-packet__main">
          <div className="offer-packet__head">
            <div>
              <div className="thula-kicker">{kicker}</div>
              <h1>{title}</h1>
              <p>{listing?.code || transaction.listingSlug}</p>
            </div>
            <span className="fleet-status fleet-status--pending">
              {formatStatusLabel(transaction.status)}
            </span>
          </div>

          <div className="offer-packet__details">
            <div>
              <h5>Offer ID</h5>
              <strong>{formatOfferReference(offer?.id ?? transaction.offerId)}</strong>
            </div>
            <div>
              <h5>Offer Placed On</h5>
              <strong>{offer ? formatTimestamp(offer.createdAt) : "Pending"}</strong>
            </div>
            <div>
              <h5>Invoice Status</h5>
              <strong>{invoice?.status ?? "Pending"}</strong>
            </div>
            <div>
              <h5>Current Stage</h5>
              <strong>{getStepHeadline(role, currentStep)}</strong>
            </div>
          </div>

          <section className="offer-packet__how">
            <h2>How it works?</h2>
            <div className="offer-packet__how-grid">
              {processSteps.map((step) => (
                <div
                  key={step.key}
                  className={`offer-packet__how-step offer-packet__how-step--${getProcessState(
                    step.key,
                    currentStep,
                    role,
                  )}`}
                >
                  <span aria-hidden="true" />
                  <strong>{step.label}</strong>
                  <p>{step.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <p className="offer-packet__copy">{copy}</p>
        </div>
      </section>

      {role !== "buyer" ? (
        <div className="transaction-detail__layout">
          <aside className="transaction-detail__sidebar">
            <section className="transaction-detail__summary">
              <div className="transaction-stepper__header">
                <h3>Steps</h3>
                <p>All stages stay visible. Locked stages remain greyed out until reached.</p>
              </div>
              <div className="transaction-stepper">
                {visibleSteps.map((step, index) => {
                  const state =
                    index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming";
                  const isSelected = step.key === selectedStep;
                  const isClickable =
                    role === "admin" || role === "operator"
                      ? index === currentIndex
                      : index <= currentIndex;

                  return (
                    <div
                      key={step.key}
                      className={`transaction-stepper__item transaction-stepper__item--${state}${isSelected ? " transaction-stepper__item--selected" : ""}`}
                    >
                      <span className="transaction-stepper__index">{index + 1}</span>
                      <div>
                        <strong>{step.label}</strong>
                        <p>
                          {state === "complete"
                            ? "Completed"
                            : state === "current"
                              ? "Current"
                              : "Locked"}
                        </p>
                      </div>
                      {isClickable ? (
                        <Link
                          href={getTransactionStepHref(basePath, step.key)}
                          className="transaction-stepper__link"
                        >
                          {isSelected ? "Viewing" : "Open"}
                        </Link>
                      ) : (
                        <span className="transaction-stepper__lock">
                          {index < currentIndex ? "Complete" : "Locked"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>

          <div className="transaction-detail__content">
            <section className="transaction-detail__summary">
              <div className="account-card__grid">
                <div>
                  <h5>Listing</h5>
                  <strong>{transaction.listingModel}</strong>
                </div>
                <div>
                  <h5>Reference</h5>
                  <strong>{transaction.id}</strong>
                </div>
                <div>
                  <h5>Buyer</h5>
                  <strong>{transaction.userName}</strong>
                </div>
                <div>
                  <h5>Current Stage</h5>
                  <strong>{getStepHeadline(role, currentStep)}</strong>
                </div>
              </div>

              <div className="transaction-step-nav">
                {previousStep ? (
                  <Link
                    href={getTransactionStepHref(basePath, previousStep.key)}
                    className="site-nav__button"
                  >
                    Previous Step
                  </Link>
                ) : (
                  <span />
                )}
                {selectedStep !== currentStep ? (
                  <Link
                    href={getTransactionStepHref(basePath, currentStep)}
                    className="site-nav__button"
                  >
                    Return To Current Step
                  </Link>
                ) : null}
                {nextStep && selectedIndex < currentIndex ? (
                  <Link
                    href={getTransactionStepHref(basePath, nextStep.key)}
                    className="site-nav__button"
                  >
                    Next Recorded Step
                  </Link>
                ) : null}
                {invoiceHref ? (
                  <Link href={invoiceHref} className="site-nav__button">
                    Open Invoice View
                  </Link>
                ) : null}
              </div>
            </section>

            <div className="transaction-detail__panels">
              <section className="transaction-panel transaction-panel--focus">
                <div className="transaction-panel__head">
                  <h3>{getStepHeadline(role, selectedStep)}</h3>
                  <p>{getStepDescription(role, selectedStep)}</p>
                </div>
                <div className="account-card__grid">
                  {stepFacts.map((item) => (
                    <div key={item.label}>
                      <h5>{item.label}</h5>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
                {(selectedStep === currentStep || role === "admin" || role === "operator") && actions ? (
                  <div className="transaction-panel__actions">{actions}</div>
                ) : null}
              </section>

              <section className="transaction-panel transaction-panel--supporting">
                <div className="transaction-panel__head">
                  <h3>Supporting context</h3>
                  <p>Previous evidence and recent movement stay available without taking over the page.</p>
                </div>

                <div className="account-card__grid">
                  <div>
                    <h5>Invoice Number</h5>
                    <strong>{invoice?.invoiceNumber ?? "Pending"}</strong>
                  </div>
                  <div>
                    <h5>Invoice Amount</h5>
                    <strong>{invoice?.amount ?? "Pending"}</strong>
                  </div>
                  <div>
                    <h5>Documents Received</h5>
                    <strong>{String(currentDocuments.length)}</strong>
                  </div>
                  <div>
                    <h5>Latest Activity</h5>
                    <strong>{recentActivity[0] ? formatTimestamp(recentActivity[0].createdAt) : "Pending"}</strong>
                  </div>
                </div>

                <div className="transaction-supporting-columns">
                  <div className="transaction-mini-list">
                    <h5>Documents</h5>
                    {documents.length === 0 ? (
                      <p>No documents recorded yet.</p>
                    ) : (
                      documents.map((document) => (
                        <div key={document.id} className="transaction-mini-list__item">
                          <span>{document.name}</span>
                          <strong>{formatStatusLabel(document.status)}</strong>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="transaction-mini-list">
                    <h5>Recent Activity</h5>
                    {recentActivity.length === 0 ? (
                      <p>No activity recorded yet.</p>
                    ) : (
                      recentActivity.map((item) => (
                        <div key={item.id} className="transaction-mini-list__item">
                          <span>{item.message}</span>
                          <strong>{formatTimestamp(item.createdAt)}</strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
