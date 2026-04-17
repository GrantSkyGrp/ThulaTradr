"use client";

import Link from "next/link";
import { useId, useState } from "react";
import {
  declineTransactionPaymentProofAction,
  verifyTransactionPaymentAction,
} from "@/app/actions";

type AdminPaymentProofModalProps = {
  transactionId: string;
  disabled?: boolean;
  proofName: string;
  invoiceNumber: string;
  invoiceAmount: string;
};

export function AdminPaymentProofModal({
  transactionId,
  disabled = false,
  proofName,
  invoiceNumber,
  invoiceAmount,
}: AdminPaymentProofModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  if (disabled) {
    return <span className="offer-row__button offer-row__button--disabled">Verify Payment</span>;
  }

  return (
    <>
      <button
        type="button"
        className="offer-row__button"
        onClick={() => setIsOpen(true)}
      >
        Verify Payment
      </button>

      {isOpen ? (
        <div className="invoice-modal" role="presentation">
          <button
            type="button"
            className="invoice-modal__backdrop"
            aria-label="Close payment proof review"
            onClick={() => setIsOpen(false)}
          />
          <section
            className="invoice-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="invoice-modal__header">
              <div>
                <p className="thula-kicker">Payment Proof</p>
                <h2 id={titleId}>Review proof of payment</h2>
              </div>
              <button
                type="button"
                className="invoice-modal__close"
                aria-label="Close payment proof review"
                onClick={() => setIsOpen(false)}
              >
                x
              </button>
            </div>

            <div className="invoice-details-readonly">
              <div>
                <h5>Proof Document</h5>
                <strong>{proofName}</strong>
              </div>
              <div>
                <h5>Invoice Number</h5>
                <strong>{invoiceNumber}</strong>
              </div>
              <div>
                <h5>Invoice Amount</h5>
                <strong>{invoiceAmount}</strong>
              </div>
              <div>
                <h5>Review Status</h5>
                <strong>Awaiting admin decision</strong>
              </div>
            </div>

            <div className="admin-proof-document-actions">
              <Link
                href={`/admin/transactions/${transactionId}/payment-proof/view`}
                className="button-secondary--outline"
                target="_blank"
              >
                View Proof
              </Link>
              <Link
                href={`/admin/transactions/${transactionId}/payment-proof/download`}
                className="button-secondary--outline"
              >
                Download Proof
              </Link>
            </div>

            <div className="invoice-modal__actions">
              <form action={verifyTransactionPaymentAction} onSubmit={() => setIsOpen(false)}>
                <input type="hidden" name="transactionId" value={transactionId} />
                <button type="submit" className="button-primary button-primary--dark">
                  Approve Payment
                </button>
              </form>
              <form action={declineTransactionPaymentProofAction} onSubmit={() => setIsOpen(false)}>
                <input type="hidden" name="transactionId" value={transactionId} />
                <button type="submit" className="button-secondary--outline">
                  Decline Payment
                </button>
              </form>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
