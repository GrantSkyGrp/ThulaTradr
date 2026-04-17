import Link from "next/link";
import { requireOperator } from "@/lib/auth";
import { getAllTransactions } from "@/lib/local-db";

export default async function OperationsPendingTransfersPage() {
  await requireOperator();
  const transactions = await getAllTransactions();
  const pending = transactions.filter((transaction) => transaction.status !== "completed");

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Operations</div>
          <h1 className="admin-title">Active transaction queue</h1>
          <p className="admin-copy">
            Operators can monitor payment verification, seller payout, and agreement issue here.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/operations/transfers/pending" className="site-nav__button">
            Pending
          </Link>
          <Link href="/operations/transfers/completed" className="site-nav__button">
            Completed
          </Link>
        </div>

        <div className="account-list">
          {pending.length === 0 ? (
            <article className="account-card">
              <h3>No active transactions</h3>
              <p>Transactions still moving toward closeout will appear here.</p>
            </article>
          ) : (
            pending.map((transaction) => (
              <article key={transaction.id} className="account-card">
                <div className="account-card__top">
                  <div>
                    <h3>{transaction.listingModel}</h3>
                    <p>{transaction.userName}</p>
                  </div>
                  <span className="fleet-status fleet-status--pending">{transaction.status}</span>
                </div>

                <div className="account-card__grid">
                  <div>
                    <h5>Invoice Details</h5>
                    <strong>{transaction.invoiceDetailsStatus}</strong>
                  </div>
                  <div>
                    <h5>Payment Proof</h5>
                    <strong>{transaction.paymentProofStatus}</strong>
                  </div>
                  <div>
                    <h5>Buyer Agreement</h5>
                    <strong>{transaction.agreementStatus}</strong>
                  </div>
                </div>

                <div className="account-card__actions">
                  <Link href={`/operations/transfers/${transaction.id}`} className="site-nav__button">
                    Open Transfer
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
