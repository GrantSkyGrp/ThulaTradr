import { db } from "@/lib/db";

type TransactionRow = {
  id: string;
  offerId: string;
  listingSlug: string;
  listingModel: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: string;
  invoiceDetailsStatus: string;
  billingFullName: string | null;
  billingCompanyName: string | null;
  billingVatNumber: string | null;
  billingAddress: string | null;
  billingCellNumber: string | null;
  billingEmail: string | null;
  paymentProofStatus: string;
  paymentProofName: string | null;
  paymentProofContentType: string | null;
  paymentProofData: Uint8Array | null;
  sellerPayoutStatus: string | null;
  sellerPayoutReference: string | null;
  agreementStatus: string | null;
  agreementName: string | null;
  agreementContentType: string | null;
  agreementData: Uint8Array | null;
  ownershipTransferredAt: Date | null;
  createdAt: Date;
};

export type LocalUserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "seller" | "operator";
  verificationStatus: "pending" | "verified" | "rejected";
  referenceNumber: string;
  phone: string;
};

export type LocalOfferRecord = {
  id: string;
  listingSlug: string;
  listingModel: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currentListPrice: string;
  payableNow: string;
  status: "submitted" | "accepted" | "rejected";
  buyerTermsAccepted: boolean;
  createdAt: string;
};

export type LocalListingRecord = {
  slug: string;
  sellerId: string;
  sellerName: string;
  model: string;
  code: string;
  reservePrice: string;
  currentListPrice: string;
  serialLabel: string;
  status: "open" | "under-offer";
  verified: boolean;
  description: string;
  payableNowBase: number;
  serviceFeeRate: number;
  imageUrls: string[];
  updateRequestStatus: "none" | "pending";
};

export type LocalTransactionRecord = {
  id: string;
  offerId: string;
  listingSlug: string;
  listingModel: string;
  userId: string;
  userName: string;
  userEmail: string;
  status:
    | "awaiting-invoice-details"
    | "invoice-issued"
    | "payment-submitted"
    | "payment-verified"
    | "seller-paid"
    | "agreement-sent"
    | "completed";
  invoiceDetailsStatus: "pending" | "submitted";
  billingFullName: string;
  billingCompanyName: string;
  billingVatNumber: string;
  billingAddress: string;
  billingCellNumber: string;
  billingEmail: string;
  paymentProofStatus: "pending" | "uploaded" | "received";
  paymentProofName: string;
  paymentProofContentType: string;
  paymentProofData: Uint8Array | null;
  sellerPayoutStatus: "pending" | "received";
  sellerPayoutReference: string;
  agreementStatus: "pending" | "received";
  agreementName: string;
  agreementContentType: string;
  agreementData: Uint8Array | null;
  ownershipTransferredAt: string | null;
  createdAt: string;
};

export type LocalInvoiceRecord = {
  id: string;
  transactionId: string;
  invoiceNumber: string;
  amount: string;
  status: "pending-details" | "issued" | "payment-submitted" | "payment-verified";
  createdAt: string;
};

export type LocalInvoiceDetailsInput = {
  fullName: string;
  companyName: string;
  vatNumber: string;
  billingAddress: string;
  cellNumber: string;
  email: string;
};

export type LocalDocumentRecord = {
  id: string;
  transactionId: string;
  name: string;
  party: "buyer" | "admin";
  status: "pending" | "received";
};

export type LocalActivityRecord = {
  id: string;
  transactionId: string | null;
  offerId: string | null;
  userId: string | null;
  actorRole: "system" | "user" | "seller" | "admin" | "operator";
  eventType: string;
  message: string;
  createdAt: string;
};

export type LocalVerificationDocumentRecord = {
  id: string;
  userId: string;
  name: string;
  party: "user" | "seller";
  status: "pending" | "received";
  createdAt: string;
};

export type LocalListingUpdateRequestRecord = {
  id: string;
  listingSlug: string;
  sellerId: string;
  requestedDescription: string;
  requestedCurrentListPrice: string;
  requestedReservePrice: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type LocalPageContentRecord = {
  slug: "home" | "contact";
  title: string;
  description: string;
  eyebrow: string;
};

export type LocalContactRequestRecord = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "reviewed";
  createdAt: string;
};

export type LocalLeadRequestRecord = {
  id: string;
  type: "demo" | "bespoke" | "newsletter";
  name: string;
  email: string;
  note: string;
  status: "new" | "reviewed";
  createdAt: string;
};

export type LocalPartnerRecord = {
  id: string;
  name: string;
  category: string;
  status: "active" | "draft";
  createdAt: string;
};

export type LocalSiteSettingRecord = {
  id: "default";
  supportEmail: string;
  supportPhone: string;
  globalListPrice: string;
  testEmailStatus: "idle" | "sent";
};

export type LocalWalletTransactionRecord = {
  id: string;
  userId: string;
  type: "refund" | "top-up";
  amount: string;
  status: "pending" | "verified" | "rejected";
  proofName: string;
  createdAt: string;
};

const toListingStatus = (status: LocalListingRecord["status"]) =>
  status === "under-offer" ? "under_offer" : "open";
const fromListingStatus = (status: string): LocalListingRecord["status"] =>
  status === "under_offer" ? "under-offer" : "open";
const toTransactionStatus = (status: LocalTransactionRecord["status"]) =>
  (
    {
      "awaiting-invoice-details": "awaiting_invoice_details",
      "invoice-issued": "invoice_issued",
      "payment-submitted": "payment_submitted",
      "payment-verified": "payment_verified",
      "seller-paid": "seller_paid",
      "agreement-sent": "agreement_sent",
      completed: "completed",
    }[status]
  ) as
    | "awaiting_invoice_details"
    | "invoice_issued"
    | "payment_submitted"
    | "payment_verified"
    | "seller_paid"
    | "agreement_sent"
    | "completed";
