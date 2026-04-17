import { NextResponse } from "next/server";
import { requireAdminOrOperator } from "@/lib/auth";
import { getAllTransactions } from "@/lib/local-db";
import { getPaymentProofContentType, readPaymentProofFile } from "@/lib/payment-proof-storage";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  await requireAdminOrOperator();
  const { id } = await params;
  const transactions = await getAllTransactions();
  const transaction = transactions.find((entry) => entry.id === id);

  if (!transaction || !transaction.paymentProofName) {
    return new NextResponse("Payment proof is not available.", { status: 404 });
  }

  let file: Buffer;

  try {
    file = await readPaymentProofFile(transaction.id, transaction.paymentProofName);
  } catch {
    return new NextResponse("Payment proof file is missing. Please ask the buyer to re-upload it.", {
      status: 404,
    });
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": getPaymentProofContentType(transaction.paymentProofName),
      "Content-Disposition": `attachment; filename="${transaction.paymentProofName}"`,
      "Cache-Control": "no-store",
    },
  });
}
