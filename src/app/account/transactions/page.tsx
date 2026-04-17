import Link from "next/link";
import { requireUser } from "@/lib/auth";
import {
  getTransactionsByUserId,
  getInvoiceByTransactionId,
  getDocumentsByTransactionId,
} from "@/lib/local-db";

export default async function AccountTransactionsPage() {
  const user = await requireUser();
  const transactions = await getTransactionsByUserId(user.id);

  const bundles = await Promise.all(
    transactions.map(async (transaction) => ({
      transaction,
      invoice: await getInvoiceByTransactionId(transaction.id),
      documents: await getDocumentsByTransactionId(transaction.id),
    })),
  );

  return (
    <main className="account-shell">
      <div className="container-shell">
        <div className="account-header">
          <div className="thula-kicker">Transactions</div>
          <h1 className="account-title">Accepted offers in progress</h1>
          <p className="account-copy">
            Follow each deal from invoice issue through payment verification, seller payout,
            agreement issue, and final ownership transfer.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/account/offers" className="site-nav__button">
            My Offers
          </Link>
          <Link href="/account/transactions" className="site-nav__button">
            Transactions
          </Link>
        </div>

        <div className="account-list">
          {bundles.length === 0 ? (
            <article className="account-card">
              <h3>No transactions yet</h3>
              <p>Accepted offers will open a transaction record here.</p>
            </article>
          ) : (
            bundles.map(({ transaction, invoice, documents }) => (
              <article key={transaction.id} className="account-card">
                <div className="account-card__top">
                  <div>
                    <h3>{transaction.listingModel}</h3>
                    <p>{transaction.listingSlug}</p>
                  </div>
                  <span className="fleet-status fleet-status--accepted">{transaction.status}</span>
                </div>

                <div className="account-card__grid">
                  <div>
                    <h5>Invoice</h5>
                    <strong>{invoice?.invoiceNumber ?? "Pending"}</strong>
                  </div>
                  <div>
                    <h5>Invoice Amount</h5>
                    <strong>{invoice?.amount ?? "Pending"}</strong>
                  </div>
                  <div>
                    <h5>Invoice Status</h5>
                    <strong>{invoice?.status ?? "Pending"}</strong>
                  </div>
                  <div>
                    <h5>Current Stage</h5>
                    <strong>{transaction.status}</strong>
                  </div>
                  <div>
                    <h5>Documents Outstanding</h5>
                    <strong>
                      {documents.filter((document) => document.status === "pending").length}
                    </strong>
                  </div>
                </div>

                <div className="transaction-documents">
                  {documents.map((document) => (
                    <div key={document.id} className="transaction-documents__item">
                      <span>{document.name}</span>
                      <span>{document.party}</span>
                      <strong>{document.status}</strong>
                    </div>
                  ))}
                </div>

                <div className="account-card__actions">
                  <Link
                    href={`/account/transactions/${transaction.id}`}
                    className="site-nav__button"
                  >
                    View Transaction
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