const toInvoiceStatus = (status: LocalInvoiceRecord["status"]) =>
  (
    {
      "pending-details": "issued",
      issued: "issued",
      "payment-submitted": "paid_proof_pending",
      "payment-verified": "paid",
    }[status]
  ) as "issued" | "paid_proof_pending" | "paid";
const fromInvoiceStatus = (status: string): LocalInvoiceRecord["status"] =>
  (
    {
      paid_proof_pending: "payment-submitted",
      paid: "payment-verified",
    }[status] ?? status.replace(/_/g, "-")
  ) as LocalInvoiceRecord["status"];
const toSubmissionStatus = (
  status: "pending" | "submitted" | "uploaded" | "signed" | "received",
) => status;
const fromWalletType = (type: string): LocalWalletTransactionRecord["type"] =>
  type === "top_up" ? "top-up" : "refund";

function normalizeVehicleModel(model: string) {
  if (model.startsWith("Thula ESV")) {
    return "Thula ESV";
  }

  return model;
}

function mapUser(user: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  verificationStatus: string;
  referenceNumber: string;
  phone: string;
}): LocalUserRecord {
  return {
    ...user,
    role: user.role as LocalUserRecord["role"],
    verificationStatus: user.verificationStatus as LocalUserRecord["verificationStatus"],
  };
}

function mapListing(listing: {
  slug: string;
  sellerId: string;
  sellerName: string;
  model: string;
  code: string;
  reservePrice: string;
  currentListPrice: string;
  serialLabel: string;
  status: string;
  verified: boolean;
  description: string;
  payableNowBase: number;
  serviceFeeRate: number;
  imageUrls: unknown;
  updateRequestStatus: string;
}): LocalListingRecord {
  return {
    ...listing,
    model: normalizeVehicleModel(listing.model),
    status: fromListingStatus(listing.status),
    imageUrls: Array.isArray(listing.imageUrls) ? (listing.imageUrls as string[]) : [],
    updateRequestStatus: listing.updateRequestStatus === "pending" ? "pending" : "none",
  };
}

function mapOffer(offer: {
  id: string;
  listingSlug: string;
  listingModel: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currentListPrice: string;
  payableNow: string;
  status: string;
  buyerTermsAccepted: boolean;
  createdAt: Date;
}): LocalOfferRecord {
  return {
    ...offer,
    listingModel: normalizeVehicleModel(offer.listingModel),
    status: offer.status as LocalOfferRecord["status"],
    createdAt: offer.createdAt.toISOString(),
  };
}

function mapTransaction(transaction: TransactionRow): LocalTransactionRecord {
  const derivedStatus: LocalTransactionRecord["status"] = (
    {
      awaiting_invoice_details: "awaiting-invoice-details",
      offer_accepted: "awaiting-invoice-details",
      invoice_issued: "invoice-issued",
      payment_submitted: "payment-submitted",
      payment_verified: "payment-verified",
      seller_paid: "seller-paid",
      agreement_sent: "agreement-sent",
      completed: "completed",
    } as Record<string, LocalTransactionRecord["status"]>
  )[transaction.status] ?? (transaction.ownershipTransferredAt
    ? "completed"
    : transaction.agreementStatus === "received"
      ? "agreement-sent"
      : transaction.sellerPayoutStatus === "received"
        ? "seller-paid"
          : transaction.paymentProofStatus === "received"
            ? "payment-verified"
          : transaction.paymentProofStatus === "uploaded"
            ? "payment-submitted"
            : transaction.invoiceDetailsStatus === "submitted"
              ? "invoice-issued"
              : "awaiting-invoice-details");

  return {
    ...transaction,
    listingModel: normalizeVehicleModel(transaction.listingModel),
    status: derivedStatus,
    invoiceDetailsStatus: transaction.invoiceDetailsStatus as LocalTransactionRecord["invoiceDetailsStatus"],
    billingFullName: transaction.billingFullName ?? "",
    billingCompanyName: transaction.billingCompanyName ?? "",
    billingVatNumber: transaction.billingVatNumber ?? "",
    billingAddress: transaction.billingAddress ?? "",
    billingCellNumber: transaction.billingCellNumber ?? "",
    billingEmail: transaction.billingEmail ?? "",
    paymentProofStatus: transaction.paymentProofStatus as LocalTransactionRecord["paymentProofStatus"],
    paymentProofName: transaction.paymentProofName ?? "",
    paymentProofContentType: transaction.paymentProofContentType ?? "",
    paymentProofData: transaction.paymentProofData ?? null,
    sellerPayoutStatus: (transaction.sellerPayoutStatus ?? "pending") as LocalTransactionRecord["sellerPayoutStatus"],
    sellerPayoutReference: transaction.sellerPayoutReference ?? "",
    agreementStatus: (transaction.agreementStatus ?? "pending") as LocalTransactionRecord["agreementStatus"],
    agreementName: transaction.agreementName ?? "",
    agreementContentType: transaction.agreementContentType ?? "",
    agreementData: transaction.agreementData ?? null,
    ownershipTransferredAt: transaction.ownershipTransferredAt?.toISOString() ?? null,
    createdAt: transaction.createdAt.toISOString(),
  };
}

function mapInvoice(invoice: {
  id: string;
  transactionId: string;
  invoiceNumber: string;
  amount: string;
  status: string;
  createdAt: Date;
}): LocalInvoiceRecord {
  return {
    ...invoice,
    status: fromInvoiceStatus(invoice.status),
    createdAt: invoice.createdAt.toISOString(),
  };
}

