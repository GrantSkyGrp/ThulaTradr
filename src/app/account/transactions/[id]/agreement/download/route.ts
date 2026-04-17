import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getTransactionsByUserId } from "@/lib/local-db";
import { getAgreementContentType } from "@/lib/agreement-storage";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const user = await requireUser();
  const { id } = await params;
  const transactions = await getTransactionsByUserId(user.id);
  const transaction = transactions.find((entry) => entry.id === id);

  if (!transaction || transaction.agreementStatus !== "received" || !transaction.agreementName) {
    return new NextResponse("Buyer agreement is not available.", { status: 404 });
  }

  if (!transaction.agreementData) {
    return new NextResponse("Buyer agreement file is missing. Please ask admin to re-upload it.", {
      status: 404,
    });
  }

  return new NextResponse(Buffer.from(transaction.agreementData), {
    headers: {
      "Content-Type": transaction.agreementContentType || getAgreementContentType(transaction.agreementName),
      "Content-Disposition": `attachment; filename="${transaction.agreementName}"`,
      "Cache-Control": "no-store",
    },
  });
}
