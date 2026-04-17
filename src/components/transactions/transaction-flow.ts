import type {
  LocalInvoiceRecord,
  LocalTransactionRecord,
} from "@/lib/local-db";

export type TransactionViewerRole = "buyer" | "seller" | "admin" | "operator";

export type TransactionStepKey =
  | "invoice-details"
  | "payment"
  | "payment-verified"
  | "buyer-agreement"
  | "completed";

export type TransactionStep = {
  key: TransactionStepKey;
  label: string;
};

const steps: TransactionStep[] = [
  { key: "invoice-details", label: "Invoice Details" },
  { key: "payment", label: "Payment" },
  { key: "payment-verified", label: "Payment Verified" },
  { key: "buyer-agreement", label: "Buyer Agreement" },
  { key: "completed", label: "Complete" },
];

const buyerSteps: TransactionStep[] = [
  { key: "invoice-details", label: "Invoice Details" },
  { key: "payment", label: "Payment is made" },
  { key: "buyer-agreement", label: "Ownership transfer" },
  { key: "completed", label: "Complete" },
];

export function getTransactionSteps(role?: TransactionViewerRole) {
  if (role === "buyer") {
    return buyerSteps;
  }

  return steps;
}

export function getCurrentTransactionStep(
  status: LocalTransactionRecord["status"],
  role?: TransactionViewerRole,
): TransactionStepKey {
  if (status === "awaiting-invoice-details") {
    return "invoice-details";
  }

  if (
    status === "invoice-issued" ||
    status === "payment-submitted" ||
    (role === "buyer" && status === "payment-verified")
  ) {
    return "payment";
  }

  if (status === "payment-verified") {
    return "payment-verified";
  }

  if (status === "seller-paid") {
    return "buyer-agreement";
  }

  if (status === "agreement-sent") {
    return "buyer-agreement";
  }

  return "completed";
}

export function resolveTransactionStep(
  status: LocalTransactionRecord["status"],
  requestedStep: string | string[] | undefined,
  role?: TransactionViewerRole,
): TransactionStepKey {
  const visibleSteps = getTransactionSteps(role);
  const currentStep = getCurrentTransactionStep(status, role);
  const currentIndex = visibleSteps.findIndex((step) => step.key === currentStep);
  const requestedValue = Array.isArray(requestedStep) ? requestedStep[0] : requestedStep;
  const requestedIndex = visibleSteps.findIndex((step) => step.key === requestedValue);

  if (requestedIndex === -1 || requestedIndex > currentIndex) {
    return currentStep;
  }

  return visibleSteps[requestedIndex].key;
}

export function getPreviousTransactionStep(
  step: TransactionStepKey,
  role?: TransactionViewerRole,
) {
  const visibleSteps = getTransactionSteps(role);
  const index = visibleSteps.findIndex((entry) => entry.key === step);
  if (index <= 0) {
    return null;
  }

  return visibleSteps[index - 1];
}

export function getNextTransactionStep(
  step: TransactionStepKey,
  role?: TransactionViewerRole,
) {
  const visibleSteps = getTransactionSteps(role);
  const index = visibleSteps.findIndex((entry) => entry.key === step);
  if (index === -1 || index >= visibleSteps.length - 1) {
    return null;
  }

  return visibleSteps[index + 1];
}

export function getTransactionStepHref(basePath: string, step: TransactionStepKey) {
  return `${basePath}?step=${step}`;
}

export function getBuyerContinueHref(
  transactionId: string,
  status: LocalTransactionRecord["status"],
) {
  if (status === "awaiting-invoice-details") {
    return `/account/transactions/${transactionId}/invoice-details`;
  }

  if (status === "invoice-issued" || status === "payment-submitted") {
    return `/account/transactions/${transactionId}/payment-proof`;
  }

  return null;
}

export function getBuyerContinueLabel(status: LocalTransactionRecord["status"]) {
  if (status === "awaiting-invoice-details") {
    return "Complete Invoice Details";
  }

  if (status === "invoice-issued") {
    return "Upload Proof Of Payment";
  }

  if (status === "payment-submitted") {
    return "Review Payment Submission";
  }

  return null;
}