function mapDocument(document: {
  id: string;
  transactionId: string;
  name: string;
  party: string;
  status: string;
}): LocalDocumentRecord {
  return {
    ...document,
    party: document.party as LocalDocumentRecord["party"],
    status: document.status as LocalDocumentRecord["status"],
  };
}

function mapActivity(activity: {
  id: string;
  transactionId: string | null;
  offerId: string | null;
  userId: string | null;
  actorRole: string;
  eventType: string;
  message: string;
  createdAt: Date;
}): LocalActivityRecord {
  return {
    ...activity,
    actorRole: activity.actorRole as LocalActivityRecord["actorRole"],
    createdAt: activity.createdAt.toISOString(),
  };
}

function mapVerificationDocument(document: {
  id: string;
  userId: string;
  name: string;
  party: string;
  status: string;
  createdAt: Date;
}): LocalVerificationDocumentRecord {
  return {
    ...document,
    party: document.party as LocalVerificationDocumentRecord["party"],
    status: document.status === "received" ? "received" : "pending",
    createdAt: document.createdAt.toISOString(),
  };
}

function mapListingUpdateRequest(request: {
  id: string;
  listingSlug: string;
  sellerId: string;
  requestedDescription: string;
  requestedCurrentListPrice: string;
  requestedReservePrice: string;
  status: string;
  createdAt: Date;
}): LocalListingUpdateRequestRecord {
  return {
    ...request,
    status: request.status as LocalListingUpdateRequestRecord["status"],
    createdAt: request.createdAt.toISOString(),
  };
}

function mapContactRequest(request: {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: Date;
}): LocalContactRequestRecord {
  return {
    ...request,
    status: request.status as LocalContactRequestRecord["status"],
    createdAt: request.createdAt.toISOString(),
  };
}

function mapLeadRequest(request: {
  id: string;
  type: string;
  name: string;
  email: string;
  note: string;
  status: string;
  createdAt: Date;
}): LocalLeadRequestRecord {
  return {
    ...request,
    type: request.type as LocalLeadRequestRecord["type"],
    status: request.status as LocalLeadRequestRecord["status"],
    createdAt: request.createdAt.toISOString(),
  };
}

function mapPartner(partner: {
  id: string;
  name: string;
  category: string;
  status: string;
  createdAt: Date;
}): LocalPartnerRecord {
  return {
    ...partner,
    status: partner.status as LocalPartnerRecord["status"],
    createdAt: partner.createdAt.toISOString(),
  };
}

function mapWalletTransaction(transaction: {
  id: string;
  userId: string;
  type: string;
  amount: string;
  status: string;
  proofName: string;
  createdAt: Date;
}): LocalWalletTransactionRecord {
  return {
    ...transaction,
    type: fromWalletType(transaction.type),
    status: transaction.status as LocalWalletTransactionRecord["status"],
    createdAt: transaction.createdAt.toISOString(),
  };
}

function withGlobalListPrice(
  listing: LocalListingRecord,
  globalListPrice: string | null,
): LocalListingRecord {
  return {
    ...listing,
    currentListPrice: globalListPrice?.trim() || listing.currentListPrice,
  };
}

async function createActivityEntry(entry: Omit<LocalActivityRecord, "id" | "createdAt">) {
  await db.activityLog.create({
    data: {
      id: `activity-${crypto.randomUUID()}`,
      transactionId: entry.transactionId,
      offerId: entry.offerId,
      userId: entry.userId,
      actorRole: entry.actorRole,
      eventType: entry.eventType,
      message: entry.message,
    },
  });
}

async function updateTransactionDocumentStatusByName(
  transactionId: string,
  name: string,
  status: LocalDocumentRecord["status"],
) {
  await db.document.updateMany({
    where: { transactionId, name },
    data: { status: toSubmissionStatus(status) },
  });
}

function toPrismaBytes(data: Uint8Array): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(data.byteLength);
  bytes.set(data);
  return bytes;
}

async function getTransactionsWhere(
  whereSql: string,
  values: unknown[] = [],
): Promise<LocalTransactionRecord[]> {
  const rows = await db.$queryRawUnsafe<TransactionRow[]>(
    `
      SELECT
        id,
        "offerId" as "offerId",
        "listingSlug" as "listingSlug",
        "listingModel" as "listingModel",
        "userId" as "userId",
        "userName" as "userName",
        "userEmail" as "userEmail",
        status,
        "invoiceDetailsStatus" as "invoiceDetailsStatus",
        "billingFullName" as "billingFullName",
        "billingCompanyName" as "billingCompanyName",
        "billingVatNumber" as "billingVatNumber",
        "billingAddress" as "billingAddress",
        "billingCellNumber" as "billingCellNumber",
        "billingEmail" as "billingEmail",
        "paymentProofStatus" as "paymentProofStatus",
        "paymentProofName" as "paymentProofName",
        "paymentProofContentType" as "paymentProofContentType",
        "paymentProofData" as "paymentProofData",
        "sellerPayoutStatus" as "sellerPayoutStatus",
        "sellerPayoutReference" as "sellerPayoutReference",
        "agreementStatus" as "agreementStatus",
        "agreementName" as "agreementName",
        "agreementContentType" as "agreementContentType",
        "agreementData" as "agreementData",
        "ownershipTransferredAt" as "ownershipTransferredAt",
        "createdAt" as "createdAt"
      FROM "Transaction"
      ${whereSql}
    `,
    ...values,
  );

  return rows.map(mapTransaction);
}

