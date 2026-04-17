"use client";

import { useId, useState } from "react";
import { submitInvoiceDetailsAction } from "@/app/actions";

type InvoiceDetailsModalProps = {
  transactionId: string;
  buttonLabel: string;
  defaults: {
    fullName?: string | null;
    companyName?: string | null;
    vatNumber?: string | null;
    billingAddress?: string | null;
    cellNumber?: string | null;
    email?: string | null;
  };
};

export function InvoiceDetailsModal({
  transactionId,
  buttonLabel,
  defaults,
}: InvoiceDetailsModalProps) {
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
            aria-label="Close invoice details"
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
                <p className="thula-kicker">Invoice Details</p>
                <h2 id={titleId}>Enter your billing details</h2>
              </div>
              <button
                type="button"
                className="invoice-modal__close"
                aria-label="Close invoice details"
                onClick={() => setIsOpen(false)}
              >
                x
              </button>
            </div>

            <form action={submitInvoiceDetailsAction} className="invoice-modal__form">
              <input type="hidden" name="transactionId" value={transactionId} />

              <label>
                <span className="invoice-modal__label-text">Full Name</span>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={defaults.fullName ?? ""}
                  required
                />
              </label>

              <label>
                <span className="invoice-modal__label-text">
                  Company Name <small>optional</small>
                </span>
                <input
                  type="text"
                  name="companyName"
                  defaultValue={defaults.companyName ?? ""}
                />
              </label>

              <label>
                <span className="invoice-modal__label-text">
                  VAT if registered <small>optional</small>
                </span>
                <input
                  type="text"
                  name="vatNumber"
                  defaultValue={defaults.vatNumber ?? ""}
                />
              </label>

              <label>
                <span className="invoice-modal__label-text">Billing Address</span>
                <textarea
                  name="billingAddress"
                  rows={4}
                  defaultValue={defaults.billingAddress ?? ""}
                  required
                />
              </label>

              <label>
                <span className="invoice-modal__label-text">Cell Number</span>
                <input
                  type="tel"
                  name="cellNumber"
                  defaultValue={defaults.cellNumber ?? ""}
                  required
                />
              </label>

              <label>
                <span className="invoice-modal__label-text">Email</span>
                <input
                  type="email"
                  name="email"
                  defaultValue={defaults.email ?? ""}
                  required
                />
              </label>

              <div className="invoice-modal__actions">
                <button type="submit" className="button-primary button-primary--dark">
                  Submit And Continue
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
