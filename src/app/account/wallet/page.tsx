import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getWalletTransactionsByUserId } from "@/lib/local-db";

export default async function AccountWalletPage() {
  const user = await requireUser();
  const transactions = await getWalletTransactionsByUserId(user.id);

  return (
    <main className="account-shell">
      <div className="container-shell">
        <div className="account-header">
          <div className="thula-kicker">Wallet</div>
          <h1 className="account-title">Wallet history</h1>
          <p className="account-copy">
            This is the local wallet history surface for refunds and top-ups, without any live payment gateway.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/account/offers" className="site-nav__button">
            My Offers
          </Link>
          <Link href="/account/transactions" className="site-nav__button">
            Transactions
          </Link>
          <Link href="/account/wallet" className="site-nav__button">
            Wallet
          </Link>
        </div>

        <div className="account-list">
          {transactions.length === 0 ? (
            <article className="account-card">
              <h3>No wallet history yet</h3>
              <p>Refund and top-up entries will appear here.</p>
            </article>
          ) : (
            transactions.map((transaction) => (
              <article key={transaction.id} className="account-card">
                <div className="account-card__top">
                  <div>
                    <h3>{transaction.type}</h3>
                    <p>{new Date(transaction.createdAt).toLocaleString("en-ZA")}</p>
                  </div>
                  <span
                    className={`fleet-status ${
                      transaction.status === "verified"
                        ? "fleet-status--accepted"
                        : transaction.status === "rejected"
                          ? "fleet-status--rejected"
                          : "fleet-status--pending"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
                <div className="account-card__grid">
                  <div>
                    <h5>Amount</h5>
                    <strong>{transaction.amount}</strong>
                  </div>
                  <div>
                    <h5>Proof Reference</h5>
                    <strong>{transaction.proofName}</strong>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
