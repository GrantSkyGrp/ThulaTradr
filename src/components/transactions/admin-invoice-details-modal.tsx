"use client";

import Link from "next/link";
import { useId, useState } from "react";

type AdminInvoiceDetailsModalProps = {
  transactionId: string;
  disabled?: boolean;
  details: {
    listingModel: string;
    buyerName: string;
    buyerEmail: string;
    cellNumber: string;
    companyName: string;
    vatNumber: string;
    billingAddress: string;
    invoiceNumber: string;
    invoiceAmount: string;
  };
};

export function AdminInvoiceDetailsModal({
  transactionId,
  disabled = false,
  details,
}: AdminInvoiceDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  if (disabled) {
    return <span className="offer-row__button offer-row__button--disabled">View Invoice Details</span>;
  }

  return (
    <>
      <button
        type="button"
        className="offer-row__button"
        onClick={() => setIsOpen(true)}
      >
        View Invoice Details
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
                <h2 id={titleId}>{details.listingModel}</h2>
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

            <div className="invoice-details-readonly">
              <div>
                <h5>Buyer Name</h5>
                <strong>{details.buyerName}</strong>
              </div>
              <div>
                <h5>Email</h5>
                <strong>{details.buyerEmail}</strong>
              </div>
              <div>
                <h5>Cell Number</h5>
                <strong>{details.cellNumber}</strong>
              </div>
              <div>
                <h5>Company Name</h5>
                <strong>{details.companyName}</strong>
              </div>
              <div>
                <h5>VAT Number</h5>
                <strong>{details.vatNumber}</strong>
              </div>
              <div>
                <h5>Invoice Number</h5>
                <strong>{details.invoiceNumber}</strong>
              </div>
              <div>
                <h5>Invoice Amount</h5>
                <strong>{details.invoiceAmount}</strong>
              </div>
              <div className="invoice-details-readonly__wide">
                <h5>Billing Address</h5>
                <strong>{details.billingAddress}</strong>
              </div>
            </div>

            <div className="invoice-modal__actions">
              <Link
                href={`/admin/transactions/${transactionId}/invoice/pdf`}
                className="button-secondary--outline"
                target="_blank"
              >
                View Invoice
              </Link>
              <Link
                href={`/admin/transactions/${transactionId}/invoice/pdf?download=1`}
                className="button-primary button-primary--dark"
              >
                Download Invoice
              </Link>
              <Link
                href={`/admin/transactions/${transactionId}/invoice-details/download`}
                className="button-secondary--outline"
              >
                Download Invoice Details
              </Link>
              <button
                type="button"
                className="button-secondary--outline"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
