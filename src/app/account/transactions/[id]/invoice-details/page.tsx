import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { submitInvoiceDetailsAction } from "@/app/actions";
import { requireUser } from "@/lib/auth";
import { getTransactionsByUserId } from "@/lib/local-db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccountTransactionInvoiceDetailsPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const transactions = await getTransactionsByUserId(user.id);
  const transaction = transactions.find((entry) => entry.id === id);

  if (!transaction) {
    notFound();
  }

  if (transaction.invoiceDetailsStatus === "submitted") {
    redirect(`/account/transactions/${transaction.id}/payment-proof`);
  }

  return (
    <main className="account-shell">
      <div className="container-shell">
        <div className="admin-toolbar">
          <Link href={`/account/transactions/${transaction.id}`} className="site-nav__button">
            Back to Transaction
          </Link>
          <Link href="/account/offers" className="site-nav__button">
            My Offers
          </Link>
        </div>

        <article className="account-card transaction-detail">
          <div className="transaction-detail__hero">
            <div>
              <div className="thula-kicker">Step 1</div>
              <h1 className="account-title">Invoice details</h1>
              <p className="account-copy">
                Enter billing information for {transaction.listingModel}. Once submitted, Thula
                issues the invoice and unlocks the payment-proof step.
              </p>
            </div>
          </div>

          <section className="transaction-panel">
            <form action={submitInvoiceDetailsAction} className="auth-form">
              <input type="hidden" name="transactionId" value={transaction.id} />
              <label className="auth-field">
                <span>Full Name</span>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={transaction.billingFullName || user.name}
                  required
                />
              </label>
              <label className="auth-field">
                <span>Company Name</span>
                <input
                  type="text"
                  name="companyName"
                  defaultValue={transaction.billingCompanyName}
                  placeholder="Optional"
                />
              </label>
              <label className="auth-field">
                <span>VAT if registered</span>
                <input
                  type="text"
                  name="vatNumber"
                  defaultValue={transaction.billingVatNumber}
                  placeholder="Optional"
                />
              </label>
              <label className="auth-field">
                <span>Billing Address</span>
                <textarea
                  name="billingAddress"
                  rows={4}
                  defaultValue={transaction.billingAddress}
                  required
                />
              </label>
              <label className="auth-field">
                <span>Cell Number</span>
                <input
                  type="text"
                  name="cellNumber"
                  defaultValue={transaction.billingCellNumber || user.phone}
                  required
                />
              </label>
              <label className="auth-field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  defaultValue={transaction.billingEmail || user.email}
                  required
                />
              </label>
              <button type="submit" className="site-nav__button">
                Submit And Continue
              </button>
            </form>
          </section>
        </article>
      </div>
    </main>
  );
}