export function getStepHeadline(
  role: TransactionViewerRole,
  step: TransactionStepKey,
) {
  const labels: Record<TransactionStepKey, string> = {
    "invoice-details": "Invoice details",
    payment: "Payment",
    "payment-verified": "Payment verified",
    "buyer-agreement": "Buyer agreement",
    completed: "Transaction complete",
  };

  if ((role === "admin" || role === "operator") && step === "buyer-agreement") {
    return "Issue buyer agreement";
  }

  return labels[step];
}

export function getStepDescription(
  role: TransactionViewerRole,
  step: TransactionStepKey,
) {
  const byRole: Record<TransactionViewerRole, Record<TransactionStepKey, string>> = {
    buyer: {
      "invoice-details": "Submit billing details so the invoice and payment stage can begin.",
      payment: "Review the invoice and complete the payment proof step.",
      "payment-verified": "Payment has been reviewed. No buyer action is required right now.",
      "buyer-agreement": "The agreement is ready or being finalized for buyer handover.",
      completed: "The operational flow has been completed and ownership transfer is recorded.",
    },
    seller: {
      "invoice-details": "Buyer billing details are being captured before payment processing starts.",
      payment: "Buyer payment is in progress and seller action is not required.",
      "payment-verified": "Payment has been verified and buyer agreement preparation can begin.",
      "buyer-agreement": "The buyer agreement is being issued.",
      completed: "The transaction has moved through agreement and closeout.",
    },
    admin: {
      "invoice-details": "Keep the transaction focused on the current operational checkpoint.",
      payment: "Review invoice and payment evidence only for this stage.",
      "payment-verified": "Payment is verified. The next operational action is buyer agreement upload.",
      "buyer-agreement": "Issue the buyer agreement from this step and then close the transfer.",
      completed: "The transaction has been closed out and archived as completed.",
    },
    operator: {
      "invoice-details": "Use the transfer view to stay on the active checkpoint only.",
      payment: "Payment review and proof visibility are limited to this step.",
      "payment-verified": "Payment is verified. The next checkpoint is buyer agreement upload.",
      "buyer-agreement": "Track agreement issue and final transfer readiness from here.",
      completed: "The transfer has completed all operational checkpoints.",
    },
  };

  return byRole[role][step];
}

export function getStepFacts(
  role: TransactionViewerRole,
  step: TransactionStepKey,
  transaction: LocalTransactionRecord,
  invoice: LocalInvoiceRecord | null,
) {
  const shared = {
    invoiceNumber: invoice?.invoiceNumber ?? "Pending",
    invoiceAmount: invoice?.amount ?? "Pending",
    invoiceStatus: invoice?.status ?? "Pending",
    paymentProof: transaction.paymentProofName || "Not submitted yet",
    agreementName: transaction.agreementName || "Pending",
    transferred: transaction.ownershipTransferredAt || "Pending",
  };

  const factsByStep: Record<TransactionStepKey, Array<{ label: string; value: string }>> = {
    "invoice-details": [
      { label: "Invoice Details Status", value: transaction.invoiceDetailsStatus },
      { label: "Billing Name", value: transaction.billingFullName || "Pending" },
      { label: "Billing Email", value: transaction.billingEmail || "Pending" },
      { label: "Billing Address", value: transaction.billingAddress || "Pending" },
    ],
    payment: [
      { label: "Invoice Number", value: shared.invoiceNumber },
      { label: "Invoice Amount", value: shared.invoiceAmount },
      { label: "Invoice Status", value: shared.invoiceStatus },
      { label: "Payment Proof", value: shared.paymentProof },
    ],
    "payment-verified": [
      { label: "Payment Proof Status", value: transaction.paymentProofStatus },
      { label: "Payment Proof", value: shared.paymentProof },
      { label: "Buyer Agreement Status", value: transaction.agreementStatus || "Pending" },
    ],
    "buyer-agreement": [
      { label: "Buyer Agreement Status", value: transaction.agreementStatus || "Pending" },
      { label: "Agreement Record", value: shared.agreementName },
      { label: "Workflow State", value: transaction.status },
    ],
    completed: [
      { label: "Agreement Record", value: shared.agreementName },
      { label: "Ownership Transfer", value: shared.transferred },
      { label: "Final Status", value: transaction.status },
    ],
  };

  if (role === "buyer" && step === "buyer-agreement") {
    factsByStep["buyer-agreement"][3] = {
      label: "Payment Proof",
      value: shared.paymentProof,
    };
  }

  return factsByStep[step];
}