export async function findUserByEmail(email: string): Promise<LocalUserRecord | null> {
  const user = await db.user.findUnique({ where: { email } });
  return user ? mapUser(user) : null;
}

export async function findUserById(id: string): Promise<LocalUserRecord | null> {
  const user = await db.user.findUnique({ where: { id } });
  return user ? mapUser(user) : null;
}

export async function createOffer(
  input: Omit<LocalOfferRecord, "id" | "status" | "buyerTermsAccepted" | "createdAt">,
): Promise<LocalOfferRecord> {
  const listing = await db.listing.findUnique({ where: { slug: input.listingSlug } });
  const offer = await db.offer.create({
    data: {
      id: `offer-${crypto.randomUUID()}`,
      listingSlug: input.listingSlug,
      listingModel: input.listingModel,
      userId: input.userId,
      userName: input.userName,
      userEmail: input.userEmail,
      amount: input.amount,
      currentListPrice: input.currentListPrice,
      payableNow: input.payableNow,
      status: "submitted",
      buyerTermsAccepted: true,
    },
  });

  if (listing) {
    await db.listing.update({
      where: { slug: input.listingSlug },
      data: { status: "under_offer" },
    });
  }

  await createActivityEntry({
    transactionId: null,
    offerId: offer.id,
    userId: input.userId,
    actorRole: "user",
    eventType: "offer-submitted",
    message: `Offer submitted for ${input.listingModel}.`,
  });

  if (listing) {
    await createActivityEntry({
      transactionId: null,
      offerId: offer.id,
      userId: listing.sellerId,
      actorRole: "system",
      eventType: "offer-received",
      message: `New offer received for ${input.listingModel} from ${input.userName}.`,
    });
  }

  return mapOffer(offer);
}

export async function getOffersByUserId(userId: string): Promise<LocalOfferRecord[]> {
  const offers = await db.offer.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return offers.map(mapOffer);
}

export async function getAllOffers(): Promise<LocalOfferRecord[]> {
  const offers = await db.offer.findMany({ orderBy: { createdAt: "desc" } });
  return offers.map(mapOffer);
}

export async function updateListingStatus(slug: string, status: LocalListingRecord["status"]) {
  await db.listing.update({
    where: { slug },
    data: { status: toListingStatus(status) },
  });
}

export async function updateOfferStatus(
  id: string,
  status: LocalOfferRecord["status"],
  actorRole: LocalActivityRecord["actorRole"] = "admin",
) {
  const offer = await db.offer.update({
    where: { id },
    data: { status },
  });

  await createActivityEntry({
    transactionId: null,
    offerId: offer.id,
    userId: offer.userId,
    actorRole,
    eventType: "offer-status-updated",
    message: `Offer status changed to ${status}.`,
  });

  const listing = await db.listing.findUnique({ where: { slug: offer.listingSlug } });
  if (status === "accepted") {
    await db.listing.update({
      where: { slug: offer.listingSlug },
      data: { status: "under_offer" },
    });

    if (listing) {
      await createActivityEntry({
        transactionId: null,
        offerId: offer.id,
        userId: listing.sellerId,
        actorRole,
        eventType: "offer-accepted-seller-confirmation",
        message: `Offer accepted for ${offer.listingModel}.`,
      });
    }
  }

  if (status === "rejected" && listing) {
    const acceptedOfferCount = await db.offer.count({
      where: {
        listingSlug: offer.listingSlug,
        status: "accepted",
        NOT: { id: offer.id },
      },
    });

    if (acceptedOfferCount === 0) {
      await db.listing.update({
        where: { slug: offer.listingSlug },
        data: { status: "open" },
      });
    }
  }
}

export async function updateOfferAmount(
  id: string,
  amount: number,
  payableNow: string,
  actorRole: LocalActivityRecord["actorRole"] = "user",
) {
  const offer = await db.offer.update({
    where: { id },
    data: {
      amount,
      payableNow,
      status: "submitted",
    },
  });

  await createActivityEntry({
    transactionId: null,
    offerId: offer.id,
    userId: offer.userId,
    actorRole,
    eventType: "offer-amount-updated",
    message: `Offer updated for ${offer.listingModel}.`,
  });

  return mapOffer(offer);
}

export async function updateOfferBuyerTermsAccepted(id: string, accepted: boolean) {
  const offer = await db.offer.update({
    where: { id },
    data: { buyerTermsAccepted: accepted },
  });

  await createActivityEntry({
    transactionId: null,
    offerId: id,
    userId: offer.userId,
    actorRole: "user",
    eventType: "buyer-terms-updated",
    message: accepted ? "Buyer terms accepted." : "Buyer terms reset.",
  });
}

export async function getOfferById(id: string): Promise<LocalOfferRecord | null> {
  const offer = await db.offer.findUnique({ where: { id } });
  return offer ? mapOffer(offer) : null;
}

export async function getAllListings(): Promise<LocalListingRecord[]> {
  const settings = await getSiteSettings();
  const listings = await db.listing.findMany({ orderBy: { model: "asc" } });
  return listings.map((listing) =>
    withGlobalListPrice(mapListing(listing), settings?.globalListPrice ?? null),
  );
}

export async function getListingBySlug(slug: string): Promise<LocalListingRecord | null> {
  const settings = await getSiteSettings();
  const listing = await db.listing.findUnique({ where: { slug } });
  return listing
    ? withGlobalListPrice(mapListing(listing), settings?.globalListPrice ?? null)
    : null;
}

