import Link from "next/link";
import { requireOperator } from "@/lib/auth";
import { getAllTransactions } from "@/lib/local-db";

export default async function OperationsCompletedTransfersPage() {
  await requireOperator();
  const transactions = await getAllTransactions();
  const completed = transactions.filter((transaction) => transaction.status === "completed");

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Operations</div>
          <h1 className="admin-title">Completed transaction queue</h1>
          <p className="admin-copy">
            Closed transactions remain visible here for final operational reference.
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
          {completed.length === 0 ? (
            <article className="account-card">
              <h3>No completed transactions yet</h3>
              <p>Transactions closed by admin will appear here.</p>
            </article>
          ) : (
            completed.map((transaction) => (
              <article key={transaction.id} className="account-card">
                <div className="account-card__top">
                  <div>
                    <h3>{transaction.listingModel}</h3>
                    <p>{transaction.userName}</p>
                  </div>
                  <span className="fleet-status fleet-status--accepted">{transaction.status}</span>
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
