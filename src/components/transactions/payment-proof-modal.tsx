"use client";

import { useId, useState } from "react";
import { uploadPaymentProofAction } from "@/app/actions";

type PaymentProofModalProps = {
  transactionId: string;
  buttonLabel: string;
  defaultReference?: string | null;
  invoiceNumber?: string | null;
};

export function PaymentProofModal({
  transactionId,
  buttonLabel,
  defaultReference,
  invoiceNumber,
}: PaymentProofModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        className="button-primary button-primary--dark"
        onClick={() => setIsOpen(true)}
      >
        {buttonLabel}
      </button>

      {isOpen ? (
        <div className="invoice-modal" role="presentation">
          <button
            type="button"
            className="invoice-modal__backdrop"
            aria-label="Close proof of payment upload"
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
                <h2 id={titleId}>Upload proof of payment</h2>
              </div>
              <button
                type="button"
                className="invoice-modal__close"
                aria-label="Close proof of payment upload"
                onClick={() => setIsOpen(false)}
              >
                x
              </button>
            </div>

            <form action={uploadPaymentProofAction} className="invoice-modal__form">
              <input type="hidden" name="transactionId" value={transactionId} />

              <label>
                <span className="invoice-modal__label-text">
                  Upload Proof Of Payment
                </span>
                <input type="file" name="paymentProof" accept=".pdf,.png,.jpg,.jpeg" required />
              </label>

              <label>
                <span className="invoice-modal__label-text">
                  Reference {invoiceNumber ? `(Invoice Number = ${invoiceNumber})` : ""}
                </span>
                <input
                  type="text"
                  name="proofName"
                  defaultValue={defaultReference ?? invoiceNumber ?? ""}
                  placeholder={invoiceNumber ?? "Invoice number"}
                  required
                />
              </label>

              <div className="invoice-modal__actions">
                <button type="submit" className="button-primary button-primary--dark">
                  Submit Proof
                </button>
                <button
                  type="button"
                  className="button-secondary--outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
