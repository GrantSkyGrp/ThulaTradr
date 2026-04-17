import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getInvoiceByTransactionId, getTransactionsByUserId } from "@/lib/local-db";
import { createInvoicePdfBuffer } from "@/lib/pdf/invoice-pdf";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const transactions = await getTransactionsByUserId(user.id);
  const transaction = transactions.find((entry) => entry.id === id);

  if (!transaction) {
    notFound();
  }

  const invoice = await getInvoiceByTransactionId(transaction.id);
  if (!invoice) {
    notFound();
  }

  const issuedAt = new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(invoice.createdAt));

  const pdf = createInvoicePdfBuffer({
    invoiceNumber: invoice.invoiceNumber,
    issuedAt,
    listingModel: transaction.listingModel,
    buyerName: transaction.userName,
    buyerEmail: transaction.userEmail,
    billingName: transaction.billingFullName,
    companyName: transaction.billingCompanyName,
    vatNumber: transaction.billingVatNumber,
    billingAddress: transaction.billingAddress,
    billingCellNumber: transaction.billingCellNumber,
    billingEmail: transaction.billingEmail,
    amount: invoice.amount,
  });

  return new Response(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
