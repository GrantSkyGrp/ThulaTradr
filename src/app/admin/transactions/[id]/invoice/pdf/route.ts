import { notFound } from "next/navigation";
import { requireAdminOrOperator } from "@/lib/auth";
import { getAllTransactions, getInvoiceByTransactionId } from "@/lib/local-db";
import { createInvoicePdfBuffer } from "@/lib/pdf/invoice-pdf";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  await requireAdminOrOperator();

  const { id } = await params;
  const transaction = (await getAllTransactions()).find((entry) => entry.id === id);

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
  const shouldDownload = new URL(request.url).searchParams.get("download") === "1";

  return new Response(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${shouldDownload ? "attachment" : "inline"}; filename="${invoice.invoiceNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
