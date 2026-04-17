import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  getAllContactRequests,
  getAllLeadRequests,
  getAllListings,
  getAllOffers,
  getAllTransactions,
  getAllUsers,
  getAllWalletTransactions,
} from "@/lib/local-db";

export default async function AdminReportsPage() {
  await requireAdmin();

  const [listings, offers, transactions, users, contacts, leads, wallet] = await Promise.all([
    getAllListings(),
    getAllOffers(),
    getAllTransactions(),
    getAllUsers(),
    getAllContactRequests(),
    getAllLeadRequests(),
    getAllWalletTransactions(),
  ]);

  const acceptedOffers = offers.filter((offer) => offer.status === "accepted").length;
  const verifiedUsers = users.filter((user) => user.verificationStatus === "verified").length;

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin Reports</div>
          <h1 className="admin-title">Platform reporting snapshot</h1>
          <p className="admin-copy">
            This is a lightweight reporting layer across marketplace, operations, and inbound lead flow.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin" className="site-nav__button">
            Overview
          </Link>
          <Link href="/admin/leads" className="site-nav__button">
            Leads
          </Link>
          <Link href="/admin/partners" className="site-nav__button">
            Partners
          </Link>
          <Link href="/admin/reports" className="site-nav__button">
            Reports
          </Link>
        </div>

        <section className="admin-overview-grid">
          <article className="account-card">
            <h3>Listings</h3>
            <strong>{listings.length}</strong>
            <p>Managed fleet records in the platform.</p>
          </article>
          <article className="account-card">
            <h3>Accepted Offers</h3>
            <strong>{acceptedOffers}</strong>
            <p>Offers that have progressed into transaction flow.</p>
          </article>
          <article className="account-card">
            <h3>Transactions</h3>
            <strong>{transactions.length}</strong>
            <p>Operational transaction records currently stored.</p>
          </article>
          <article className="account-card">
            <h3>Verified Users</h3>
            <strong>{verifiedUsers}</strong>
            <p>Buyer, seller, admin, and operator users marked verified.</p>
          </article>
          <article className="account-card">
            <h3>Contact Enquiries</h3>
            <strong>{contacts.length}</strong>
            <p>Public contact requests received through the site.</p>
          </article>
          <article className="account-card">
            <h3>Lead Requests</h3>
            <strong>{leads.length}</strong>
            <p>Combined demo, bespoke, and newsletter leads.</p>
          </article>
          <article className="account-card">
            <h3>Wallet Transactions</h3>
            <strong>{wallet.length}</strong>
            <p>Refund and top-up records in local wallet flow.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
