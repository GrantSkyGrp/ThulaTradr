import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAllTransactions, getInvoiceByTransactionId } from "@/lib/local-db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  await requireAdmin();
  const { id } = await params;
  const transactions = await getAllTransactions();
  const transaction = transactions.find((entry) => entry.id === id);

  if (!transaction) {
    return new NextResponse("Transaction not found.", { status: 404 });
  }

  const invoice = await getInvoiceByTransactionId(transaction.id);
  const rows = [
    ["Transaction ID", transaction.id],
    ["Offer ID", transaction.offerId],
    ["Listing", transaction.listingModel],
    ["Buyer Name", transaction.billingFullName || transaction.userName],
    ["Buyer Email", transaction.billingEmail || transaction.userEmail],
    ["Company Name", transaction.billingCompanyName || ""],
    ["VAT Number", transaction.billingVatNumber || ""],
    ["Billing Address", transaction.billingAddress || ""],
    ["Cell Number", transaction.billingCellNumber || ""],
    ["Invoice Number", invoice?.invoiceNumber ?? "Pending"],
    ["Invoice Amount", invoice?.amount ?? "Pending"],
  ];
  const body = rows
    .map(([label, value]) => `"${label}","${String(value).replaceAll('"', '""')}"`)
    .join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="invoice-details-${transaction.id}.csv"`,
    },
  });
}
