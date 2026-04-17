"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin, requireAdminOrOperator, requireUser, sessionCookieName } from "@/lib/auth";
import { getAgreementContentType } from "@/lib/agreement-storage";
import { formatCurrency, parseCurrency } from "@/lib/marketplace/format";
import { getPaymentProofContentType } from "@/lib/payment-proof-storage";
import {
  findUserByEmail,
  createOffer,
  updateListingStatus,
  updateOfferStatus,
  updateOfferAmount,
  ensureTransactionForAcceptedOffer,
  updateTransactionStatus,
  updateInvoiceStatus,
  updateDocumentStatus,
  updateUserVerificationStatus,
  createVerificationDocument,
  updateVerificationDocumentStatus,
  createListingUpdateRequest,
  updateListingUpdateRequestStatus,
  findUserById,
  updateOfferBuyerTermsAccepted,
  submitTransactionInvoiceDetails,
  submitPaymentProof,
  updatePageContent,
  createContactRequest,
  updateContactRequestStatus,
  updateLeadRequestStatus,
  updatePartnerStatus,
  updateSiteSettings,
  sendTestEmailRecord,
  updateUserRole,
  updateWalletTransactionStatus,
  getListingBySlug,
  getSiteSettings,
  getOfferById,
  verifyTransactionPayment,
  declineTransactionPaymentProof,
  issueBuyerAgreement,
  closeTransaction,
} from "@/lib/local-db";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  let user;

  try {
    user = await findUserByEmail(email);
  } catch (error) {
    console.error("Login database lookup failed", error);
    redirect("/login?error=server");
  }

  if (!user || user.password !== password) {
    redirect("/login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/account/offers");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
  redirect("/");
}

export async function submitOfferAction(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get(sessionCookieName)?.value;
  const listingSlug = String(formData.get("listingSlug") ?? "");

  if (!userId) {
    redirect("/login");
  }

  const user = await findUserByEmail(String(formData.get("userEmail") ?? ""));
  if (!user || user.id !== userId) {
    redirect("/login");
  }

  const listing = await getListingBySlug(listingSlug);
  const settings = await getSiteSettings();
  if (!listing) {
    redirect("/marketplace?error=missing-listing");
  }

  const rawAmount = String(formData.get("amount") ?? "").trim();
  const amount = Number(rawAmount.replace(/[^\d]/g, "") || 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    redirect(`/marketplace/${listingSlug}?error=invalid-offer`);
  }

  const currentListPrice = settings?.globalListPrice ?? listing.currentListPrice;
  const listPrice = parseCurrency(currentListPrice);
  if (amount < listPrice) {
    redirect(`/marketplace/${listingSlug}?error=invalid-offer`);
  }

  const totalCost = amount;
  const serviceFee = totalCost * 0.015;
  const payableNow = formatCurrency(amount - listPrice + serviceFee);

  await createOffer({
    listingSlug,
    listingModel: String(formData.get("listingModel") ?? ""),
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    amount: totalCost,
    currentListPrice,
    payableNow,
  });

  redirect("/account/offers");
}

export async function updateBuyerOfferAction(formData: FormData) {
  const user = await requireUser();
  const offerId = String(formData.get("offerId") ?? "");
  const rawAmount = String(formData.get("amount") ?? "").trim();
  const amount = Number(rawAmount.replace(/[^\d]/g, "") || 0);
  const offer = offerId ? await getOfferById(offerId) : null;

  if (!offer || offer.userId !== user.id || offer.status !== "submitted") {
    redirect("/account/offers");
  }

  const listing = await getListingBySlug(offer.listingSlug);
  const settings = await getSiteSettings();

  if (!listing) {
    redirect("/account/offers?error=missing-listing");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    redirect(`/account/offers/${offer.id}/edit?error=invalid-offer`);
  }

  const currentListPrice = settings?.globalListPrice ?? listing.currentListPrice;
  const listPrice = parseCurrency(currentListPrice);

  if (amount < listPrice) {
    redirect(`/account/offers/${offer.id}/edit?error=invalid-offer`);
  }

  const serviceFee = amount * 0.015;
  const payableNow = formatCurrency(amount - listPrice + serviceFee);

  await updateOfferAmount(offer.id, amount, payableNow, "user");

  revalidatePath("/account/offers");
  revalidatePath(`/account/offers/${offer.id}/edit`);
  redirect("/account/offers");
}

