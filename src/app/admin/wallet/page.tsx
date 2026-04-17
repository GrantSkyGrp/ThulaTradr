import Link from "next/link";
import { updateWalletTransactionStatusAction } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { getAllWalletTransactions } from "@/lib/local-db";

export default async function AdminWalletPage() {
  await requireAdmin();
  const transactions = await getAllWalletTransactions();

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin Wallet</div>
          <h1 className="admin-title">Refund and top-up oversight</h1>
          <p className="admin-copy">
            This is the local-only wallet operations surface for refund and top-up verification.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin" className="site-nav__button">
            Overview
          </Link>
          <Link href="/admin/wallet" className="site-nav__button">
            Wallet
          </Link>
          <Link href="/admin/reports" className="site-nav__button">
            Reports
          </Link>
        </div>

        <div className="admin-table">
          <div className="admin-table__row admin-table__row--head">
            <span>User</span>
            <span>Type</span>
            <span>Amount</span>
            <span>Proof</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {transactions.map((transaction) => (
            <div key={transaction.id} className="admin-table__row">
              <span>{transaction.userId}</span>
              <span>{transaction.type}</span>
              <span>{transaction.amount}</span>
              <span>{transaction.proofName}</span>
              <span>{transaction.status}</span>
              <form action={updateWalletTransactionStatusAction} className="admin-inline-form admin-inline-form--stack">
                <input type="hidden" name="id" value={transaction.id} />
                <button type="submit" name="status" value="verified" className="site-nav__button">
                  Verify
                </button>
                <button type="submit" name="status" value="rejected" className="site-nav__button">
                  Reject
                </button>
                <button type="submit" name="status" value="pending" className="site-nav__button">
                  Reset
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