export async function ensureTransactionForAcceptedOffer(
  offerId: string,
): Promise<LocalTransactionRecord | null> {
  const existing = await getTransactionsWhere('WHERE "offerId" = $1', [offerId]);
  if (existing[0]) {
    return existing[0];
  }

  const offer = await db.offer.findUnique({ where: { id: offerId } });
  if (!offer || offer.status !== "accepted") {
    return null;
  }

  const transactionId = `transaction-${crypto.randomUUID()}`;

  await db.$executeRaw`
    INSERT INTO "Transaction" (
      id, "offerId", "listingSlug", "listingModel", "userId", "userName", "userEmail",
      status, "invoiceDetailsStatus", "billingFullName", "billingCompanyName", "billingVatNumber",
      "billingAddress", "billingCellNumber", "billingEmail", "paymentProofStatus", "paymentProofName",
      "paymentProofContentType", "paymentProofData",
      "sellerPayoutStatus", "sellerPayoutReference", "agreementStatus", "agreementName",
      "agreementContentType", "agreementData", "ownershipTransferredAt"
    ) VALUES (
      ${transactionId}, ${offer.id}, ${offer.listingSlug}, ${offer.listingModel}, ${offer.userId}, ${offer.userName}, ${offer.userEmail},
      ${"awaiting_invoice_details"}, ${"pending"}, ${""}, ${""}, ${""},
      ${""}, ${""}, ${""}, ${"pending"}, ${""},
      ${""}, ${null},
      ${"pending"}, ${""}, ${"pending"}, ${""},
      ${""}, ${null}, ${null}
    )
  `;

  await db.document.createMany({
    data: [
      {
        id: `document-${crypto.randomUUID()}`,
        transactionId,
        name: "Proof of Payment",
        party: "buyer",
        status: "pending",
      },
      {
        id: `document-${crypto.randomUUID()}`,
        transactionId,
        name: "Buyer Agreement",
        party: "admin",
        status: "pending",
      },
    ],
  });

  await createActivityEntry({
    transactionId,
    offerId: offer.id,
    userId: offer.userId,
    actorRole: "system",
    eventType: "transaction-created",
    message: `Offer accepted. Invoice details are now required for ${offer.listingModel}.`,
  });

  const listing = await db.listing.findUnique({ where: { slug: offer.listingSlug } });
  if (listing) {
    await createActivityEntry({
      transactionId,
      offerId: offer.id,
      userId: listing.sellerId,
      actorRole: "system",
      eventType: "transaction-opened-for-seller",
      message: `Transaction opened for ${offer.listingModel}. Awaiting buyer invoice details.`,
    });
  }

  const created = await getTransactionsWhere('WHERE id = $1', [transactionId]);
  return created[0] ?? null;
}

export async function getTransactionsByUserId(userId: string): Promise<LocalTransactionRecord[]> {
  return getTransactionsWhere('WHERE "userId" = $1 ORDER BY "createdAt" DESC', [userId]);
}

export async function getAllTransactions(): Promise<LocalTransactionRecord[]> {
  return getTransactionsWhere('ORDER BY "createdAt" DESC');
}

export async function getTransactionById(id: string): Promise<LocalTransactionRecord | null> {
  const transactions = await getTransactionsWhere("WHERE id = $1", [id]);
  return transactions[0] ?? null;
}

export async function getInvoiceByTransactionId(
  transactionId: string,
): Promise<LocalInvoiceRecord | null> {
  const invoice = await db.invoice.findUnique({ where: { transactionId } });
  return invoice ? mapInvoice(invoice) : null;
}

export async function getDocumentsByTransactionId(
  transactionId: string,
): Promise<LocalDocumentRecord[]> {
  const documents = await db.document.findMany({
    where: { transactionId },
    orderBy: { name: "asc" },
  });
  return documents.map(mapDocument);
}

export async function updateTransactionStatus(
  id: string,
  status: LocalTransactionRecord["status"],
  actorRole: LocalActivityRecord["actorRole"] = "admin",
) {
  const transaction = await db.transaction.update({
    where: { id },
    data: { status: toTransactionStatus(status) },
  });

  await createActivityEntry({
    transactionId: id,
    offerId: transaction.offerId,
    userId: transaction.userId,
    actorRole,
    eventType: "transaction-status-updated",
    message: `Transaction moved to ${status}.`,
  });
}

export async function submitTransactionInvoiceDetails(
  transactionId: string,
  details: LocalInvoiceDetailsInput,
) {
  await db.$executeRaw`
    UPDATE "Transaction"
    SET
      status = ${"invoice_issued"},
      "invoiceDetailsStatus" = ${"submitted"},
      "billingFullName" = ${details.fullName},
      "billingCompanyName" = ${details.companyName},
      "billingVatNumber" = ${details.vatNumber},
      "billingAddress" = ${details.billingAddress},
      "billingCellNumber" = ${details.cellNumber},
      "billingEmail" = ${details.email}
    WHERE id = ${transactionId}
  `;

  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    return;
  }

  const offer = await db.offer.findUnique({ where: { id: transaction.offerId } });
  const existingInvoice = await db.invoice.findUnique({ where: { transactionId } });
  const invoiceNumber = existingInvoice?.invoiceNumber ?? (await getNextInvoiceNumber());

  await db.invoice.upsert({
    where: { transactionId },
    update: {
      invoiceNumber,
      amount: offer?.payableNow ?? "Pending",
      status: "issued",
    },
    create: {
      id: `invoice-${crypto.randomUUID()}`,
      transactionId,
      invoiceNumber,
      amount: offer?.payableNow ?? "Pending",
      status: "issued",
    },
  });

  await createActivityEntry({
    transactionId,
    offerId: transaction.offerId,
    userId: transaction.userId,
    actorRole: "user",
    eventType: "invoice-details-submitted",
    message: "Invoice details submitted. Thula invoice issued for payment.",
  });
}