export async function updateListingStatusAction(formData: FormData) {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "");
  const status = String(formData.get("status") ?? "") as "open" | "under-offer";

  if (slug && (status === "open" || status === "under-offer")) {
    await updateListingStatus(slug, status);
  }

  redirect("/admin/listings");
}

export async function updateOfferStatusAction(formData: FormData) {
  const user = await requireUser();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as
    | "submitted"
    | "accepted"
    | "rejected";

  if (id && (status === "submitted" || status === "accepted" || status === "rejected")) {
    const offer = await getOfferById(id);
    const listing = offer ? await getListingBySlug(offer.listingSlug) : null;

    const canManageOffer =
      user.role === "admin" || (user.role === "seller" && listing?.sellerId === user.id);

    if (!canManageOffer) {
      redirect("/account/offers");
    }

    await updateOfferStatus(id, status, user.role);
    if (status === "accepted" && offer) {
      await ensureTransactionForAcceptedOffer(id);
    }
  }

  revalidatePath("/admin/offers");
  revalidatePath("/seller/offers");
  revalidatePath("/account/offers");
  revalidatePath("/account/transactions");

  redirect(user.role === "seller" ? "/seller/offers" : "/admin/offers");
}

export async function updateTransactionStatusAction(formData: FormData) {
  const user = await requireAdminOrOperator();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as
    | "awaiting-invoice-details"
    | "invoice-issued"
    | "payment-submitted"
    | "payment-verified"
    | "seller-paid"
    | "agreement-sent"
    | "completed";

  if (
    id &&
    (status === "awaiting-invoice-details" ||
      status === "invoice-issued" ||
      status === "payment-submitted" ||
      status === "payment-verified" ||
      status === "seller-paid" ||
      status === "agreement-sent" ||
      status === "completed")
  ) {
    await updateTransactionStatus(id, status, user.role);
  }

  revalidatePath("/admin/transactions");
  revalidatePath("/operations/transfers/pending");
  redirect(user.role === "operator" ? "/operations/transfers/pending" : "/admin/transactions");
}

export async function updateInvoiceStatusAction(formData: FormData) {
  const user = await requireAdminOrOperator();

  const transactionId = String(formData.get("transactionId") ?? "");
  const status = String(formData.get("status") ?? "") as
    | "pending-details"
    | "issued"
    | "payment-submitted"
    | "payment-verified";

  if (
    transactionId &&
    (status === "pending-details" ||
      status === "issued" ||
      status === "payment-submitted" ||
      status === "payment-verified")
  ) {
    await updateInvoiceStatus(transactionId, status, user.role);
  }

  revalidatePath("/admin/transactions");
  revalidatePath("/operations/transfers/pending");
  redirect(user.role === "operator" ? "/operations/transfers/pending" : "/admin/transactions");
}

export async function updateDocumentStatusAction(formData: FormData) {
  const user = await requireAdminOrOperator();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as "pending" | "received";

  if (id && (status === "pending" || status === "received")) {
    await updateDocumentStatus(id, status, user.role);
  }

  redirect(user.role === "operator" ? "/operations/transfers/pending" : "/admin/transactions");
}

export async function updateUserVerificationStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as
    | "pending"
    | "verified"
    | "rejected";

  if (id && (status === "pending" || status === "verified" || status === "rejected")) {
    await updateUserVerificationStatus(id, status);
  }

  redirect("/admin/users");
}

export async function submitVerificationDocumentAction(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get(sessionCookieName)?.value;
  const profilePath = String(formData.get("profilePath") ?? "/account/profile");

  if (!userId) {
    redirect("/login");
  }

  const user = await findUserByEmail(String(formData.get("userEmail") ?? ""));
  if (!user || user.id !== userId) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect(`${profilePath}?error=missing-document-name`);
  }

  const party = user.role === "seller" ? "seller" : "user";
  await createVerificationDocument(user.id, party, name);

  redirect(profilePath);
}

