import { PrintButton } from "@/components/shared/print-button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InvoiceDetail } from "@/components/transactions/invoice-detail";
import { requireUser } from "@/lib/auth";
import { getInvoiceByTransactionId, getTransactionsByUserId } from "@/lib/local-db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccountInvoicePage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const transactions = await getTransactionsByUserId(user.id);
  const transaction = transactions.find((entry) => entry.id === id);

  if (!transaction) {
    notFound();
  }

  const invoice = await getInvoiceByTransactionId(transaction.id);

  return (
    <main className="account-shell">
      <div className="container-shell">
        <div className="admin-toolbar">
          <Link href={`/account/transactions/${transaction.id}`} className="site-nav__button">
            Back to Transaction
          </Link>
          <Link
            href={`/account/transactions/${transaction.id}/invoice/pdf`}
            className="site-nav__button"
            target="_blank"
          >
            Open PDF
          </Link>
          <Link
            href={`/account/transactions/${transaction.id}/payment-proof`}
            className="site-nav__button"
          >
            Continue To Payment Proof
          </Link>
          <PrintButton />
        </div>

        <InvoiceDetail
          title={`Invoice for ${transaction.listingModel}`}
          copy="This invoice is generated from the submitted billing details. Review or open the PDF before continuing to proof of payment."
          transaction={transaction}
          invoice={invoice}
        />
      </div>
    </main>
  );
}
