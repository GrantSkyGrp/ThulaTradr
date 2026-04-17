"use client";

import { useState } from "react";
import { issueBuyerAgreementAction } from "@/app/actions";

type AdminBuyerAgreementUploadFormProps = {
  transactionId: string;
  enabled: boolean;
};

export function AdminBuyerAgreementUploadForm({
  transactionId,
  enabled,
}: AdminBuyerAgreementUploadFormProps) {
  const [hasFile, setHasFile] = useState(false);

  return (
    <form action={issueBuyerAgreementAction} className="admin-inline-form">
      <input type="hidden" name="transactionId" value={transactionId} />
      <input
        type="file"
        name="agreementFile"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        required
        onChange={(event) => setHasFile(Boolean(event.currentTarget.files?.length))}
      />
      <button type="submit" className="site-nav__button" disabled={!enabled || !hasFile}>
        Upload Buyer Agreement
      </button>
    </form>
  );
}
