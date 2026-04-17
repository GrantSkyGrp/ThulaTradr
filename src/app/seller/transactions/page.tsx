import Link from "next/link";
import { requireSeller } from "@/lib/auth";
import {
  getTransactionsBySellerId,
  getInvoiceByTransactionId,
  getDocumentsByTransactionId,
} from "@/lib/local-db";

export default async function SellerTransactionsPage() {
  const seller = await requireSeller();
  const transactions = await getTransactionsBySellerId(seller.id);

  const bundles = await Promise.all(
    transactions.map(async (transaction) => ({
      transaction,
      invoice: await getInvoiceByTransactionId(transaction.id),
      documents: await getDocumentsByTransactionId(transaction.id),
    })),
  );

  return (
    <main className="seller-shell">
      <div className="container-shell">
        <div className="seller-header">
          <div className="thula-kicker">Seller Workspace</div>
          <h1 className="admin-title">Seller transaction progress</h1>
          <p className="admin-copy">
            This gives the seller visibility into accepted deals, documents, and invoice
            progress tied to their owned fleet.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/seller/listings" className="site-nav__button">
            My Fleet
          </Link>
          <Link href="/seller/offers" className="site-nav__button">
            Offer Inbox
          </Link>
          <Link href="/seller/transactions" className="site-nav__button">
            Seller Transactions
          </Link>
          <Link href="/seller/profile" className="site-nav__button">
            Seller Profile
          </Link>
        </div>

        <div className="account-list">
          {bundles.length === 0 ? (
            <article className="account-card">
              <h3>No seller transactions yet</h3>
              <p>Accepted buyer offers on your listings will appear here.</p>
            </article>
          ) : (
            bundles.map(({ transaction, invoice, documents }) => (
              <article key={transaction.id} className="account-card">
                <div className="account-card__top">
                  <div>
                    <h3>{transaction.listingModel}</h3>
                    <p>{transaction.userName}</p>
                  </div>
                  <span className="fleet-status fleet-status--accepted">
                    {transaction.status}
                  </span>
                </div>

                <div className="account-card__grid">
                  <div>
                    <h5>Invoice</h5>
                    <strong>{invoice?.invoiceNumber ?? "Pending"}</strong>
                  </div>
                  <div>
                    <h5>Amount</h5>
                    <strong>{invoice?.amount ?? "Pending"}</strong>
                  </div>
                  <div>
                    <h5>Invoice Status</h5>
                    <strong>{invoice?.status ?? "Pending"}</strong>
                  </div>
                  <div>
                    <h5>Documents Pending</h5>
                    <strong>
                      {documents.filter((document) => document.status === "pending").length}
                    </strong>
                  </div>
                </div>

                <div className="account-card__actions">
                  <Link
                    href={`/seller/transactions/${transaction.id}`}
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
