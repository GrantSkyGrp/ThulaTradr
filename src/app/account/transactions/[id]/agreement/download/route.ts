import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getTransactionsByUserId } from "@/lib/local-db";
import { getAgreementContentType, readBuyerAgreementFile } from "@/lib/agreement-storage";

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

  let file: Buffer;

  try {
    file = await readBuyerAgreementFile(transaction.id, transaction.agreementName);
  } catch {
    return new NextResponse("Buyer agreement file is missing. Please ask admin to re-upload it.", {
      status: 404,
    });
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": getAgreementContentType(transaction.agreementName),
      "Content-Disposition": `attachment; filename="${transaction.agreementName}"`,
      "Cache-Control": "no-store",
    },
  });
}