async function getNextInvoiceNumber() {
  const invoices = await db.invoice.findMany({
    select: { invoiceNumber: true },
  });
  const highestInvoiceNumber = invoices.reduce((highest, invoice) => {
    const match = /^TT-INV-(\d{5})$/.exec(invoice.invoiceNumber);
    if (!match) {
      return highest;
    }

    return Math.max(highest, Number(match[1]));
  }, 0);

  return `TT-INV-${String(highestInvoiceNumber + 1).padStart(5, "0")}`;
}

export async function submitPaymentProof(
  transactionId: string,
  proofName: string,
  contentType: string,
  data: Buffer,
) {
  const transaction = await db.transaction.update({
    where: { id: transactionId },
    data: {
      status: "payment_submitted",
      paymentProofStatus: "uploaded",
      paymentProofName: proofName,
      paymentProofContentType: contentType,
      paymentProofData: toPrismaBytes(data),
    },
  });

  await db.invoice.update({
    where: { transactionId },
    data: { status: "paid_proof_pending" },
  });

  await createActivityEntry({
    transactionId,
    offerId: transaction.offerId,
    userId: transaction.userId,
    actorRole: "user",
    eventType: "payment-proof-uploaded",
    message: `${proofName} uploaded as payment proof.`,
  });
}

export async function updateInvoiceStatus(
  transactionId: string,
  status: LocalInvoiceRecord["status"],
  actorRole: LocalActivityRecord["actorRole"] = "admin",
) {
  const invoice = await db.invoice.update({
    where: { transactionId },
    data: { status: toInvoiceStatus(status) },
  });

  const transaction = await getTransactionById(transactionId);
  await createActivityEntry({
    transactionId,
    offerId: transaction?.offerId ?? null,
    userId: transaction?.userId ?? null,
    actorRole,
    eventType: "invoice-status-updated",
    message: `Invoice status changed to ${status}.`,
  });

  return mapInvoice(invoice);
}

export async function verifyTransactionPayment(
  transactionId: string,
  actorRole: LocalActivityRecord["actorRole"] = "admin",
) {
  const transaction = await db.transaction.update({
    where: { id: transactionId },
    data: {
      status: "payment_verified",
      paymentProofStatus: "received",
    },
  });

  await db.invoice.update({
    where: { transactionId },
    data: { status: "paid" },
  });

  await updateTransactionDocumentStatusByName(transactionId, "Proof of Payment", "received");

  await createActivityEntry({
    transactionId,
    offerId: transaction.offerId,
    userId: transaction.userId,
    actorRole,
    eventType: "payment-verified",
    message: "Payment verified by admin. Seller payout can now be processed.",
  });
}

export async function declineTransactionPaymentProof(
  transactionId: string,
  actorRole: LocalActivityRecord["actorRole"] = "admin",
) {
  const transaction = await db.transaction.update({
    where: { id: transactionId },
    data: {
      status: "invoice_issued",
      paymentProofStatus: "pending",
      paymentProofName: "",
      paymentProofContentType: "",
      paymentProofData: null,
    },
  });

  await db.invoice.update({
    where: { transactionId },
    data: { status: "issued" },
  });

  await updateTransactionDocumentStatusByName(transactionId, "Proof of Payment", "pending");

  await createActivityEntry({
    transactionId,
    offerId: transaction.offerId,
    userId: transaction.userId,
    actorRole,
    eventType: "payment-proof-declined",
    message: "Payment proof declined by admin. Buyer must upload a new proof of payment.",
  });
}

export async function issueBuyerAgreement(
  transactionId: string,
  agreementName: string,
  contentType: string,
  data: Buffer,
  actorRole: LocalActivityRecord["actorRole"] = "admin",
) {
  await db.transaction.update({
    where: { id: transactionId },
    data: {
      status: "agreement_sent",
      agreementStatus: "received",
      agreementName,
      agreementContentType: contentType,
      agreementData: toPrismaBytes(data),
    },
  });

  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    return;
  }

  await updateTransactionDocumentStatusByName(transactionId, "Buyer Agreement", "received");
  await db.document.upsert({
    where: { id: `document-${transactionId}-buyer-agreement-file` },
    update: {
      name: agreementName,
      status: "received",
    },
    create: {
      id: `document-${transactionId}-buyer-agreement-file`,
      transactionId,
      name: agreementName,
      party: "admin",
      status: "received",
    },
  });

  await createActivityEntry({
    transactionId,
    offerId: transaction.offerId,
    userId: transaction.userId,
    actorRole,
    eventType: "buyer-agreement-issued",
    message: `${agreementName} issued to buyer.`,
  });
}

export async function closeTransaction(
  transactionId: string,
  actorRole: LocalActivityRecord["actorRole"] = "admin",
) {
  await db.$executeRaw`
    UPDATE "Transaction"
    SET
      status = ${"completed"},
      "ownershipTransferredAt" = ${new Date()}
    WHERE id = ${transactionId}
  `;

  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    return;
  }

  await createActivityEntry({
    transactionId,
    offerId: transaction.offerId,
    userId: transaction.userId,
    actorRole,
    eventType: "transaction-closed",
    message: `Transaction closed. Buyer now owns ${transaction.listingModel}.`,
  });
}

export async function updateDocumentStatus(
  id: string,
  status: LocalDocumentRecord["status"],
  actorRole: LocalActivityRecord["actorRole"] = "admin",
) {
  const document = await db.document.update({
    where: { id },
    data: { status: toSubmissionStatus(status) },
  });

  const transaction = await getTransactionById(document.transactionId);
  await createActivityEntry({
    transactionId: document.transactionId,
    offerId: transaction?.offerId ?? null,
    userId: transaction?.userId ?? null,
    actorRole,
    eventType: "document-status-updated",
    message: `${document.name} was marked ${status}.`,
  });
}

