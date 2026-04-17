"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";

type AdminSuccessModalProps = {
  title: string;
  message: string;
  returnHref: string;
};

export function AdminSuccessModal({ title, message, returnHref }: AdminSuccessModalProps) {
  const router = useRouter();
  const titleId = useId();

  const closeModal = () => {
    router.replace(returnHref, { scroll: false });
  };

  return (
    <div className="invoice-modal" role="presentation">
      <button
        type="button"
        className="invoice-modal__backdrop"
        aria-label="Close success notification"
        onClick={closeModal}
      />
      <section
        className="invoice-modal__panel invoice-modal__panel--compact"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="invoice-modal__header">
          <div>
            <p className="thula-kicker">Success</p>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button
            type="button"
            className="invoice-modal__close"
            aria-label="Close success notification"
            onClick={closeModal}
          >
            x
          </button>
        </div>
        <p className="invoice-modal__success-copy">{message}</p>
        <div className="invoice-modal__actions">
          <button type="button" className="button-primary button-primary--dark" onClick={closeModal}>
            Continue
          </button>
        </div>
      </section>
    </div>
  );
}