export async function updateVerificationDocumentStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as "pending" | "received";

  if (id && (status === "pending" || status === "received")) {
    await updateVerificationDocumentStatus(id, status);
  }

  redirect("/admin/users");
}

export async function submitListingUpdateRequestAction(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get(sessionCookieName)?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await findUserById(userId);
  if (!user || user.role !== "seller") {
    redirect("/login");
  }

  const listingSlug = String(formData.get("listingSlug") ?? "");
  const requestedDescription = String(formData.get("requestedDescription") ?? "").trim();
  const requestedReservePrice = String(formData.get("requestedReservePrice") ?? "").trim();

  if (!listingSlug || !requestedDescription || !requestedReservePrice) {
    redirect("/seller/listings?error=invalid-update-request");
  }

  const settings = await getSiteSettings();

  await createListingUpdateRequest({
    listingSlug,
    sellerId: user.id,
    requestedDescription,
    requestedCurrentListPrice: settings?.globalListPrice ?? "",
    requestedReservePrice,
  });

  redirect("/seller/listings");
}

export async function updateListingUpdateRequestStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as "approved" | "rejected";

  if (id && (status === "approved" || status === "rejected")) {
    await updateListingUpdateRequestStatus(id, status);
  }

  redirect("/admin/listings");
}

export async function acceptBuyerTermsAction(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get(sessionCookieName)?.value;

  if (!userId) {
    redirect("/login");
  }

  const offerId = String(formData.get("offerId") ?? "");
  if (offerId) {
    await updateOfferBuyerTermsAccepted(offerId, true);
  }

  redirect("/account/offers");
}

export async function submitInvoiceDetailsAction(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get(sessionCookieName)?.value;

  if (!userId) {
    redirect("/login");
  }

  const transactionId = String(formData.get("transactionId") ?? "");
  if (transactionId) {
    await submitTransactionInvoiceDetails(transactionId, {
      fullName: String(formData.get("fullName") ?? "").trim(),
      companyName: String(formData.get("companyName") ?? "").trim(),
      vatNumber: String(formData.get("vatNumber") ?? "").trim(),
      billingAddress: String(formData.get("billingAddress") ?? "").trim(),
      cellNumber: String(formData.get("cellNumber") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
    });
  }

  revalidatePath("/account/offers");
  revalidatePath("/account/transactions");
  redirect(`/account/transactions/${transactionId}/invoice`);
}

export async function uploadPaymentProofAction(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get(sessionCookieName)?.value;

  if (!userId) {
    redirect("/login");
  }

  const transactionId = String(formData.get("transactionId") ?? "");
  const proofFile = formData.get("paymentProof");
  const uploadedProofName =
    proofFile instanceof File && proofFile.name && proofFile.size > 0
      ? proofFile.name.trim()
      : "";
  const proofReference = String(formData.get("proofName") ?? "").trim();
  const proofName = uploadedProofName || proofReference;

  if (transactionId && proofName && proofFile instanceof File && proofFile.size > 0) {
    await submitPaymentProof(
      transactionId,
      proofName,
      proofFile.type || getPaymentProofContentType(proofName),
      Buffer.from(await proofFile.arrayBuffer()),
    );
  }

  revalidatePath("/account/transactions");
  revalidatePath(`/account/transactions/${transactionId}`);
  revalidatePath("/admin/transactions");
  redirect(`/account/transactions/${transactionId}`);
}

export async function verifyTransactionPaymentAction(formData: FormData) {
  const user = await requireAdminOrOperator();
  const transactionId = String(formData.get("transactionId") ?? "");

  if (transactionId) {
    await verifyTransactionPayment(transactionId, user.role);
  }

  revalidatePath("/admin/transactions");
  revalidatePath("/operations/transfers/pending");
  redirect(user.role === "operator" ? "/operations/transfers/pending" : "/admin/transactions");
}

export async function declineTransactionPaymentProofAction(formData: FormData) {
  const user = await requireAdminOrOperator();
  const transactionId = String(formData.get("transactionId") ?? "");

  if (transactionId) {
    await declineTransactionPaymentProof(transactionId, user.role);
  }

  revalidatePath("/admin/transactions");
  revalidatePath(`/admin/transactions/${transactionId}`);
  revalidatePath("/account/transactions");
  revalidatePath(`/account/transactions/${transactionId}`);
  revalidatePath("/operations/transfers/pending");
  redirect(user.role === "operator" ? "/operations/transfers/pending" : "/admin/transactions");
}

export async function issueBuyerAgreementAction(formData: FormData) {
  const user = await requireAdmin();
  const transactionId = String(formData.get("transactionId") ?? "");
  const agreementFile = formData.get("agreementFile");
  const uploadedAgreementName =
    agreementFile instanceof File && agreementFile.name && agreementFile.size > 0
      ? agreementFile.name.trim()
      : "";

  if (transactionId && uploadedAgreementName && agreementFile instanceof File && agreementFile.size > 0) {
    await issueBuyerAgreement(
      transactionId,
      uploadedAgreementName,
      agreementFile.type || getAgreementContentType(uploadedAgreementName),
      Buffer.from(await agreementFile.arrayBuffer()),
      user.role,
    );
  }

  revalidatePath("/admin/transactions");
  revalidatePath(`/admin/transactions/${transactionId}`);
  revalidatePath("/account/transactions");
  revalidatePath(`/account/transactions/${transactionId}`);
  redirect("/admin/transactions?agreementUploaded=1");
}

export async function closeTransactionAction(formData: FormData) {
  const user = await requireAdmin();
  const transactionId = String(formData.get("transactionId") ?? "");

  if (transactionId) {
    await closeTransaction(transactionId, user.role);
  }

  revalidatePath("/admin/transactions");
  revalidatePath("/account/transactions");
  redirect("/admin/transactions");
}

export async function updatePageContentAction(formData: FormData) {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "") as "home" | "contact";
  const eyebrow = String(formData.get("eyebrow") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if ((slug === "home" || slug === "contact") && eyebrow && title && description) {
    await updatePageContent(slug, { eyebrow, title, description });
  }

  redirect("/admin/cms");
}

export async function submitContactRequestAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    redirect("/contact?error=missing-fields");
  }

  await createContactRequest({ name, email, message });
  redirect("/contact?success=1");
}