export async function getListingsBySellerId(sellerId: string): Promise<LocalListingRecord[]> {
  const settings = await getSiteSettings();
  const listings = await db.listing.findMany({
    where: { sellerId },
    orderBy: { model: "asc" },
  });
  return listings.map((listing) =>
    withGlobalListPrice(mapListing(listing), settings?.globalListPrice ?? null),
  );
}

export async function createListingUpdateRequest(input: {
  listingSlug: string;
  sellerId: string;
  requestedDescription: string;
  requestedCurrentListPrice: string;
  requestedReservePrice: string;
}): Promise<LocalListingUpdateRequestRecord> {
  const request = await db.listingUpdateRequest.create({
    data: {
      id: `lur-${crypto.randomUUID()}`,
      listingSlug: input.listingSlug,
      sellerId: input.sellerId,
      requestedDescription: input.requestedDescription,
      requestedCurrentListPrice: input.requestedCurrentListPrice,
      requestedReservePrice: input.requestedReservePrice,
      status: "pending",
    },
  });

  await db.listing.update({
    where: { slug: input.listingSlug },
    data: { updateRequestStatus: "pending" },
  });

  await createActivityEntry({
    transactionId: null,
    offerId: null,
    userId: input.sellerId,
    actorRole: "seller",
    eventType: "listing-update-requested",
    message: `Listing update requested for ${input.listingSlug}.`,
  });

  return mapListingUpdateRequest(request);
}

export async function getListingUpdateRequests(): Promise<LocalListingUpdateRequestRecord[]> {
  const requests = await db.listingUpdateRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return requests.map(mapListingUpdateRequest);
}

export async function updateListingUpdateRequestStatus(
  id: string,
  status: LocalListingUpdateRequestRecord["status"],
) {
  const request = await db.listingUpdateRequest.update({
    where: { id },
    data: { status },
  });

  if (status === "approved") {
    await db.listing.update({
      where: { slug: request.listingSlug },
      data: {
        description: request.requestedDescription,
        reservePrice: request.requestedReservePrice,
        updateRequestStatus: "none",
      },
    });
  }

  if (status === "rejected") {
    await db.listing.update({
      where: { slug: request.listingSlug },
      data: { updateRequestStatus: "none" },
    });
  }

  await createActivityEntry({
    transactionId: null,
    offerId: null,
    userId: request.sellerId,
    actorRole: "admin",
    eventType: "listing-update-reviewed",
    message: `Listing update for ${request.listingSlug} was ${status}.`,
  });
}

export async function getTransactionsBySellerId(
  sellerId: string,
): Promise<LocalTransactionRecord[]> {
  return getTransactionsWhere(
    `WHERE "listingSlug" IN (SELECT slug FROM "Listing" WHERE "sellerId" = $1) ORDER BY "createdAt" DESC`,
    [sellerId],
  );
}

export async function getOffersBySellerId(sellerId: string): Promise<LocalOfferRecord[]> {
  const offers = await db.offer.findMany({
    where: { listing: { sellerId } },
    orderBy: { createdAt: "desc" },
  });
  return offers.map(mapOffer);
}

export async function getAllUsers(): Promise<LocalUserRecord[]> {
  const users = await db.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
  return users.map(mapUser);
}

export async function updateUserVerificationStatus(
  id: string,
  status: LocalUserRecord["verificationStatus"],
) {
  await db.user.update({
    where: { id },
    data: { verificationStatus: status },
  });

  await createActivityEntry({
    transactionId: null,
    offerId: null,
    userId: id,
    actorRole: "admin",
    eventType: "verification-status-updated",
    message: `User verification moved to ${status}.`,
  });
}

export async function getActivityByTransactionId(
  transactionId: string,
): Promise<LocalActivityRecord[]> {
  const activity = await db.activityLog.findMany({
    where: { transactionId },
    orderBy: { createdAt: "desc" },
  });
  return activity.map(mapActivity);
}

export async function getActivityByUserId(userId: string): Promise<LocalActivityRecord[]> {
  const activity = await db.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return activity.map(mapActivity);
}

export async function getRecentActivity(): Promise<LocalActivityRecord[]> {
  const activity = await db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
  });
  return activity.map(mapActivity);
}

export async function getVerificationDocumentsByUserId(
  userId: string,
): Promise<LocalVerificationDocumentRecord[]> {
  const documents = await db.verificationDocument.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return documents.map(mapVerificationDocument);
}

export async function createVerificationDocument(
  userId: string,
  party: LocalVerificationDocumentRecord["party"],
  name: string,
): Promise<LocalVerificationDocumentRecord> {
  const document = await db.verificationDocument.create({
    data: {
      id: `vdoc-${crypto.randomUUID()}`,
      userId,
      name,
      party,
      status: "pending",
    },
  });

  await createActivityEntry({
    transactionId: null,
    offerId: null,
    userId,
    actorRole: party,
    eventType: "verification-document-submitted",
    message: `${name} was submitted for verification review.`,
  });

  return mapVerificationDocument(document);
}

export async function updateVerificationDocumentStatus(
  id: string,
  status: LocalVerificationDocumentRecord["status"],
) {
  const document = await db.verificationDocument.update({
    where: { id },
    data: { status: toSubmissionStatus(status) },
  });

  await createActivityEntry({
    transactionId: null,
    offerId: null,
    userId: document.userId,
    actorRole: "admin",
    eventType: "verification-document-status-updated",
    message: `${document.name} was marked ${status}.`,
  });
}

