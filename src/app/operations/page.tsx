import Link from "next/link";
import { requireOperator } from "@/lib/auth";
import { getAllTransactions } from "@/lib/local-db";

export default async function OperationsIndexPage() {
  await requireOperator();
  const transactions = await getAllTransactions();
  const pending = transactions.filter((transaction) => transaction.status !== "completed").length;
  const completed = transactions.filter((transaction) => transaction.status === "completed").length;

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Operations</div>
          <h1 className="admin-title">Transaction operations overview</h1>
          <p className="admin-copy">
            This workspace tracks operational deals from payment review through final closeout.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/operations" className="site-nav__button">
            Overview
          </Link>
          <Link href="/operations/transfers/pending" className="site-nav__button">
            Pending
          </Link>
          <Link href="/operations/transfers/completed" className="site-nav__button">
            Completed
          </Link>
        </div>

        <section className="admin-overview-grid">
          <article className="account-card">
            <h3>Active Transactions</h3>
            <strong>{pending}</strong>
            <p>Transactions still moving through payment, payout, and agreement stages.</p>
          </article>
          <article className="account-card">
            <h3>Completed Queue</h3>
            <strong>{completed}</strong>
            <p>Transactions already closed and transferred to the buyer.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