export async function updateContactRequestStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as "new" | "reviewed";

  if (id && (status === "new" || status === "reviewed")) {
    await updateContactRequestStatus(id, status);
  }

  redirect("/admin/enquiries");
}

export async function updateLeadRequestStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as "new" | "reviewed";

  if (id && (status === "new" || status === "reviewed")) {
    await updateLeadRequestStatus(id, status);
  }

  redirect("/admin/leads");
}

export async function updatePartnerStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as "active" | "draft";

  if (id && (status === "active" || status === "draft")) {
    await updatePartnerStatus(id, status);
  }

  redirect("/admin/partners");
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdmin();

  const supportEmail = String(formData.get("supportEmail") ?? "").trim();
  const supportPhone = String(formData.get("supportPhone") ?? "").trim();
  const globalListPrice = String(formData.get("globalListPrice") ?? "").trim();

  if (supportEmail && supportPhone && globalListPrice) {
    await updateSiteSettings({ supportEmail, supportPhone, globalListPrice });
  }

  redirect("/admin/settings");
}

export async function sendTestEmailAction() {
  await requireAdmin();
  await sendTestEmailRecord();
  redirect("/admin/settings");
}

export async function updateUserRoleAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "") as "user" | "seller" | "operator" | "admin";

  if (!id || (role !== "user" && role !== "seller" && role !== "operator" && role !== "admin")) {
    redirect("/admin/staff");
  }

  const user = await findUserById(id);
  if (!user) {
    redirect("/admin/staff");
  }

  await updateUserRole(id, role);

  redirect("/admin/staff");
}

export async function updateWalletTransactionStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as "pending" | "verified" | "rejected";

  if (id && (status === "pending" || status === "verified" || status === "rejected")) {
    await updateWalletTransactionStatus(id, status);
  }

  redirect("/admin/wallet");
}