export async function getPageContent(
  slug: LocalPageContentRecord["slug"],
): Promise<LocalPageContentRecord | null> {
  const content = await db.pageContent.findUnique({ where: { slug } });
  return content as LocalPageContentRecord | null;
}

export async function getAllPageContent(): Promise<LocalPageContentRecord[]> {
  const content = await db.pageContent.findMany({ orderBy: { slug: "asc" } });
  return content as LocalPageContentRecord[];
}

export async function updatePageContent(
  slug: LocalPageContentRecord["slug"],
  payload: Omit<LocalPageContentRecord, "slug">,
) {
  await db.pageContent.update({
    where: { slug },
    data: payload,
  });
}

export async function createContactRequest(input: {
  name: string;
  email: string;
  message: string;
}): Promise<LocalContactRequestRecord> {
  const request = await db.contactRequest.create({
    data: {
      id: `contact-${crypto.randomUUID()}`,
      name: input.name,
      email: input.email,
      message: input.message,
      status: "new",
    },
  });

  await createActivityEntry({
    transactionId: null,
    offerId: null,
    userId: null,
    actorRole: "system",
    eventType: "contact-request-created",
    message: `New contact enquiry received from ${request.name}.`,
  });

  return mapContactRequest(request);
}

export async function getAllContactRequests(): Promise<LocalContactRequestRecord[]> {
  const requests = await db.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return requests.map(mapContactRequest);
}

export async function updateContactRequestStatus(
  id: string,
  status: LocalContactRequestRecord["status"],
) {
  await db.contactRequest.update({
    where: { id },
    data: { status },
  });
}

export async function createLeadRequest(input: {
  type: LocalLeadRequestRecord["type"];
  name: string;
  email: string;
  note: string;
}): Promise<LocalLeadRequestRecord> {
  const request = await db.leadRequest.create({
    data: {
      id: `lead-${crypto.randomUUID()}`,
      type: input.type,
      name: input.name,
      email: input.email,
      note: input.note,
      status: "new",
    },
  });

  await createActivityEntry({
    transactionId: null,
    offerId: null,
    userId: null,
    actorRole: "system",
    eventType: "lead-request-created",
    message: `New ${request.type} lead received from ${request.name}.`,
  });

  return mapLeadRequest(request);
}

export async function getAllLeadRequests(): Promise<LocalLeadRequestRecord[]> {
  const requests = await db.leadRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return requests.map(mapLeadRequest);
}

export async function updateLeadRequestStatus(
  id: string,
  status: LocalLeadRequestRecord["status"],
) {
  await db.leadRequest.update({
    where: { id },
    data: { status },
  });
}

export async function getAllPartners(): Promise<LocalPartnerRecord[]> {
  const partners = await db.partner.findMany({
    orderBy: { createdAt: "desc" },
  });
  return partners.map(mapPartner);
}

export async function updatePartnerStatus(
  id: string,
  status: LocalPartnerRecord["status"],
) {
  await db.partner.update({
    where: { id },
    data: { status },
  });
}

export async function getSiteSettings(): Promise<LocalSiteSettingRecord | null> {
  const settings = await db.siteSetting.findUnique({ where: { id: "default" } });
  return settings
    ? ({
        id: "default",
        supportEmail: settings.supportEmail,
        supportPhone: settings.supportPhone,
        globalListPrice: settings.globalListPrice,
        testEmailStatus: settings.testEmailStatus as LocalSiteSettingRecord["testEmailStatus"],
      } satisfies LocalSiteSettingRecord)
    : null;
}

export async function updateSiteSettings(input: {
  supportEmail: string;
  supportPhone: string;
  globalListPrice: string;
}) {
  await db.siteSetting.update({
    where: { id: "default" },
    data: {
      supportEmail: input.supportEmail,
      supportPhone: input.supportPhone,
      globalListPrice: input.globalListPrice,
    },
  });
}

export async function sendTestEmailRecord() {
  await db.siteSetting.update({
    where: { id: "default" },
    data: { testEmailStatus: "sent" },
  });

  await createActivityEntry({
    transactionId: null,
    offerId: null,
    userId: null,
    actorRole: "admin",
    eventType: "test-email-sent",
    message: "A test email event was recorded from site settings.",
  });
}

export async function updateUserRole(id: string, role: LocalUserRecord["role"]) {
  await db.user.update({
    where: { id },
    data: { role },
  });

  await createActivityEntry({
    transactionId: null,
    offerId: null,
    userId: id,
    actorRole: "admin",
    eventType: "user-role-updated",
    message: `User role changed to ${role}.`,
  });
}

export async function getWalletTransactionsByUserId(
  userId: string,
): Promise<LocalWalletTransactionRecord[]> {
  const transactions = await db.walletTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return transactions.map(mapWalletTransaction);
}

export async function getAllWalletTransactions(): Promise<LocalWalletTransactionRecord[]> {
  const transactions = await db.walletTransaction.findMany({
    orderBy: { createdAt: "desc" },
  });
  return transactions.map(mapWalletTransaction);
}

export async function updateWalletTransactionStatus(
  id: string,
  status: LocalWalletTransactionRecord["status"],
) {
  const transaction = await db.walletTransaction.update({
    where: { id },
    data: { status },
  });

  await createActivityEntry({
    transactionId: null,
    offerId: null,
    userId: transaction.userId,
    actorRole: "admin",
    eventType: "wallet-transaction-updated",
    message: `${fromWalletType(transaction.type)} transaction moved to ${status}.`,
  });
}
